import React from "react";
import RoleGuard from "../components/auth/RoleGuard.js";

export default function WineryProfile() {
  return (
    <RoleGuard allow={["winery_owner", "winery_manager", "winery_editor"]}>
      <main className="max-w-6xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Profilo & Immagini</h1>
        <div className="rounded-2xl border bg-white p-5">
          <p>Form profilo cantina (nome, regione, logo, cover…)</p>
          <p className="text-sm opacity-70 mt-2">Componente in sviluppo</p>
        </div>
      </main>
    </RoleGuard>
  );
}