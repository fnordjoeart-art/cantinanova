import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Scale, Shield, AlertTriangle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-red-800 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Termini di Servizio</h1>
          </div>
          <p className="text-xl text-gray-600">
            Termini e condizioni per l'utilizzo della piattaforma CantinaNova
          </p>
          <div className="text-sm text-gray-500 mt-4">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </div>
        </header>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="w-5 h-5 mr-2 text-red-800" />
                1. Accettazione dei Termini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Utilizzando il sito web CantinaNova e i suoi servizi, accetti integralmente questi 
                Termini di Servizio. Se non accetti questi termini, non utilizzare i nostri servizi. 
                Ci riserviamo il diritto di modificare questi termini in qualsiasi momento, 
                e le modifiche entreranno in vigore immediatamente dopo la pubblicazione.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Descrizione del Servizio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  CantinaNova è una piattaforma digitale che:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Connette consumatori con cantine emergenti italiane</li>
                  <li>Facilita la vendita diretta di vini tra produttori e consumatori</li>
                  <li>Offre esperienze enogastronomiche e degustazioni</li>
                  <li>Fornisce informazioni su vini, cantine e territori</li>
                  <li>Organizza box degustazione curate e personalizzate</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Registrazione e Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Requisiti per la Registrazione:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Devi avere almeno 18 anni per creare un account</li>
                    <li>Devi fornire informazioni accurate e veritiere</li>
                    <li>Sei responsabile della sicurezza del tuo account e password</li>
                    <li>Un account per persona - non sono permessi account multipli</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800">Importante:</h4>
                      <p className="text-amber-700 text-sm mt-1">
                        Sei responsabile di tutte le attività che avvengono sotto il tuo account. 
                        Notificaci immediatamente qualsiasi uso non autorizzato.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Acquisti e Pagamenti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Processo di Acquisto:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Tutti i prezzi sono espressi in Euro e includono IVA dove applicabile</li>
                    <li>L'ordine è confermato solo dopo il pagamento completato con successo</li>
                    <li>Accettiamo carte di credito, PayPal e altri metodi di pagamento indicati</li>
                    <li>Ci riserviamo il diritto di cancellare ordini in caso di indisponibilità</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Politica di Cancellazione:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Puoi cancellare l'ordine entro 1 ora dall'acquisto</li>
                    <li>Dopo la spedizione, si applica la politica di reso</li>
                    <li>Eventi e degustazioni hanno politiche di cancellazione specifiche</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Spedizioni e Consegne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Termini di Spedizione:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Le spedizioni avvengono generalmente entro 3-7 giorni lavorativi</li>
                    <li>I tempi possono variare in base alla cantina e alla destinazione</li>
                    <li>Spediamo solo in Italia e paesi UE selezionati</li>
                    <li>Il destinatario deve essere maggiorenne per ricevere prodotti alcolici</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Responsabilità:</h4>
                  <p className="text-gray-600">
                    Una volta consegnato al corriere, la responsabilità del pacco passa al destinatario. 
                    In caso di danni durante il trasporto, contattaci entro 48 ore dalla consegna.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Diritto di Recesso e Resi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Diritto di Recesso (14 giorni):</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Hai 14 giorni dalla consegna per restituire i prodotti non deperibili</li>
                    <li>I prodotti devono essere nelle condizioni originali e non aperti</li>
                    <li>Le spese di restituzione sono a carico del cliente</li>
                    <li>Il rimborso avviene entro 14 giorni dal ricevimento del reso</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Eccezioni:</h4>
                  <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                    <li>Vini deperibili o con sigillo aperto non sono rimborsabili</li>
                    <li>Eventi e degustazioni non sono rimborsabili (solo riprogrammabili)</li>
                    <li>Prodotti personalizzati o su ordinazione</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Comportamento Utenti e Contenuti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">È Vietato:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Pubblicare contenuti offensivi, illegali o inappropriati</li>
                    <li>Interferire con il funzionamento della piattaforma</li>
                    <li>Creare account falsi o impersonare altre persone</li>
                    <li>Utilizzare la piattaforma per scopi commerciali non autorizzati</li>
                    <li>Violare diritti di proprietà intellettuale</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Conseguenze:</h4>
                  <p className="text-gray-600">
                    Il mancato rispetto di queste regole può comportare la sospensione 
                    o cancellazione dell'account, senza preavviso e senza rimborsi.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Proprietà Intellettuale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Tutti i contenuti presenti su CantinaNova (testi, immagini, loghi, design) 
                  sono protetti da copyright e altri diritti di proprietà intellettuale.
                </p>
                
                <div>
                  <h4 className="font-semibold mb-2">È Consentito:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Visualizzare e scaricare contenuti per uso personale</li>
                    <li>Condividere link ai prodotti sui social media</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">È Vietato:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Copiare, modificare o distribuire contenuti senza autorizzazione</li>
                    <li>Utilizzare i nostri marchi o loghi senza permesso</li>
                    <li>Creare opere derivative dai nostri contenuti</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-800" />
                9. Limitazione di Responsabilità
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  CantinaNova fornisce la piattaforma "così com'è" e non garantisce:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Disponibilità continua e ininterrotta del servizio</li>
                  <li>Assenza di errori o malfunzionamenti</li>
                  <li>Qualità specifica dei prodotti venduti dalle cantine</li>
                </ul>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    <strong>Importante:</strong> La nostra responsabilità è limitata al valore 
                    dell'ordine specifico. Non siamo responsabili per danni indiretti, 
                    perdite di profitto o danni consequenziali.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Risoluzione delle Controversie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Procedura di Reclamo:</h4>
                  <ol className="list-decimal list-inside text-gray-600 space-y-1">
                    <li>Contatta il nostro servizio clienti: support@cantinanova.it</li>
                    <li>Descrivi dettagliatamente il problema con numero ordine</li>
                    <li>Ti risponderemo entro 48 ore con una proposta di risoluzione</li>
                    <li>Se non soddisfatto, puoi rivolgerti agli organismi di mediazione</li>
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Giurisdizione:</h4>
                  <p className="text-gray-600">
                    Questi termini sono regolati dalla legge italiana. 
                    Per controversie non risolte amichevolmente, è competente il Foro di Milano.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Contatti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Per domande sui Termini di Servizio:</h4>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> legal@cantinanova.it</p>
                    <p><strong>Telefono:</strong> +39 02 1234 5678</p>
                    <p><strong>Indirizzo:</strong><br />
                    CantinaNova S.r.l.<br />
                    Via del Vino, 123<br />
                    20121 Milano, Italia</p>
                    <p><strong>Partita IVA:</strong> IT12345678901</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Questi Termini di Servizio sono stati aggiornati il {new Date().toLocaleDateString('it-IT')} 
            e sono conformi alla legislazione italiana e europea applicabile.
          </p>
        </div>
      </div>
    </div>
  );
}