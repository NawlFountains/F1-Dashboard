import os
import json
import fastf1
import math
import pandas as pd
from pathlib import Path
from .enums import SessionType

def _safe(value):
    """Convert NaN/NaT to None; pass everything else through."""
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    if pd.isna(value):  # catches NaT, pandas NA, etc.
        return None
    if isinstance(value, pd.Timedelta):
        return _timedelta_to_str(value)
    return value


def _safe_int(value):
    """Cast to int, but return None if the value is missing/NaN."""
    safe_value = _safe(value)
    return int(safe_value) if safe_value is not None else None

def _timedelta_to_str(value) -> str | None:
    if pd.isna(value):
        return None
    total_seconds = value.total_seconds()
    minutes = int(total_seconds // 60)
    seconds = total_seconds % 60
    return f"{minutes}:{seconds:06.3f}"



def _normalize_race_results(driver_results: dict) -> dict:
    """Race and Sprint share this schema."""
    return {
        "driver_number": _safe_int(driver_results["DriverNumber"]),
        "abbreviation": _safe(driver_results["Abbreviation"]),
        "driver_id": _safe(driver_results["DriverId"]),
        "team_name": _safe(driver_results["TeamName"]),
        "team_color": _safe(driver_results["TeamColor"]),
        "driver_name": _safe(driver_results["FullName"]),
        "position": _safe(driver_results["Position"]),
        "grid_position": _safe(driver_results["GridPosition"]),
        "points": _safe(driver_results["Points"]),
        "status": _safe(driver_results["Status"]),
        "laps": _safe_int(driver_results["Laps"]),
        "time": _safe(driver_results["Time"]),
    }


def _normalize_qualifying_results(driver_results: dict) -> dict:
    """Qualifying and Sprint Qualifying/Shootout share this schema."""
    return {
        "driver_number": _safe_int(driver_results["DriverNumber"]),
        "abbreviation": _safe(driver_results["Abbreviation"]),
        "driver_id": _safe(driver_results["DriverId"]),
        "team_name": _safe(driver_results["TeamName"]),
        "team_color": _safe(driver_results["TeamColor"]),
        "driver_name": _safe(driver_results["FullName"]),
        "position": _safe(driver_results["Position"]),
        "q1": _safe(driver_results["Q1"]),
        "q2": _safe(driver_results["Q2"]),
        "q3": _safe(driver_results["Q3"]),
    }


def _normalize_practice_results(driver_results: dict) -> dict:
    """FP1/FP2/FP3 — no classification, just best lap."""
    return {
        "driver_number": _safe_int(driver_results["DriverNumber"]),
        "abbreviation": _safe(driver_results["Abbreviation"]),
        "driver_id": _safe(driver_results["DriverId"]),
        "team_name": _safe(driver_results["TeamName"]),
        "team_color": _safe(driver_results["TeamColor"]),
        "driver_name": _safe(driver_results["FullName"]),
        "best_time": _safe(driver_results["Time"]),
    }

_NORMALIZERS = {
    "R": _normalize_race_results,
    "S": _normalize_race_results,
    "Q": _normalize_qualifying_results,
    "SQ": _normalize_qualifying_results,
    "SS": _normalize_qualifying_results,
    "FP1": _normalize_practice_results,
    "FP2": _normalize_practice_results,
    "FP3": _normalize_practice_results,
}

def _normalize_session_results(session_name: str, driver_results: dict) -> dict:
    return _NORMALIZERS[session_name](driver_results)

def _cache_file(year: int, round_number: int, session_type: SessionType) -> Path:
    folder_path = f"data/{year}_round_{round_number}"
    os.makedirs(folder_path, exist_ok=True)
    folder_path = Path(folder_path)
    return folder_path / f"session_{session_type.value}_results.json"

def _is_stale(cache_file: Path) -> bool:
    if not cache_file.exists():
        return True
    return False

def _fetch_and_cache_session_results(year: int, round_number: int, session_type: SessionType):
    try:
        cache_file = _cache_file(year, round_number, session_type)

        session = fastf1.get_session(year, round_number, session_type.value)
        session.load()
        session_results= session.results

        cache_file.parent.mkdir(parents=True, exist_ok=True)

        normalized_results = []

        for _, driver_results in session_results.iterrows():
            normalized_results.append(_normalize_session_results(session_type.value ,driver_results))

        with open(cache_file, "w") as f:
            json.dump(normalized_results, f)

        return normalized_results
    except ValueError as e:
        raise ValueError(e)

def get_cached_results(year: int, round_number: int, session_type: SessionType):
    cache_file = _cache_file(year, round_number, session_type)

    if _is_stale(cache_file):
        return _fetch_and_cache_session_results(year, round_number, session_type)
    
    with open(cache_file) as f:
        return json.load(f)

if __name__ == "__main__":
    session_type_aux = SessionType('FP1')
    get_cached_results(2026,4,session_type_aux)
