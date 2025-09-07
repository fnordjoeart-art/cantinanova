import React from "react";
import { useUser } from "../auth/UserContext.js";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UserMenu() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="rounded-2xl border bg-white shadow min-w-[280px]">
      <div className="p-4 border-b">
        <div className="font-semibold">{user?.full_name}</div>
        <div className="text-sm opacity-70">{user?.email}</div>
      </div>

      <nav className="p-2 space-y-1 text-[15px]">
        {/* Voci comuni */}
        <Link to={createPageUrl("Profile")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
          Il Mio Profilo
        </Link>

        {/* ADMIN OWNER (nostro pannello) */}
        {user?.role === "admin" && (
          <>
            <div className="px-3 pt-3 pb-1 text-xs font-semibold opacity-60">ADMIN</div>
            <Link to={createPageUrl("AdminDashboard")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
              Dashboard Admin
            </Link>
            <Link to={createPageUrl("AdminWineries")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
              Gestione Cantine
            </Link>
            <Link to={createPageUrl("AdminWines")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
              Gestione Vini
            </Link>
            <Link to={createPageUrl("AdminImages")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
              Media Library
            </Link>
            <Link to={createPageUrl("AdminImport")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
              Import CSV
            </Link>
          </>
        )}

        {/* ADMIN CANTINA (pannello per produttori) */}
        {user?.role && user.role.startsWith('winery_') && (
          <>
            <div className="px-3 pt-3 pb-1 text-xs font-semibold opacity-60">CANTINA</div>
            <Link to={createPageUrl("WineryDashboard")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
              Dashboard Cantina
            </Link>
            <Link to={createPageUrl("WineryProfile")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
              Profilo & Immagini
            </Link>
            <Link to={createPageUrl("WineryWines")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
              I miei Vini
            </Link>
            <Link to={createPageUrl("WineryOrders")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
              Ordini
            </Link>
          </>
        )}

        <Link to={createPageUrl("Onboarding")} className="block px-3 py-2 rounded-lg hover:bg-gray-50">
          Logout
        </Link>
      </nav>
    </div>
  );
}