import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-800 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-xl text-gray-600">
            La tua privacy è importante per noi. Ecco come trattiamo i tuoi dati.
          </p>
          <div className="text-sm text-gray-500 mt-4">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </div>
        </header>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-800" />
                1. Informazioni che Raccogliamo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Informazioni Personali:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Nome e cognome</li>
                  <li>Indirizzo email</li>
                  <li>Numero di telefono</li>
                  <li>Indirizzo di spedizione</li>
                  <li>Preferenze di gusto e profilo utente</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Informazioni Tecniche:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Indirizzo IP e dati di geolocalizzazione (con consenso)</li>
                  <li>Tipo di browser e dispositivo utilizzato</li>
                  <li>Cookie e tecnologie simili</li>
                  <li>Pagine visitate e azioni compiute sul sito</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Come Utilizziamo le Tue Informazioni</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Fornitura del servizio:</strong> Per processare ordini, spedizioni e gestire il tuo account</li>
                <li><strong>Personalizzazione:</strong> Per raccomandare vini basati sui tuoi gusti e preferenze</li>
                <li><strong>Comunicazioni:</strong> Per inviare aggiornamenti su ordini, newsletter (con consenso) e offerte speciali</li>
                <li><strong>Miglioramento del servizio:</strong> Per analizzare l'uso del sito e migliorare l'esperienza utente</li>
                <li><strong>Sicurezza:</strong> Per prevenire frodi e proteggere la piattaforma</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Condivisione dei Dati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Non vendiamo mai i tuoi dati personali a terze parti. Condividiamo le informazioni solo quando necessario:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Cantine partner:</strong> Condividiamo i dettagli degli ordini con le cantine per la gestione e spedizione</li>
                  <li><strong>Fornitori di servizi:</strong> Con aziende che ci aiutano a gestire pagamenti, spedizioni e servizi tecnici</li>
                  <li><strong>Obblighi legali:</strong> Quando richiesto dalla legge o per proteggere i nostri diritti</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. I Tuoi Diritti (GDPR)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Hai il diritto di:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li><strong>Accesso:</strong> Richiedere una copia dei tuoi dati personali</li>
                  <li><strong>Rettifica:</strong> Correggere informazioni inesatte o incomplete</li>
                  <li><strong>Cancellazione:</strong> Richiedere la cancellazione dei tuoi dati ("diritto all'oblio")</li>
                  <li><strong>Portabilità:</strong> Ottenere i tuoi dati in formato leggibile</li>
                  <li><strong>Limitazione:</strong> Limitare il trattamento dei tuoi dati</li>
                  <li><strong>Opposizione:</strong> Opporti al trattamento per scopi di marketing</li>
                </ul>
                <div className="bg-red-50 p-4 rounded-lg mt-4">
                  <p className="text-red-800 font-medium">
                    Per esercitare questi diritti, contattaci utilizzando le informazioni in fondo alla pagina.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Cookie e Tecnologie di Tracciamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">Utilizziamo cookie per:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Cookie essenziali:</strong> Necessari per il funzionamento del sito (carrello, login)</li>
                  <li><strong>Cookie analitici:</strong> Per capire come usi il sito e migliorarlo</li>
                  <li><strong>Cookie di personalizzazione:</strong> Per ricordare le tue preferenze</li>
                  <li><strong>Cookie di marketing:</strong> Per mostrarti annunci rilevanti (solo con consenso)</li>
                </ul>
                <p className="text-gray-600">
                  Puoi gestire le preferenze dei cookie dalle impostazioni del tuo browser o dal nostro banner dei cookie.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Sicurezza dei Dati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Implementiamo misure di sicurezza appropriate per proteggere i tuoi dati:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Crittografia SSL per tutte le comunicazioni</li>
                  <li>Server sicuri e accesso limitato ai dati</li>
                  <li>Monitoraggio costante per attività sospette</li>
                  <li>Backup regolari e procedure di ripristino</li>
                  <li>Formazione del personale sulla privacy e sicurezza</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Conservazione dei Dati</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Conserviamo i tuoi dati personali solo per il tempo necessario agli scopi per cui sono stati raccolti:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-3 space-y-1">
                <li><strong>Account attivi:</strong> Fino alla richiesta di cancellazione</li>
                <li><strong>Dati di fatturazione:</strong> 10 anni per obblighi fiscali</li>
                <li><strong>Dati di marketing:</strong> Fino alla revoca del consenso</li>
                <li><strong>Log del server:</strong> Massimo 12 mesi</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Contatti e Reclami</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Per qualsiasi domanda sulla privacy, contattaci:</h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-red-800" />
                      <span>privacy@cantinanova.it</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-red-800" />
                      <span>+39 02 1234 5678</span>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-red-800 mt-0.5" />
                      <span>CantinaNova S.r.l.<br />Via del Vino, 123<br />20121 Milano, Italia</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 font-medium mb-2">Hai il diritto di presentare reclamo</p>
                  <p className="text-gray-600 text-sm">
                    Se ritieni che il trattamento dei tuoi dati personali non sia conforme alla normativa, 
                    puoi presentare reclamo al Garante per la Protezione dei Dati Personali o all'autorità 
                    di controllo del tuo paese.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Modifiche alla Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Potremmo aggiornare questa Privacy Policy periodicamente per riflettere cambiamenti 
                nelle nostre pratiche o nella legislazione. Ti informeremo di eventuali modifiche 
                significative tramite email o avviso sul sito. Ti incoraggiamo a rivedere 
                questa pagina regolarmente per rimanere informato su come proteggiamo i tuoi dati.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Questa Privacy Policy è stata aggiornata il {new Date().toLocaleDateString('it-IT')} 
            ed è conforme al Regolamento Generale sulla Protezione dei Dati (GDPR) UE 2016/679.
          </p>
        </div>
      </div>
    </div>
  );
}