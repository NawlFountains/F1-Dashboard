import sys
import time
from datetime import date

import fastf1

from scraper.run_weekend import process_race_weekend

def backfill_round(year: int, rnd: int, schedule=None) -> list[str]:
    if schedule is None:
        schedule = fastf1.get_event_schedule(year, include_testing=False)

    rows = schedule[schedule["RoundNumber"] == rnd]
    if rows.empty:
        return [f"{year} round {rnd}: round not found in schedule"]

    name = rows.iloc[0]["EventName"]
    print(f"--- {year} round {rnd}: {name}")

    try:
        process_race_weekend(year, rnd, name)
    except Exception as e:
        print(f"FAILED: {e}")
        return [f"{year} round {rnd} ({name}): {e}"]
    return []


def backfill_year(year: int) -> list[str]:
    schedule = fastf1.get_event_schedule(year, include_testing=False)
    today = date.today()
    failed = []

    for _, event in schedule.iterrows():
        if event["EventDate"].date() > today:
            continue
        failed += backfill_round(year, int(event["RoundNumber"]), schedule)
        time.sleep(5) 

    return failed


if __name__ == "__main__":
    args = [int(a) for a in sys.argv[1:]]
    if len(args) == 1:
        failed = backfill_year(args[0])
    elif len(args) == 2:
        failed = backfill_round(*args)
    else:
        sys.exit("Usage: python -m scripts.backfill_upgrades YEAR [ROUND]")

    print(f"\n{len(failed)} skipped or failed")
    for label in failed:
        print(f"  {label}")