import React from "react";
import { useUser } from "./UserContext.js";

export default function RoleGuard({ allow = [], children, fallback = null }) {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return <div className="p-6 text-center">Caricamento...</div>;
  }
  
  if (!user || !allow.includes(user.role)) {
    return fallback ?? (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Accesso Non Autorizzato</h2>
        <p className="text-gray-600">Non hai i permessi per accedere a questa sezione.</p>
      </div>
    );
  }
  
  return <>{children}</>;
}