'use client';

import { useState } from 'react';
import { PropertyQueryParams } from '@/types/types';

interface PropertyFilterProps {
  onFilter: (filters: PropertyQueryParams) => void;
}

export default function PropertyFilter({ onFilter }: PropertyFilterProps) {
  const [filters, setFilters] = useState<PropertyQueryParams>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean filters: remove empty strings, undefined, or invalid values
    const cleanedFilters: PropertyQueryParams = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        cleanedFilters[key as keyof PropertyQueryParams] = value;
      }
    });
    onFilter(cleanedFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="City"
          value={filters.city || ''}
          onChange={(e) => setFilters({ ...filters, city: e.target.value || undefined })}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Min Price"
          value={filters.price_min || ''}
          onChange={(e) => setFilters({ ...filters, price_min: e.target.value || undefined })}
          min="0"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.price_max || ''}
          onChange={(e) => setFilters({ ...filters, price_max: e.target.value || undefined })}
          min="0"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.listing_type || ''}
          onChange={(e) => setFilters({ ...filters, listing_type: e.target.value as 'sell' | 'rent' | '' })}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Types</option>
          <option value="sell">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <select
          value={filters.property_type || ''}
          onChange={(e) => setFilters({ ...filters, property_type: e.target.value || undefined })}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Property Types</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="condo">Condo</option>
          <option value="land">Land</option>
        </select>
        <input
          type="number"
          placeholder="Bedrooms"
          value={filters.bedrooms || ''}
          onChange={(e) => setFilters({ ...filters, bedrooms: Number(e.target.value) || undefined })}
          min="0"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          placeholder="Bathrooms"
          value={filters.bathrooms || ''}
          onChange={(e) => setFilters({ ...filters, bathrooms: Number(e.target.value) || undefined })}
          min="0"
          step="0.5"
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Search keywords"
          value={filters.search || ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mt-4 flex gap-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </form>
  );
}