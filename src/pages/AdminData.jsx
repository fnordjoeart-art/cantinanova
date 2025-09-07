
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wine, Building, ArrowLeft } from 'lucide-react'; // Removed 'Image' icon
import RoleGuard from "../components/auth/RoleGuard.js";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import WineriesTable from '../components/admin/data/WineriesTable.js';
import WinesTable from '../components/admin/data/WinesTable.js';
// Removed import for ImageGeneratorContent.js as it's no longer used

export default function AdminData() {
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
                        <h1 className="text-3xl font-bold text-gray-900">Gestione Dati</h1>
                        <p className="text-gray-600 mt-1">
                            Amministra le entità principali della piattaforma: cantine e vini.
                        </p>
                    </header>

                    <Tabs defaultValue="wineries" className="w-full">
                        {/* Reverted TabsList to 2 columns and removed the broken tab */}
                        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
                            <TabsTrigger value="wineries">
                                <Building className="w-4 h-4 mr-2" /> Cantine
                            </TabsTrigger>
                            <TabsTrigger value="wines">
                                <Wine className="w-4 h-4 mr-2" /> Vini
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="wineries">
                           <WineriesTable />
                        </TabsContent>

                        <TabsContent value="wines">
                            <WinesTable />
                        </TabsContent>

                        {/* Removed the non-existent ImageGenerator tab content */}
                    </Tabs>
                </div>
            </div>
        </RoleGuard>
    );
}
