// src/components/SheetLoader.jsx
import React, { useState } from "react";

export default function SheetLoader() {
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [gid, setGid] = useState("0");
  const [rows, setRows] = useState([]);
  const [rawJson, setRawJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_BASE = "https://dummyfastapi.onrender.com";

  async function handleLoad(e) {
    e?.preventDefault();
    setError(null);
    setRows([]);
    setRawJson(null);

    if (!spreadsheetId.trim()) {
      setError("Please enter a Spreadsheet ID.");
      return;
    }

    setLoading(true);
    try {
      const url = `${BACKEND_BASE}/public-sheet/${encodeURIComponent(
        spreadsheetId.trim()
      )}?gid=${encodeURIComponent(gid.trim() || "0")}`;

      const res = await fetch(url);
      if (!res.ok) {
        let message = `Server returned ${res.status}`;
        try {
          const body = await res.json();
          if (body?.detail) message += ` — ${body.detail}`;
        } catch {}
        throw new Error(message);
      }

      const json = await res.json();
      setRows(json.data || []);
      setRawJson(json); // ⭐ Store raw JSON here

    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const headers = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div style={{ padding: 16, fontFamily: "Arial", maxWidth: 1100 }}>
      <h3>Load Google Sheet (public) from Render</h3>

      {/* Form Section */}
      <form
        onSubmit={handleLoad}
        style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}
      >
        <div>
          <label style={{ display: "block", marginBottom: 4 }}>Spreadsheet ID</label>
          <input
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            placeholder="Enter spreadsheet ID"
            style={{ padding: 8, width: 360 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 4 }}>GID</label>
          <input
            value={gid}
            onChange={(e) => setGid(e.target.value)}
            placeholder="gid (default 0)"
            style={{ padding: 8, width: 100 }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "8px 14px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            marginTop: 20,
          }}
          disabled={loading}
        >
          {loading ? "Loading…" : "Load"}
        </button>
      </form>

      Error
      {error && <div style={{ color: "crimson", marginTop: 12 }}>Error: {error}</div>}

      {/* Loading */}
      {loading && <div style={{ marginTop: 12 }}>Loading data...</div>}

      {/* Data Table */}
      {rows.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 20 }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    style={{
                      border: "1px solid #ddd",
                      padding: 8,
                      textAlign: "left",
                      background: "#f0f2f5",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx}>
                  {headers.map((h) => (
                    <td key={h} style={{ border: "1px solid #eee", padding: 8 }}>
                      {r[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ⭐ RAW JSON Viewer */}
      {rawJson && (
        <div
          style={{
            marginTop: 24,
            padding: 12,
            background: "#1e1e1e",
            color: "#eee",
            borderRadius: 6,
            maxHeight: 300,
            overflowY: "auto",
            fontFamily: "Consolas, monospace",
            fontSize: 14,
            whiteSpace: "pre-wrap",
          }}
        >
          <h4 style={{ marginTop: 0 }}>Raw JSON:</h4>
          <pre style={{ margin: 0 }}>
            {JSON.stringify(rawJson, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
