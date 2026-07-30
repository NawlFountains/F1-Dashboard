import math
import pandas as pd

def _safe(value):
    """Convert NaN/NaT to None; pass everything else through."""
    if value is None:
        return None
    if isinstance(value, float) and math.isnan(value):
        return None
    if pd.isna(value):  # catches NaT, pandas NA, etc.
        return None
    if isinstance(value, pd.Timedelta):
        return _timedelta_to_seconds(value)
    if isinstance(value, pd.Timestamp):
        return _to_iso_utc(value)
    return value


def _safe_int(value):
    """Cast to int, but return None if the value is missing/NaN."""
    safe_value = _safe(value)
    return int(safe_value) if safe_value is not None else None

def _timedelta_to_seconds(value):
    if pd.isna(value):
        return None
    return value.total_seconds()

def _to_iso_utc(value) -> str | None:
    if value is None or pd.isna(value):
        return None
    if value.tzinfo is not None:
        value = value.tz_convert("UTC")
    else:
        value = value.tz_localize("UTC")
    return value.isoformat().replace("+00:00", "Z")

