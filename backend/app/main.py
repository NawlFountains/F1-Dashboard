import json
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from cache.schedule_cache import get_current_or_next_event, get_cached_schedule
from cache.results_cache import get_cached_results

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

def load_json_file(filename: str):
    file_path = DATA_DIR / filename
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Data file '{filename}' not found. Run the scraper first."
        )
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/health")
def healthcheck():
    return {"status": "ok"}

@app.get("/api/race_result/{year}/{round_number}")
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

@app.get("/api/upgrades/{year}/{race_slug}")
def get_race_summaries(year: int, race_slug: str):
    filename = f"{year}_{race_slug}/team_summaries.json"
    return load_json_file(filename)

@app.get("/api/upgrades/{year}/{race_slug}/{team}")
def get_team_summary(year: int, race_slug: str, team: str):
    filename = f"{year}_{race_slug}/team_summaries.json"
    summaries = load_json_file(filename)

    cleaned_team = team.strip()
    summary = summaries.get(cleaned_team)

    if summary is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No data found for team '{cleaned_team}' in '{race_slug}'."
        )

    return {"team": cleaned_team, "summary": summary}
