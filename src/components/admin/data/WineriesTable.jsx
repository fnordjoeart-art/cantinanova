import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Search } from "lucide-react";

export default function WineriesTable({ wineries, onEdit, onDelete, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWineries = wineries.filter(winery =>
    winery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    winery.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-8">Caricamento cantine...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Cerca per nome o regione..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Codice</TableHead>
              <TableHead>Regione</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWineries.map((winery) => (
              <TableRow key={winery.id}>
                <TableCell className="font-medium">{winery.name}</TableCell>
                <TableCell className="font-mono text-sm">{winery.codice_cantina}</TableCell>
                <TableCell>{winery.region}</TableCell>
                <TableCell>
                  <Badge className={winery.attiva ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {winery.attiva ? "Attiva" : "Disattiva"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(winery)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(winery.id)}
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

      {filteredWineries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nessuna cantina trovata
        </div>
      )}
    </div>
  );
}