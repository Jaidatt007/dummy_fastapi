import React, { useState } from "react";
import SheetTable from "./SheetTable";

export default function App() {
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [gid, setGid] = useState("0");

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Public Google Sheet → JSON Demo</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          value={spreadsheetId}
          onChange={(e) => setSpreadsheetId(e.target.value)}
          placeholder="Spreadsheet ID"
          style={{ padding: 8, width: 300, marginRight: 10 }}
        />

        <input
          value={gid}
          onChange={(e) => setGid(e.target.value)}
          placeholder="gid (default: 0)"
          style={{ padding: 8, width: 120 }}
        />
      </div>

      <SheetTable spreadsheetId={spreadsheetId} gid={gid} />
    </div>
  );
}
