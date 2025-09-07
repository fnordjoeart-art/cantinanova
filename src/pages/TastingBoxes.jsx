import React, { useState, useEffect } from "react";
import { TastingBox } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift } from "lucide-react";

export default function TastingBoxesPage() {
  const [boxes, setBoxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    TastingBox.list('-created_date')
      .then(setBoxes)
      .catch(() => setBoxes([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Box degustazione</h1>
      <p className="opacity-70">Crea o scopri box tematici (regioni, vitigni, annate).</p>

      {/* Lista box */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {isLoading && Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        {/* Qui verranno mappati i box quando ci saranno */}
      </div>

      {/* Empty state */}
      {!isLoading && boxes.length === 0 && (
        <div className="rounded-2xl border bg-white p-6 text-center">
          <div className="text-lg font-medium">Ancora nessun box</div>
          <p className="opacity-70">A breve troverai selezioni pronte. Per la demo lasciamo questo messaggio.</p>
        </div>
      )}
    </main>
  );
}