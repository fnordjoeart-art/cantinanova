import React, { useState, useEffect } from "react";
import { Wine } from "@/api/entities";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import WineCard from "../components/wines/WineCard"; // Import the new WineCard component

export default function ViniPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Wine.list('-created_date') // Fetch most recent wines first
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setIsLoading(false));
  }, []);

  const list = rows.filter(w => !q || (w.name || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Il Nostro Catalogo Vini</h1>
        <p className="text-lg text-gray-600 mt-2">Esplora la nostra selezione curata delle migliori cantine emergenti.</p>
      </div>
      
      <div className="flex justify-center">
        <input className="px-4 py-2 rounded-full border w-full sm:w-96 shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
          placeholder="Cerca un vino per nome..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {isLoading 
          ? Array(8).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : list.map(w => (
              <WineCard key={w.id} wine={w} />
            ))
        }
      </div>

      {!isLoading && list.length === 0 && (
        <div className="col-span-full rounded-2xl border-2 border-dashed bg-gray-50 p-12 text-center text-gray-500">
          <h3 className="text-lg font-semibold">Nessun vino trovato</h3>
          <p>Prova a modificare i termini di ricerca o esplora tutte le nostre cantine.</p>
        </div>
      )}
    </main>
  );
}