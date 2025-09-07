import React from "react";
import WineryImageUpdater from "../components/admin/WineryImageUpdater";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminImages() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
       <div className="max-w-7xl mx-auto">
        <Link to={createPageUrl("AdminDashboard")} className="mb-6 inline-block">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Dashboard
            </Button>
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestione Immagini Cantine</h1>
          <p className="text-gray-600">Cerca una cantina e aggiorna la sua immagine di copertina.</p>
        </div>
        <WineryImageUpdater />
      </div>
    </div>
  );
}