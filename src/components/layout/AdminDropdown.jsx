
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, LogOut, LayoutDashboard, Building, Wine, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useUser } from "../auth/UserContext.js";
// AuthModal is removed as per the changes

export default function AdminDropdown() {
  const { user, isLoading, disableWineryDemo, logout } = useUser(); // Added 'logout'
  const [showAuthModal, setShowAuthModal] = useState(false); // Kept for potential future use or if other parts rely on it, though AuthModal is removed. It's not used after the changes.

  const handleLogout = () => {
    // Se è in modalità demo cantina, disattivala
    if (user?.role?.startsWith('winery_')) {
      disableWineryDemo();
    }
    logout(); // Use the new centralized logout function
    window.location.href = createPageUrl("Home");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  if (!user) {
    return (
      <>
        <Button
          onClick={() => window.location.href = createPageUrl("UserLogin")} // Changed onClick to navigate to UserLogin
          variant="outline"
          className="text-red-700 border-red-200 hover:bg-red-50"
        >
          <User className="w-4 h-4 mr-2" />
          Accedi
        </Button>
        {/* AuthModal removed as per the changes */}
      </>
    );
  }

  const isAdmin = user.role === 'admin';  // NOI (proprietari)
  const isWineryUser = user.role && user.role.startsWith('winery_');  // CANTINE

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.avatar_url} />
          <AvatarFallback className="bg-red-100 text-red-800 font-semibold">
            {getInitials(user.full_name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <p className="font-bold">{user.full_name}</p>
          <p className="text-xs text-gray-500 font-normal">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* ========== PANNELLO PROPRIETARI (NOI) - SOLO DASHBOARD OVERVIEW ========== */}
        {isAdmin && (
          <>
            <DropdownMenuLabel className="text-xs text-blue-600 font-bold uppercase">👑 Pannello Proprietari</DropdownMenuLabel>
            <Link to={createPageUrl("AdminDashboard")}>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-3 h-4 w-4 text-blue-600" />
                <span className="font-medium">Dashboard Overview</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}

        {/* ========== PANNELLO CANTINA (SEPARATO) ========== */}
        {isWineryUser && (
          <>
            <DropdownMenuLabel className="text-xs text-green-600 font-bold uppercase">🏛️ Pannello Cantina</DropdownMenuLabel>
            <Link to={createPageUrl("WineryDashboard")}>
              <DropdownMenuItem>
                <LayoutDashboard className="mr-3 h-4 w-4 text-green-600" />
                <span className="font-medium">Dashboard Cantina</span>
              </DropdownMenuItem>
            </Link>
            <Link to={createPageUrl("WineryProfile")}>
              <DropdownMenuItem>
                <Building className="mr-3 h-4 w-4" />
                <span>Profilo & Immagini</span>
              </DropdownMenuItem>
            </Link>
            <Link to={createPageUrl("WineryWines")}>
              <DropdownMenuItem>
                <Wine className="mr-3 h-4 w-4" />
                <span>I Miei Vini</span>
              </DropdownMenuItem>
            </Link>
            <Link to={createPageUrl("WineryOrders")}>
              <DropdownMenuItem>
                <Settings className="mr-3 h-4 w-4" />
                <span>Ordini & Vendite</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}

        {/* ========== SEZIONE UTENTE - Per tutti ========== */}
        <DropdownMenuLabel className="text-xs text-gray-500 font-semibold">ACCOUNT</DropdownMenuLabel>
        <Link to={createPageUrl("Profile")}>
          <DropdownMenuItem>
            <User className="mr-3 h-4 w-4" />
            <span>Il Mio Profilo</span>
          </DropdownMenuItem>
        </Link>

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-3 h-4 w-4" />
          <span>{user?.role?.startsWith('winery_') ? 'Esci da Demo Cantina' : 'Logout'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
