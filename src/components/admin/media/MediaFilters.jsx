import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function MediaFilters({ onFilterChange, collections }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input 
          placeholder="Cerca per nome o descrizione..." 
          className="pl-10"
          onChange={(e) => onFilterChange(prev => ({...prev, query: e.target.value}))}
        />
      </div>
      <Select onValueChange={(value) => onFilterChange(prev => ({...prev, collection: value}))}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Tutte le collezioni" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tutte le collezioni</SelectItem>
          {collections.map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}