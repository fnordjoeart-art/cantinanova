
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, ArrowLeft, Mail, Lock, Eye, EyeOff, Wine, Heart, Sparkles } from "lucide-react";
import { User } from "@/api/entities"; // Importo il vero SDK User

export default function UserLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Le password non coincidono");
      return;
    }
    
    try {
        // Qui andrà la logica di login/registrazione reale
        // Esempio: await User.loginWithPassword(formData.email, formData.password);
        alert("Funzionalità in costruzione. Per ora, usa il login con Google.");
        // For demonstration, if we want to proceed and mock a successful action:
        // const mockUser = {
        //   id: "user_" + Date.now(),
        //   email: formData.email,
        //   full_name: formData.full_name || "Utente Demo",
        //   role: "user",
        //   completed_onboarding: false
        // };
        // localStorage.setItem('demo_user', JSON.stringify(mockUser));
        // if (!isLogin) {
        //   navigate(createPageUrl("Onboarding"));
        // } else {
        //   navigate(createPageUrl("Home"));
        // }
        // window.location.reload();
    } catch(error) {
        alert("Credenziali non valide. Riprova.");
    }
  };

  const handleSocialLogin = async () => {
    try {
      await User.login();
      // La piattaforma gestirà il reindirizzamento dopo il login
    } catch (error) {
      console.error("Login con Google fallito", error);
      alert("Si è verificato un errore durante il login. Riprova.");
    }
  };

  // handleDemoLogin function removed as per outline

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50/30 flex items-center justify-center p-4">
      {/* Pulsante Torna alla Home */}
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Home"))}
        className="absolute top-6 left-6 text-gray-600 hover:text-gray-800 hover:bg-white/50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Torna alla Home
      </Button>

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? "Benvenuto di nuovo!" : "Unisciti a CantinaNova"}
          </CardTitle>
          <p className="text-gray-600">
            {isLogin ? "Accedi al tuo account" : "Crea il tuo account per iniziare"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Login Demo per Testing - REMOVED */}

          {/* Login Sociale */}
          <div className="space-y-3">
            <Button 
              onClick={handleSocialLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              </svg>
              Continua con Google
            </Button>
            
            <Button
              onClick={handleSocialLogin}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
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

          {/* Form Email */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Mario Rossi"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="mario@esempio.it"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Conferma Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-red-700 hover:bg-red-800 text-white py-3"
            >
              {isLogin ? "Accedi" : "Registrati"}
            </Button>
          </form>

          {/* Toggle Login/Registrazione */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-red-700 hover:text-red-800 hover:underline"
            >
              {isLogin ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
            </button>
          </div>

          {/* Vantaggi Registrazione */}
          {!isLogin && (
            <div className="bg-red-50 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Vantaggi del tuo account
              </h4>
              <ul className="text-sm text-red-700 space-y-2">
                <li className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-600" />
                  Profilo gustativo personalizzato
                </li>
                <li className="flex items-center">
                  <Wine className="w-4 h-4 mr-2 text-red-600" />
                  Raccomandazioni su misura per te
                </li>
                <li className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-red-600" />
                  Storico ordini e wishlist
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
