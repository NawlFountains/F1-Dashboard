import json
import fastf1
import pandas as pd
from pathlib import Path

CACHE_DIR = Path("data/cache")

def _timedelta_to_str(value) -> str | None:
    if pd.isna(value):
        return None
    total_seconds = value.total_seconds()
    minutes = int(total_seconds // 60)
    seconds = total_seconds % 60
    return f"{minutes}:{seconds:06.3f}"

def _normalize_driver_results(driver_results: dict) -> dict:
    return {
        "driver_number": int(driver_results["DriverNumber"]),
        "abbreviation": driver_results["Abbreviation"],
        "driver_id": driver_results["DriverId"],
        "team_name": driver_results["TeamName"],
        "team_color": driver_results["TeamColor"],
        "driver_name": driver_results["FullName"],
        "position": driver_results["Position"],
        "qualy_position": driver_results["ClassifiedPosition"],
        "grid_position": driver_results["GridPosition"],
        "points": driver_results["Points"],
        "status": driver_results["Status"],
        "laps": driver_results["Laps"],
        "time": _timedelta_to_str(driver_results["Time"])
    }

def _cache_file(year: int, round_number: int) -> Path:
    return CACHE_DIR / f"results_{year}_round_{round_number}.json"

def _is_stale(cache_file: Path) -> bool:
    if not cache_file.exists():
        return True
    return False

def _fetch_and_cache_race_results(year: int, round_number: int):
    try:
        cache_file = _cache_file(year, round_number)

        race_session = fastf1.get_session(year, round_number, 'R')
        race_session.load()
        race_results = race_session.results

        cache_file.parent.mkdir(parents=True, exist_ok=True)

        normalized_results = []

        for _, driver_results in race_results.iterrows():
            normalized_results.append(_normalize_driver_results(driver_results))

        with open(cache_file, "w") as f:
            json.dump(normalized_results, f)

        return normalized_results
    except ValueError as e:
        raise ValueError(e)

def get_cached_results(year: int, round_number: int):
    cache_file = _cache_file(year, round_number)

    if _is_stale(cache_file):
        return _fetch_and_cache_race_results(year, round_number)
    
    with open(cache_file) as f:
        return json.load(f)

if __name__ == "__main__":
    get_cached_results(2026,4)
