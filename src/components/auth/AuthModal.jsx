
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Wine, Facebook, Mail } from "lucide-react";
import { User } from "@/api/entities";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  
  const [userForm, setUserForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [wineryForm, setWineryForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    region: "",
    city: "",
    password: "",
    confirmPassword: ""
  });

  const handleSocialLogin = async () => {
    setIsLoading(true);
    await User.login();
    // La redirezione gestirà il resto, non è necessario chiamare onSuccess o altro.
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (userForm.password !== userForm.confirmPassword) {
      alert("Le password non coincidono");
      return;
    }
    
    setIsLoading(true);
    try {
      // Qui andrà la logica di registrazione con email
      // Per ora usiamo Google/Facebook
      await handleSocialLogin();
    } catch (error) {
      console.error("Errore registrazione utente:", error);
    }
    setIsLoading(false);
  };

  const handleWinerySubmit = async (e) => {
    e.preventDefault();
    if (wineryForm.password !== wineryForm.confirmPassword) {
      alert("Le password non coincidono");
      return;
    }
    
    setIsLoading(true);
    try {
      // Qui andrà la logica di registrazione cantina con email
      // Per ora usiamo Google/Facebook
      await handleSocialLogin();
    } catch (error) {
      console.error("Errore registrazione cantina:", error);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/3c6f67c95_LG2.jpg" 
            alt="CantinaNova Logo" 
            className="mx-auto mb-4 h-16 w-auto" 
          />
          <DialogTitle className="text-2xl font-bold">
            Benvenuto in CantinaNova
          </DialogTitle>
          <p className="text-gray-600">
            Scegli come vuoi accedere alla piattaforma
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Appassionato
            </TabsTrigger>
            <TabsTrigger value="winery" className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Cantina
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Registrazione Appassionato</CardTitle>
                <p className="text-sm text-gray-600">
                  Scopri cantine emergenti e crea il tuo profilo gustativo
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Social Login */}
                <div className="space-y-2">
                  <Button 
                    onClick={handleSocialLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continua con Google
                  </Button>
                  <Button
                    onClick={handleSocialLogin}
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white"
                    disabled={isLoading}
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Continua con Facebook
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">oppure</span>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleUserSubmit} className="space-y-3">
                  <div className="flex items-center text-gray-700 font-semibold text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>Registrati con la tua email</span>
                  </div>
                  <div>
                    <Label htmlFor="user-name">Nome e Cognome</Label>
                    <Input
                      id="user-name"
                      value={userForm.full_name}
                      onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input
                      id="user-email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                      id="user-password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="user-confirm">Conferma Password</Label>
                    <Input
                      id="user-confirm"
                      type="password"
                      value={userForm.confirmPassword}
                      onChange={(e) => setUserForm({...userForm, confirmPassword: e.target.value})}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    Registrati come Appassionato
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="winery" className="space-y-4">
            <Card>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Registrazione Cantina</CardTitle>
                <p className="text-sm text-gray-600">
                  Crea la vetrina della tua cantina e raggiungi nuovi clienti
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleWinerySubmit} className="space-y-3">
                  <div>
                    <Label htmlFor="company-name">Nome Cantina</Label>
                    <Input
                      id="company-name"
                      value={wineryForm.company_name}
                      onChange={(e) => setWineryForm({...wineryForm, company_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-name">Nome Referente</Label>
                    <Input
                      id="contact-name"
                      value={wineryForm.contact_name}
                      onChange={(e) => setWineryForm({...wineryForm, contact_name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="winery-email">Email</Label>
                    <Input
                      id="winery-email"
                      type="email"
                      value={wineryForm.email}
                      onChange={(e) => setWineryForm({...wineryForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="winery-phone">Telefono</Label>
                    <Input
                      id="winery-phone"
                      value={wineryForm.phone}
                      onChange={(e) => setWineryForm({...wineryForm, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="winery-region">Regione</Label>
                      <Input
                        id="winery-region"
                        value={wineryForm.region}
                        onChange={(e) => setWineryForm({...wineryForm, region: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="winery-city">Comune</Label>
                      <Input
                        id="winery-city"
                        value={wineryForm.city}
                        onChange={(e) => setWineryForm({...wineryForm, city: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="winery-password">Password</Label>
                    <Input
                      id="winery-password"
                      type="password"
                      value={wineryForm.password}
                      onChange={(e) => setWineryForm({...wineryForm, password: e.target.value})}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="winery-confirm">Conferma Password</Label>
                    <Input
                      id="winery-confirm"
                      type="password"
                      value={wineryForm.confirmPassword}
                      onChange={(e) => setWineryForm({...wineryForm, confirmPassword: e.target.value})}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={isLoading}
                  >
                    Registrati come Cantina
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-500">
            Continuando accetti i nostri{" "}
            <a href="#" className="text-red-700 underline">Termini di Servizio</a>
            {" "}e l'{" "}
            <a href="#" className="text-red-700 underline">Informativa sulla Privacy</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
