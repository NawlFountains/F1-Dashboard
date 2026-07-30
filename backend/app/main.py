import json
from pathlib import Path

from groq import file_from_path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from cache.enums import SessionType
from cache.schedule_cache import get_current_or_next_event, get_cached_schedule
from cache.results_cache import get_cached_results
from cache.laps_cache import get_cached_laps
from scraper.run_weekend import process_race_weekend

app = FastAPI(title='F1 upgrades API')

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

def fetch_summaries(year: int, round_number: int):
    try:
        process_race_weekend(year, round_number, None)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"No entry document entry for ${year} round ${round_number}")

def get_summaries_json_file(year: int, round_number: int):
    filename = f"{year}_round_{round_number}/team_summaries.json"
    file_path = DATA_DIR / filename
    if not file_path.exists():
        fetch_summaries(year, round_number)
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_laps_json_file(year: int, round_number: int, session_type: SessionType):
    filename = f"{year}_round_{round_number}/session_{session_type.value}_laps.json"
    file_path = DATA_DIR / filename
    if not file_path.exists():
        get_cached_laps(year, round_number, session_type)
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/health")
def healthcheck():
    return {"status": "ok"}

@app.get("/api/laps/{year}/{round_number}/{session_type}/{driver}")
def get_driver_laps(year: int, round_number: int, session_type: SessionType, driver: str):
    all_laps = get_laps_json_file(year, round_number, session_type)  # list[dict], all drivers, cached per session
    cleaned_driver = driver.strip().upper()
    driver_laps = [lap for lap in all_laps if lap["abbreviation"] == cleaned_driver]
    if not driver_laps:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No laps found for driver '{cleaned_driver}' in session {session_type.value}, round {round_number}."
        )
    return driver_laps

@app.get("/api/results/{year}/{round_number}/{session_type}")
def get_session_results(year: int, round_number: int, session_type: SessionType):
    try:
        return get_cached_results(year, round_number, session_type)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/schedule/current")
def get_current_event():
    event = get_current_or_next_event()
    if not event:
        raise HTTPException(status_code=404, detail="No upcoming event found")
    return event

@app.get("/api/schedule/{year}")
def get_full_schedule(year: int):
    return get_cached_schedule(year)

@app.get("/api/upgrades/{year}/{round_number}")
def get_race_summaries(year: int, round_number: int):
    return get_summaries_json_file(year, round_number)

@app.get("/api/upgrades/{year}/{round_number}/{team}")
def get_team_summary(year: int, round_number: int, team: str):
    summaries = get_summaries_json_file(year, round_number) 

    cleaned_team = team.strip()
    summary = summaries.get(cleaned_team)

    if summary is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No data found for team '{cleaned_team}' in round '{round_number}'."
        )

    return summary
