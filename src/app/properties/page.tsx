'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getProperties } from '@/lib/api';
import { Property, PropertyQueryParams } from '@/types/types';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilter from '@/components/PropertyFilter';

function PropertiesContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // optional: allow dynamic pageSize
  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchProperties = async (params: PropertyQueryParams = {}) => {
    try {
      setLoading(true);
      const response = await getProperties(params);
      const data = response.data;
      setProperties(data.results || []);
      setCount(data.count || 0);
      setCurrentPage(Number(params.page) || 1);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const updateURLParams = (params: Record<string, string | number | boolean>) => {
    const filteredParams = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    router.push(`/properties?${filteredParams}`);
  };

  useEffect(() => {
    const paramsObj = Object.fromEntries(searchParams.entries());
    const page = parseInt(paramsObj.page || '1', 10);
    fetchProperties({ ...paramsObj, page, page_size: pageSize });
  }, [searchParams]);

  const totalPages = Math.ceil(count / pageSize);

  return (
    <div className="container mx-auto p-4 bg-muted min-h-screen">
      <h2 className="text-3xl font-bold mb-4 text-dark">Properties</h2>
      <PropertyFilter onFilter={(filters) => updateURLParams({ ...filters, page: 1 })} />
      {loading ? (
        <p className="text-dark/70">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-center text-dark/70">No properties found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => updateURLParams({ page: currentPage - 1 })}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-primary text-light rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-dark">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => updateURLParams({ page: currentPage + 1 })}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-primary text-light rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<p className="text-center py-16 text-dark/70">Loading properties...</p>}>
      <PropertiesContent />
    </Suspense>
  );
}