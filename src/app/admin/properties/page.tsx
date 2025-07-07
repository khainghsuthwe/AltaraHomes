'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminProperties, getUser, deleteProperty } from '@/lib/api';
import { Property } from '@/types/types';
import Link from 'next/link';

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchProperties() {
      try {
        const userResponse = await getUser();
        if (userResponse.data.user_type !== 'admin') {
          router.push('/');
          return;
        }
        const response = await getAdminProperties();
        const properties = response.data.results 
          ? response.data.results 
          : Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data].filter((item): item is Property => item !== undefined);
        setProperties(properties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties.');
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [router]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(id);
        setProperties(properties.filter((p) => p.id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin - Manage Properties</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">City</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-t">
                <td className="p-4">{property.title}</td>
                <td className="p-4">{property.city}</td>
                <td className="p-4">${property.price.toLocaleString()}</td>
                <td className="p-4">{property.listing_type}</td>
                <td className="p-4">
                  <Link
                    href={`/properties/${property.id}/edit`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(property.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}