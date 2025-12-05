from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import csv
import io
import requests
from typing import List, Dict

app = FastAPI(title="Public Sheet JSON API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://exquisite-piroshki-059515.netlify.app",   # your frontend
        # "http://localhost:5173",                           # for local dev
        # "http://localhost:3000"
    ],
    allow_credentials=True,       # you already have credentials = true
    allow_methods=["*"],
    allow_headers=["*"],
)


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],            # testing only — later replace with Netlify URL
#     allow_methods=["*"],
#     allow_headers=["*"],
#     allow_credentials=False,
# )


# keep or add CORSMiddleware too (safer), but also add this fallback:
@app.middleware("http")
async def add_simple_cors_header(request: Request, call_next):
    response: Response = await call_next(request)
    # only set for your Netlify origin
    response.headers["Access-Control-Allow-Origin"] = "https://exquisite-piroshki-059515.netlify.app"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

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