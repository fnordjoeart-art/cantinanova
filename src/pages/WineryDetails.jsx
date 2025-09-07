
import React, { useState, useEffect } from "react";
import { Winery, Wine } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cdn } from "../components/utils/cdn.js"; // Changed path
import { ArrowLeft, Globe, Calendar, Leaf } from "lucide-react";
import WineCard from "../components/wines/WineCard";

export default function WineryDetails() {
  const [winery, setWinery] = useState(null);
  const [wines, setWines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const wineryId = urlParams.get('id');
    if (wineryId) {
      loadData(wineryId);
    }
  }, []);

  const loadData = async (wineryId) => {
    setIsLoading(true);
    try {
      const [wineryData, winesData] = await Promise.all([
        Winery.list().then(data => data.find(w => w.id === wineryId)),
        Wine.filter({ winery_id: wineryId })
      ]);
      
      setWinery(wineryData);
      setWines(winesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="p-6">Caricamento…</div>;
  }

  if (!winery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Cantina non trovata</h2>
          <Link to={createPageUrl("Wineries")}>
            <Button>Torna alle Cantine</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cover = winery.cover_image_url ? cdn(winery.cover_image_url,"cover") : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiIHZpZXdCb3g9IjAgMCAxMjAwIDYwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjYwMCIgY3k9IjMwMCIgcj0iODAiIGZpbGw9IiM5REEyQUUiLz4KPC9zdmc+";
  const logo = winery.logo_url ? cdn(winery.logo_url,"logo") : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiM5REEyQUUiLz4KPC9zdmc+";

  return (
    <main className="pb-12">
      {/* Pulsante Indietro */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <Link to={createPageUrl("Wineries")}>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna alle Cantine
          </Button>
        </Link>
      </div>

      {/* Hero Cover */}
      <div className="relative w-full h-[240px] sm:h-[320px] md:h-[380px] bg-gray-100 overflow-hidden">
        <img src={cover} alt="" className="w-full h-full object-cover"/>
      </div>

      {/* Logo sovrapposto + Info */}
      <section className="relative max-w-6xl mx-auto px-4">
        <div className="-mt-14 sm:-mt-16 inline-block rounded-2xl bg-white p-2 shadow ring-1 ring-black/5">
          <img src={logo} alt={winery.name} className="w-[96px] h-[96px] sm:w-[120px] sm:h-[120px] rounded-xl object-cover"/>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl sm:text-3xl font-semibold">{winery.name}</h1>
          <p className="text-sm sm:text-base opacity-70">{winery.region}{winery.sub_region ? ` • ${winery.sub_region}` : ""}</p>
          <div className="mt-4 flex gap-2">
            {winery.website && (
              <Button variant="outline" onClick={() => window.open(winery.website, '_blank')}>
                <Globe className="w-4 h-4 mr-2" />
                Visita sito
              </Button>
            )}
            <Link to={createPageUrl(`Wines?winery=${encodeURIComponent(winery.name)}`)}>
              <Button className="bg-red-700 hover:bg-red-600 text-white">
                Scopri i vini
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contenuto principale */}
      <section className="max-w-6xl mx-auto px-4 mt-8 grid gap-6 md:grid-cols-3">
        <article className="md:col-span-2 p-5 rounded-2xl border bg-white">
          <h2 className="font-medium mb-2">La nostra storia</h2>
          <p className="leading-relaxed whitespace-pre-wrap">{winery.story || "—"}</p>
        </article>
        <aside className="p-5 rounded-2xl border bg-white space-y-2">
          {winery.established_year && <div className="text-sm">Fondata nel {winery.established_year}</div>}
          {winery.certifications && (
            <div className="text-sm">
              Certificazioni: 
              <div className="flex flex-wrap gap-1 mt-1">
                {winery.certifications.map(cert => (
                  <Badge key={cert} className="bg-green-100 text-green-800 text-xs">
                    <Leaf className="w-3 h-3 mr-1" /> {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {winery.tags && <div className="text-sm">Caratteristiche: {winery.tags.join(", ")}</div>}
        </aside>
      </section>

      {/* Vini della cantina */}
      {wines.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-8">
          <h2 className="text-xl font-semibold mb-4">I nostri vini ({wines.length})</h2>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {wines.map(wine => <WineCard key={wine.id} wine={wine} />)}
          </div>
        </section>
      )}
    </main>
  );
}
