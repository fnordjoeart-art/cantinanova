import React from 'react';
import MediaCard from './MediaCard';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

export default function MediaGrid({ mediaItems, onUpdate, onDelete, collections, selectedItems = [], onSelectItem, onSelectAll, onDeleteSelected }) {
  const isAllSelected = mediaItems.length > 0 && selectedItems.length === mediaItems.length;

  if (mediaItems.length === 0) {
    return (
      <div className="mt-8 text-center py-16 border-2 border-dashed rounded-xl bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            📁
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Nessun file trovato</h3>
          <p className="text-gray-500">Prova a cambiare i filtri o carica nuovi file.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      {/* Header con selezione multipla */}
      <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            aria-label="Seleziona tutto"
          />
          <span className="text-sm font-medium">
            {selectedItems.length > 0 ? `${selectedItems.length} file selezionati` : 'Seleziona tutto'}
          </span>
        </div>
        
        {selectedItems.length > 0 && (
          <Button 
            variant="destructive" 
            onClick={onDeleteSelected}
            className="flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Elimina Selezionati ({selectedItems.length})
          </Button>
        )}
      </div>

      {/* Griglia media */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {mediaItems.map(item => (
          <MediaCard 
            key={item.id} 
            item={item} 
            onUpdate={onUpdate}
            onDelete={onDelete}
            collections={collections}
            isSelected={selectedItems.includes(item.id)}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    </div>
  );
}