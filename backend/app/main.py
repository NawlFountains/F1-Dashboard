import json
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from cache.schedule_cache import get_current_or_next_event, get_cached_schedule
from cache.results_cache import get_cached_results
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

@app.get("/health")
def healthcheck():
    return {"status": "ok"}

@app.get("/api/results/{year}/{round_number}/race")
def get_race_results(year: int, round_number: int):
    try:
        return get_cached_results(year, round_number)
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
