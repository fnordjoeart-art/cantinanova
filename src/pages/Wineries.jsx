import React, { useState, useEffect, useMemo } from "react";
import { Winery } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CantinePage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stati input (temporanei)
  const [tempQ, setTempQ] = useState("");
  const [tempRegion, setTempRegion] = useState("all");

  // Filtri applicati (si aggiornano solo con "Applica")
  const [appliedFilters, setAppliedFilters] = useState({ q: "", region: "all" });

  useEffect(() => {
    Winery.list()
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Elenco regioni per la tendina
  const regions = useMemo(() => {
    const set = new Set((rows || []).map(w => w.region).filter(Boolean));
    return Array.from(set).sort();
  }, [rows]);

  const applyFilters = () => {
    setAppliedFilters({ q: tempQ.trim(), region: tempRegion });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") applyFilters();
  };

  // Applica i filtri alla lista
  const list = useMemo(() => {
    const q = (appliedFilters.q || "").toLowerCase();
    const region = appliedFilters.region;

    return rows.filter(w => {
      const nameMatch = !q || (w.name || "").toLowerCase().includes(q);
      const regionMatch = region === "all" || (w.region || "").toLowerCase() === region.toLowerCase();
      return nameMatch && regionMatch;
    });
  }, [rows, appliedFilters]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Cantine</h1>

      {/* Barra filtri compatta */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Cerca una cantina</label>
          <input
            className="px-3 py-2 rounded-xl border w-full"
            placeholder="Es. Cantina Rossi"
            value={tempQ}
            onChange={e => setTempQ(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-sm text-gray-600 mb-1">Regione</label>
          <select
            className="px-3 py-2 rounded-xl border w-full bg-white"
            value={tempRegion}
            onChange={e => setTempRegion(e.target.value)}
          >
            <option value="all">Tutte le regioni</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="sm:self-end">
          <button
            onClick={applyFilters}
            className="px-4 py-2 rounded-xl border bg-gray-900 text-white hover:bg-gray-800 transition"
          >
            Applica
          </button>
        </div>
      </div>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          : list.map(w => (
              <Link
                key={w.id}
                to={createPageUrl(`WineryDetails?id=${w.id}`)}
                className="block rounded-2xl border bg-white p-4 hover:shadow"
              >
                <div className="font-semibold">{w.name}</div>
                <div className="text-sm opacity-70">{w.region}</div>
              </Link>
            ))
        }
      </div>

      {!isLoading && list.length === 0 && (
        <div className="rounded-2xl border bg-white p-6 text-center opacity-80">
          Nessuna cantina trovata.
        </div>
      )}
    </main>
  );
}