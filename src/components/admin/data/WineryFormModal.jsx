import React, { useState, useEffect } from 'react';
import { Winery } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

const slugify = (text) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');


export default function WineryFormModal({ isOpen, onClose, winery, onSuccess }) {
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFormData(winery || {
                name: '',
                codice_cantina: '',
                slug: '',
                region: '',
                descrizione_breve: '',
                story: '',
                attiva: true,
            });
            setError('');
        }
    }, [isOpen, winery]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => {
            const updated = {...prev, [name]: newValue };
            if (name === 'name') {
                updated.slug = slugify(newValue);
            }
            return updated;
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.codice_cantina || !formData.region) {
            setError('Nome, Codice Cantina e Regione sono campi obbligatori.');
            return;
        }

        setIsSaving(true);
        setError('');
        
        try {
            if (winery?.id) {
                // Update
                await Winery.update(winery.id, formData);
            } else {
                // Create
                await Winery.create(formData);
            }
            onSuccess();
        } catch (err) {
            console.error('Failed to save winery:', err);
            setError(`Salvataggio fallito: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{winery ? 'Modifica Cantina' : 'Crea Nuova Cantina'}</DialogTitle>
                    <DialogDescription>
                        Compila i dettagli della cantina. I campi con * sono obbligatori.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome Cantina *</Label>
                            <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="codice_cantina">Codice Cantina *</Label>
                            <Input id="codice_cantina" name="codice_cantina" value={formData.codice_cantina || ''} onChange={handleInputChange} disabled={!!winery} />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (URL)</Label>
                            <Input id="slug" name="slug" value={formData.slug || ''} onChange={handleInputChange} className="bg-gray-100" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="region">Regione *</Label>
                            <Input id="region" name="region" value={formData.region || ''} onChange={handleInputChange} placeholder="Es. Piemonte, Toscana..."/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="descrizione_breve">Descrizione Breve</Label>
                        <Input id="descrizione_breve" name="descrizione_breve" value={formData.descrizione_breve || ''} onChange={handleInputChange} placeholder="Slogan o frase ad effetto"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="story">Storia e Dettagli</Label>
                        <Textarea id="story" name="story" value={formData.story || ''} onChange={handleInputChange} rows={4} placeholder="Racconta la filosofia, il territorio, le persone..."/>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Switch id="attiva" name="attiva" checked={formData.attiva} onCheckedChange={(checked) => handleInputChange({ target: { name: 'attiva', type: 'checkbox', checked } })} />
                        <Label htmlFor="attiva">Cantina Attiva</Label>
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                    
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onClose}>Annulla</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvataggio...</> : 'Salva Cantina'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}