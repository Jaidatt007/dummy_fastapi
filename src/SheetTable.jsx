import React, { useEffect, useState } from 'react';

export default function SheetTable({ spreadsheetId, gid }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!spreadsheetId) return;

    let canceled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = `http://localhost:8000/public-sheet/${spreadsheetId}?gid=${gid}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);

        const json = await res.json();
        if (!canceled) setRows(json.data || []);
      } catch (err) {
        if (!canceled) setError(err.message);
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    load();
    return () => (canceled = true);
  }, [spreadsheetId, gid]);

  if (!spreadsheetId) return <div style={{ color: "#444" }}>Enter spreadsheet ID to load.</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!rows.length) return <div>No rows found.</div>;

  const headers = Object.keys(rows[0]);

  return (
    <div style={{ overflowX: "auto", marginTop: 12 }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={{ border: "1px solid #ddd", padding: 8, textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              {headers.map((h) => (
                <td key={h} style={{ border: "1px solid #eee", padding: 8 }}>{r[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
