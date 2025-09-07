import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { User as UserSDK } from "@/api/entities";

/**
 * Sistema di autenticazione demo che gestisce:
 * - Admin (proprietari piattaforma)
 * - Utenti cantina (modalità demo) 
 * - Utenti finali (clienti)
 */
const DEFAULT_ADMIN = {
  id: "u_admin",
  full_name: "Admin CantinaNova", 
  email: "admin@cantinanova.it",
  role: "admin"
};

// Utente demo cantina
const DEMO_WINERY_USER = {
  id: "winery_demo_001",
  full_name: "Mario Rossi",
  email: "mario@cantinademo.it", 
  role: "winery_owner",
  winery_id: "CM001"
};

// Creo il context e lo esporto sia come named che come default
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Controlla se c'è un utente demo cantina salvato
    const savedWineryDemo = localStorage.getItem('demo_winery_user');
    const savedUser = localStorage.getItem('demo_user');
    
    if (savedWineryDemo) {
      // Usa l'utente demo cantina
      setUser(DEMO_WINERY_USER);
    } else if (savedUser) {
      // Usa l'utente normale salvato
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem('demo_user');
        setUser(null);
      }
    } else {
      // Nessun utente loggato
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  // Funzione per attivare la modalità demo cantina
  const enableWineryDemo = () => {
    localStorage.setItem('demo_winery_user', 'true');
    localStorage.removeItem('demo_user'); // Rimuovi utente normale se presente
    setUser(DEMO_WINERY_USER);
  };

  // Funzione per disattivare la modalità demo cantina
  const disableWineryDemo = () => {
    localStorage.removeItem('demo_winery_user');
    localStorage.removeItem('demo_user');
    setUser(null);
  };

  // Funzione per login utente normale
  const loginUser = (userData) => {
    localStorage.setItem('demo_user', JSON.stringify(userData));
    localStorage.removeItem('demo_winery_user'); // Rimuovi demo cantina se presente
    setUser(userData);
  };

  // Funzione per logout generale
  const logout = () => {
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_winery_user');
    setUser(null);
  };

  const value = useMemo(() => ({ 
    user, 
    setUser, 
    isLoading, 
    enableWineryDemo, 
    disableWineryDemo,
    loginUser,
    logout
  }), [user, isLoading]);
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

// Export sia named che default per compatibilità
export { UserContext };
export default UserContext;