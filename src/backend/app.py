from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import csv
import io
import requests
from typing import List, Dict

app = FastAPI(title="Public Sheet JSON API")

# ------------------------------------------
# ✅ CORS SETTINGS (Local + Production)
# ------------------------------------------

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://dummyfastapi.onrender.com"   # ⬅️ Add your real frontend domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],       # Allow all methods
    allow_headers=["*"],       # Allow all headers
)

# ------------------------------------------
# GOOGLE SHEET CSV URL
# ------------------------------------------
def public_sheet_csv_url(spreadsheet_id: str, gid: str = "0") -> str:
    return f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"

# ------------------------------------------
# MAIN API ENDPOINT
# ------------------------------------------
@app.get("/public-sheet/{spreadsheet_id}")
def get_public_sheet(spreadsheet_id: str, gid: str = "0"):

    url = public_sheet_csv_url(spreadsheet_id, gid)

    try:
        resp = requests.get(url, timeout=10)
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed connecting to Google Sheets: {e}")

    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="Google Sheets returned an error")

    text = resp.content.decode("utf-8")
    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)

    return {"data": rows}

# ------------------------------------------
# HEALTH CHECK
# ------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}