import sys
import time
from datetime import date

import fastf1

from scraper.run_weekend import process_race_weekend

def backfill(year: int):
    schedule = fastf1.get_event_schedule(year, include_testing=False)
    today = date.today()
    failed = []

    for _, event in schedule.iterrows():
        if event["EventDate"].date() > today:
            continue
        rnd = int(event["RoundNumber"])
        name = event["EventName"]
        print(f"--- {year} round {rnd}: {name}")

        try:
            process_race_weekend(year, rnd, name)
        except Exception as e:
            print(f"FAILED: {e}")
            failed.append((rnd, name))

        time.sleep(5)  

    if failed:
        print("\nFailed rounds:")
        for rnd, name in failed:
            print(f"  round {rnd}: {name}")


if __name__ == "__main__":
    backfill(int(sys.argv[1]))
