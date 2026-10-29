import argparse
import sys
import time
from datetime import date

import fastf1

from cache.results_cache import get_cached_team_summary

def backfill_round(year: int, rnd: int, schedule=None, no_cache: bool = False) -> list[str]:
    if schedule is None:
        schedule = fastf1.get_event_schedule(year, include_testing=False)

    rows = schedule[schedule["RoundNumber"] == rnd]
    if rows.empty:
        return [f"{year} round {rnd}: round not found in schedule"]

    name = rows.iloc[0]["EventName"]
    label = f"{year} round {rnd} {name}"

    try:
        if no_cache:
            get_cached_team_summary(year, rnd, force_refresh=True)
        else:
            get_cached_team_summary(year, rnd)
        print(f"ok: {label}")

    except Exception as e:
        print(f"FAILED: {e}")
        return [f"{label}: {e}"]
    return []


def backfill_year(year: int, no_cache: bool = False) -> list[str]:
    schedule = fastf1.get_event_schedule(year, include_testing=False)
    today = date.today()
    failed = []

    for _, event in schedule.iterrows():
        if event["EventDate"].date() > today:
            continue
        failed += backfill_round(year, int(event["RoundNumber"]), schedule, no_cache)
        time.sleep(5) 

    return failed


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("year", type=int)
    parser.add_argument("round", type=int, nargs="?")
    parser.add_argument("--no-cache", action="store_true", help="fetch fresh data and replace cached summaries")
    args = parser.parse_args()

    if args.round is None:
        failed = backfill_year(args.year, no_cache=args.no_cache)
    else:
        failed = backfill_round(args.year, args.round, no_cache=args.no_cache)

    print(f"\n{len(failed)} skipped or failed")
    for label in failed:
        print(f"  {label}")