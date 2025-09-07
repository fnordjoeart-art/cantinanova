import React from 'react';
import RoleGuard from "../components/auth/RoleGuard.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

const DataTablePlaceholder = ({ title }) => (
    <div className="border-2 border-dashed rounded-lg p-12 text-center">
        <h3 className="text-lg font-medium text-gray-700">Tabella Dati per {title}</h3>
        <p className="text-sm text-gray-500 mt-2">
            Qui verrà visualizzata la tabella per la gestione dei {title.toLowerCase()}.
        </p>
    </div>
);

export default function AdminTastingBoxes() {
    return (
        <RoleGuard allow={["admin"]}>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <Link to={createPageUrl("AdminDashboard")} className="mb-6 inline-block">
                        <Button variant="outline" className="flex items-center">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Torna alla Dashboard
                        </Button>
                    </Link>
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <Gift className="w-8 h-8 mr-3 text-red-700" />
                            Gestione Box Degustazione
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Crea, modifica ed elimina le box di degustazione in vendita.
                        </p>
                    </header>
                    <Card>
                        <CardHeader>
                            <CardTitle>Elenco Box</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTablePlaceholder title="Box Degustazione" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </RoleGuard>
    );
}