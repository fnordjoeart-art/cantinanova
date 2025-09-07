import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search, ExternalLink } from "lucide-react";

export default function WinesTable({ wines, onEdit, onDelete, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWines = wines.filter(wine =>
    wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wine.winery_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wine.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type) => {
    const colors = {
      rosso: "bg-red-100 text-red-800",
      bianco: "bg-yellow-100 text-yellow-800",
      "rosé": "bg-pink-100 text-pink-800",
      spumante: "bg-blue-100 text-blue-800",
      dolce: "bg-purple-100 text-purple-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return <div className="text-center py-8">Caricamento vini...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Cerca per nome, cantina o tipologia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cantina</TableHead>
              <TableHead>Tipologia</TableHead>
              <TableHead>Prezzo</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWines.map((wine) => (
              <TableRow key={wine.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {wine.image_url && (
                      <img 
                        src={wine.image_url} 
                        alt={wine.name}
                        className="w-10 h-10 object-cover rounded border"
                      />
                    )}
                    <div>
                      <div className="font-medium">{wine.name}</div>
                      {wine.vintage && (
                        <div className="text-sm text-gray-500">{wine.vintage}</div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{wine.winery_name}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(wine.type)}>
                    {wine.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">€{wine.price?.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={wine.attivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {wine.attivo ? "Attivo" : "Disattivo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(wine)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(wine.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredWines.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nessun vino trovato
        </div>
      )}
    </div>
  );
}