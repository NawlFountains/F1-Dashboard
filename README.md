# F1 Dashboard
 
A fan-built Formula 1 dashboard: race schedules, results, and AI-summarized
car development updates — no login required.
 
> **Unofficial project.** Not affiliated with, endorsed by, or connected to
> Formula One Management Limited, Formula One Licensing B.V., the FIA, or
> any F1 team or driver. Built for personal/educational use using publicly
> accessible data via [FastF1](https://github.com/theOehrly/Fast-F1) and the
> FIA's public car presentation documents.
 
## Status
 
🚧 **Backend in progress. Frontend not started yet.**
 
## What's built so far
 
### Backend (`app/`)
FastAPI service exposing:
- `GET /api/schedule/{year}` — full season schedule
- `GET /api/schedule/{year}/current` — the current or next upcoming race weekend
- `GET /api/results/{year}/{round}` — race results for a given round
- `GET /api/upgrades/{year}/{race_slug}` — AI-generated per-team summaries of car updates
- `GET /api/upgrades/{year}/{race_slug}/{team}` — a single team's update summary
Schedule and results data comes from FastF1, with a local JSON cache layer
(`cache/`) so the app doesn't hit FastF1's API on every request — data is
refreshed on a time-based staleness check rather than fetched live per call.
 
### Car update summarizer pipeline (`scraper/`)
Runs independently of the API (its own scheduled job, not triggered by
requests):
- `downloader.py` — pulls the FIA's official car presentation PDF for a
  given year/Grand Prix
- `processor.py` — parses the PDF into structured rows (team, component,
  reason, geometric differences, description), correctly handling FIA's
  merged table cells (shared reasons/descriptions across multiple
  components)
- `summarizer.py` — generates a short, fan-readable summary per team via
  an LLM, from the structured data (never from raw PDF text)
- `run_weekend.py` — orchestrates the above end to end for the current
  race weekend
Output lives in `data/`, which the FastAPI app reads from directly.
 
## Planned
 
- Frontend (schedule, results, and upgrade summaries UI)
- Tyre specs/sets, circuit lap records, past winners per circuit
- ML-based pit-stop strategy prediction, layered on top of the dashboard
## Tech stack
 
- **Backend:** FastAPI, pandas
- **Data:** FastF1, FIA public documents (PDF)
- **AI:** Groq (per-team update summaries)
- **Frontend:** React, Typescript, TailwindCSS, Vite
## Local setup
 
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
 
Environment variables (`.env`, not committed):
```
GROQ_API_KEY=your_key_here
```
 
Run the API:
```bash
python -m uvicorn app.main:app --reload
```
 
Run the update-summary pipeline manually:
```bash
python scraper/run_weekend.py
```
 
