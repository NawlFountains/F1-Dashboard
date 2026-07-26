import json
import fastf1
from pathlib import Path
from datetime import date, datetime, timedelta

CACHE_DIR = Path("data/cache")
MAX_AGE_DAYS = 7

def _normalize_event(event: dict) -> dict:
    return {
        "round_number": event["RoundNumber"],
        "event_name": event["EventName"],
        "country": event["Country"],
        "location": event["Location"],
        "event_date": event["EventDate"].isoformat() + "Z" if event["EventDate"] else None,
        "sessions": [
            {
                "name": event.get(f"Session{i}"),
                "date": event[f"Session{i}Date"].isoformat() + "Z" if event.get(f"Session{i}Date") else None,
            }
            for i in range(1, 6) if event.get(f"Session{i}")
        ],
    }

def _cache_file(year: int) -> Path:
    return CACHE_DIR / f"schedule_{year}.json"

def _is_stale(cache_file: Path) -> bool:
    if not cache_file.exists():
        return True
    modified = datetime.fromtimestamp(cache_file.stat().st_atime).date()
    return (date.today() - modified) > timedelta(days=MAX_AGE_DAYS)

def _fetch_and_cache_schedule(year: int):
    cache_file = _cache_file(year)

    schedule = fastf1.get_event_schedule(year)

    cache_file.parent.mkdir(parents=True, exist_ok=True)

    normalized_schedule = []

    for _, event in schedule.iterrows():
        normalized_schedule.append(_normalize_event(event))

    with open(cache_file, "w") as f:
        json.dump(normalized_schedule, f)
    return normalized_schedule

def get_cached_schedule(year: int):
    cache_file = _cache_file(year)

    if _is_stale(cache_file):
        return _fetch_and_cache_schedule(year)
    
    with open(cache_file) as f:
        return json.load(f)


def get_current_or_next_event(year: int | None = date.today().year) -> dict | None:
    today = date.today().isoformat()
    schedule = get_cached_schedule(year)

    for event in schedule:
        if event["EventDate"] >= today:
            return event

    return None

if __name__ == "__main__":
    get_cached_schedule(2025)
