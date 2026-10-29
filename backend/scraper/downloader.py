import json
from pathlib import Path

import requests

OVERRIDES_PATH = Path("config/fia_overrides.json")  # adjust to your repo layout


class PdfNotAvailable(Exception):
    """The FIA document couldn't be downloaded (not published yet, or wrong URL)."""


def download_pdf(pdf_url: str, output_filename: str) -> str:
    """Download a PDF and save it as output_filename. Raises PdfNotAvailable on failure."""
    headers = {"User-Agent": "Mozilla/5.0"}

    print(f"Downloading from: {pdf_url}")
    try:
        response = requests.get(pdf_url, headers=headers, stream=True, timeout=30)
    except requests.RequestException as e:
        raise PdfNotAvailable(f"Request failed for {pdf_url}: {e}") from e

    if response.status_code != 200:
        raise PdfNotAvailable(
            f"HTTP {response.status_code} for {pdf_url}. "
            "If the document is published under a different link, add it to "
            f"{OVERRIDES_PATH}."
        )

    with open(output_filename, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print(f"Download complete, saved as: {output_filename}")
    return output_filename


def load_overrides() -> dict[str, str]:
    if not OVERRIDES_PATH.exists():
        return {}
    with open(OVERRIDES_PATH, encoding="utf-8") as f:
        return json.load(f)


def get_car_submission_pdf(year: int, round_num: int, gp_name: str) -> tuple[str, str]:
    """Download the FIA car presentation PDF for a round.

    Uses the URL from config/fia_overrides.json (key "<year>-<round>") if present,
    otherwise builds it from the GP name.

    Returns:
        (local_pdf_path, source_url). Raises PdfNotAvailable if the download fails.
    """
    filename = f"{year}_{gp_name}_car_presentation_submissions.pdf"
    url = load_overrides().get(f"{year}-{round_num}") or (
        f"https://www.fia.com/system/files/decision-document/"
        f"{year}_{gp_name}_-_car_presentation_submissions.pdf"
    )
    return download_pdf(url, filename), url