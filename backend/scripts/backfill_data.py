import sys
import time
from datetime import date

import fastf1

from cache.enums import SessionType
from cache.schedule_cache import get_cached_schedule
from cache.results_cache import get_cached_results
from cache.laps_cache import get_cached_laps

def backfill_round(year: int, rnd: int) -> list[str]:
    failed = []
    for session_type in SessionType:
        for name, fetch in (("laps", get_cached_laps), ("results", get_cached_results)):
            label = f"{year} round {rnd} {session_type.value} {name}"
            try:
                fetch(year, rnd, session_type)
                print(f"ok: {label}")
            except Exception as e:
                print(f"skipped/failed: {label}: {e}")
                failed.append(label)
        time.sleep(1)
    return failed

def backfill_year(year: int) -> list[str]:
    get_cached_schedule(year)
    schedule = fastf1.get_event_schedule(year, include_testing=False)
    today = date.today()
    failed = []
    for _, event in schedule.iterrows():
        if event["EventDate"].date() > today:
            continue
        failed += backfill_round(year, int(event["RoundNumber"]))
    return failed

if __name__ == "__main__":
    args = [int(a) for a in sys.argv[1:]]
    if len(args) == 1:
        failed = backfill_year(args[0])
    elif len(args) == 2:
        failed = backfill_round(*args)
    else:
        sys.exit("Usage: python -m scripts.backfill_data YEAR [ROUND]")

    print(f"\n{len(failed)} skipped or failed")
    for label in failed:
        print(f"  {label}")

