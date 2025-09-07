import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Copy, Edit, Trash2, FileText, Image, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from "@/components/ui/checkbox";
import EditMediaModal from './EditMediaModal';

export default function MediaCard({ item, onUpdate, onDelete, collections, isSelected = false, onSelect }) {
  const [showEditModal, setShowEditModal] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link copiato!');
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Card className={`group overflow-hidden hover:shadow-lg transition-all relative ${isSelected ? 'ring-2 ring-red-500 bg-red-50' : ''}`}>
        {/* Checkbox per selezione */}
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(item.id, checked)}
            className="bg-white shadow-sm"
          />
        </div>

        <CardContent className="p-0">
          <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
            {item.type === 'image' ? (
              <img 
                src={item.file_url} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                {getFileIcon(item.type)}
                <span className="text-xs mt-1 font-medium">
                  {item.file_type?.split('/')[1]?.toUpperCase()}
                </span>
              </div>
            )}
            
            {/* Overlay con azioni */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={() => copyToClipboard(item.file_url)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copia Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Modifica
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(item.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Elimina
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="p-3">
            <h4 className="font-medium text-sm truncate mb-1">{item.name}</h4>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {item.collection}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatFileSize(item.file_size)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditMediaModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={item}
        collections={collections}
        onUpdate={onUpdate}
      />
    </>
  );
}