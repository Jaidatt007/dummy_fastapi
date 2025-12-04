// src/App.jsx
import React from "react";
import SheetLoader from "./SheetLoader";

export default function App() {
  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Google Sheet → JSON (Render) Demo</h1>
        <p style={{ marginTop: 6, color: "#555" }}>
          Enter a <strong>Spreadsheet ID</strong> and the sheet <strong>gid</strong> (tab id) then click <em>Load</em>.
          The app fetches JSON from <code>https://dummyfastapi.onrender.com</code>.
        </p>
      </header>

      <main>
        <SheetLoader />
      </main>

      <footer style={{ marginTop: 28, fontSize: 13, color: "#666" }}>
        <div>Notes:</div>
        <ul style={{ marginTop: 6 }}>
          <li>The Google Sheet must be public (anyone with the link can view).</li>
          <li>If you deploy frontend separately, update the BACKEND_BASE in SheetLoader.jsx to your API URL.</li>
        </ul>
      </footer>
    </div>
  );
}
