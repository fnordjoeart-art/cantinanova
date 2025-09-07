import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cdn } from "../utils/cdn.js";

export default function WineryCard({ w }) {
  const img = w.logo_url ? cdn(w.logo_url,"logo") : (w.cover_image_url ? cdn(w.cover_image_url,"cover") : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiM5REEyQUUiLz4KPC9zdmc+");
  
  return (
    <Link to={createPageUrl(`WineryDetails?id=${w.id}`)} className="block rounded-2xl border bg-white overflow-hidden hover:shadow-md transition">
      <div className="aspect-[4/3] bg-gray-100">
        <img 
          src={img} 
          alt={w.name} 
          className="w-full h-full object-cover" 
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iNDAiIGZpbGw9IiM5REEyQUUiLz4KPC9zdmc+";
          }}
        />
      </div>
      <div className="p-3">
        <div className="font-semibold line-clamp-1">{w.name}</div>
        <div className="text-sm opacity-70 line-clamp-1">{w.region}</div>
      </div>
    </Link>
  );
}