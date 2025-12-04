from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import csv
import io
import requests
from typing import List, Dict


app = FastAPI(title="Public Sheet JSON API")


# Adjust origins for production
app.add_middleware(
CORSMiddleware,
allow_origins=["http://localhost:5173", "http://localhost:3000"],
allow_credentials=True,
allow_methods=["GET", "OPTIONS"],
allow_headers=["*"],
)




def public_sheet_csv_url(spreadsheet_id: str, gid: str = "0") -> str:
    # """Return URL to fetch CSV export of a public Google Sheet."""
    return f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"




@app.get("/public-sheet/{spreadsheet_id}")
def get_public_sheet(spreadsheet_id: str, gid: str = "0"):
# """Fetch public Google Sheet CSV and return JSON array of objects (header -> keys).


# Example: GET /public-sheet/1A2B3C4D5E?gid=0
# """

    url = public_sheet_csv_url(spreadsheet_id, gid)
    try:
        resp = requests.get(url, timeout=10)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed connecting to Google Sheets: {e}")

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=f"Google Sheets returned status {resp.status_code}")


    text = resp.content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)
    return {"data": rows}




@app.get("/health")
def health():
    return {"status": "ok"}