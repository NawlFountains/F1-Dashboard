import os
import json
import fastf1
import pandas as pd
from pathlib import Path
from .enums import SessionType
from .parse_utils import _safe, _safe_int

def _normalize_lap(lap_data: dict) -> dict:
    """Shared schema across all session types — Race, Sprint, Qualifying, Practice."""
    return {
        "time": _safe(lap_data["Time"]),
        "abbreviation": _safe(lap_data["Driver"]),
        "driver_number": _safe_int(lap_data["DriverNumber"]),
        "lap_time": _safe(lap_data["LapTime"]),
        "lap_number": _safe_int(lap_data["LapNumber"]),
        "stint": _safe_int(lap_data["Stint"]),
        "pit_out_time": _safe(lap_data["PitOutTime"]),
        "pit_in_time": _safe(lap_data["PitInTime"]),
        "sector_1_time": _safe(lap_data["Sector1Time"]),
        "sector_2_time": _safe(lap_data["Sector2Time"]),
        "sector_3_time": _safe(lap_data["Sector3Time"]),
        "sector_1_session_time": _safe(lap_data["Sector1SessionTime"]),
        "sector_2_session_time": _safe(lap_data["Sector2SessionTime"]),
        "sector_3_session_time": _safe(lap_data["Sector3SessionTime"]),
        "speed_i1": _safe(lap_data["SpeedI1"]),
        "speed_i2": _safe(lap_data["SpeedI2"]),
        "speed_fl": _safe(lap_data["SpeedFL"]),
        "speed_st": _safe(lap_data["SpeedST"]),
        "is_personal_best": bool(lap_data["IsPersonalBest"]) if not pd.isna(lap_data["IsPersonalBest"]) else False,
        "compound": _safe(lap_data["Compound"]),
        "tyre_life": _safe_int(lap_data["TyreLife"]),
        "fresh_tyre": bool(lap_data["FreshTyre"]) if not pd.isna(lap_data["FreshTyre"]) else None,
        "team_name": _safe(lap_data["Team"]),
        "lap_start_time": _safe(lap_data["LapStartTime"]),
        "lap_start_date": _safe(lap_data["LapStartDate"]),
        "track_status": _safe(lap_data["TrackStatus"]),
        "position": _safe(lap_data["Position"]),
        "deleted": bool(lap_data["Deleted"]) if not pd.isna(lap_data["Deleted"]) else False,
        "deleted_reason": _safe(lap_data["DeletedReason"]),
        "is_accurate": bool(lap_data["IsAccurate"]) if not pd.isna(lap_data["IsAccurate"]) else False,
    }
def _cache_file(year: int, round_number: int, session_type: SessionType) -> Path:
    folder_path = f"data/{year}_round_{round_number}/"
    os.makedirs(folder_path, exist_ok=True)

    folder_path = Path(folder_path)
    return folder_path / f"session_{session_type.value}_laps.json"

def _is_stale(cache_file: Path) -> bool:
    if not cache_file.exists():
        return True
    return False

def _fetch_and_cache_session_laps(year: int, round_number: int, session_type: SessionType):
    try:
        cache_file = _cache_file(year, round_number, session_type)

        session = fastf1.get_session(year, round_number, session_type.value)
        session.load()
        session_laps= session.laps

        cache_file.parent.mkdir(parents=True, exist_ok=True)

        normalized_laps= []

        for _, lap_data in session_laps.iterrows():
            normalized_laps.append(_normalize_lap(lap_data))

        with open(cache_file, "w") as f:
            json.dump(normalized_laps, f)

        return normalized_laps
    except ValueError as e:
        raise ValueError(e)

def get_cached_laps(year: int, round_number: int, session_type: SessionType):
    cache_file = _cache_file(year, round_number, session_type)

    if _is_stale(cache_file):
        return _fetch_and_cache_session_laps(year, round_number, session_type)
    
    with open(cache_file) as f:
        return json.load(f)

if __name__ == "__main__":
    session_type_aux = SessionType('FP1')
    get_cached_laps(2026,5,session_type_aux)
 
