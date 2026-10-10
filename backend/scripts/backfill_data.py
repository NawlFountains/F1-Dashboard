import sys
import time
from datetime import date

import fastf1

from cache.enums import SessionType
from cache.schedule_cache import get_cached_schedule
from cache.results_cache import get_cached_results
from cache.laps_cache import get_cached_laps


def backfill(year: int):
    get_cached_schedule(year)
    schedule = fastf1.get_event_schedule(year, include_testing=False)
    today = date.today()
    failed = []

    for _, event in schedule.iterrows():
        if event["EventDate"].date() > today:
            continue
        rnd = int(event["RoundNumber"])

        for session_type in SessionType:
            label = f"{year} round {rnd} {session_type.value}"
            try:
                get_cached_laps(year, rnd, session_type)
                get_cached_results(year, rnd, session_type)
                print(f"ok: {label}")
            except Exception as e:
                print(f"skipped/failed: {label}: {e}")
                failed.append(label)
            time.sleep(1)

    print(f"\n{len(failed)} sessions skipped or failed")


if __name__ == "__main__":
    backfill(int(sys.argv[1]))
