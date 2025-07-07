'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getProperties, deleteProperty, getUser } from '@/lib/api';
import { Property, User, PropertyQueryParams } from '@/types/types';
import { TrashIcon, EyeIcon, PencilIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';

export default function AgentDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [listingType, setListingType] = useState<'sell' | 'rent' | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const propertiesPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await getUser();
        const fetchedUser = response.data;
        if (fetchedUser.user_type !== 'agent' && fetchedUser.user_type !== 'admin') {
          setError('You must be an agent or admin to access this page.');
          router.push('/login');
        } else {
          setUser(fetchedUser);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        setError('Please sign in to access this page.');
        router.push('/login');
      } finally {
        setIsAuthChecked(true);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    async function fetchProperties() {
      setLoading(true);
      setError('');
      try {
        const params: PropertyQueryParams = {
          page: currentPage,
          page_size: propertiesPerPage,
          search: search || undefined,
          listing_type: listingType || undefined,
        };
        if (user?.user_type === 'agent') {
          params.agent_id = user.id;
        }
        const response = await getProperties(params);
        setProperties(response.data.results || []);
        setTotalPages(Math.ceil(((response.data.results?.length ?? 0) / propertiesPerPage) || 1));
      } catch (err) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          const data = axiosError.response.data;
          const errorMessage =
            typeof data === 'object' && data !== null && 'message' in data
              ? (data as { message?: string }).message
              : undefined;
          setError(errorMessage || 'Failed to load properties. Please try again.');
        } else {
          setError('Failed to load properties. Please try again.');
        }
        console.error('Fetch properties error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [user, currentPage, search, listingType]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await deleteProperty(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete property error:', err);
      setError('Failed to delete property. Please try again.');
      console.error('Delete property error:', err);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!isAuthChecked) {
    return <p className="text-center py-16 text-gray-600">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
          <EyeIcon className="h-8 w-8 mr-2 text-blue-600" />
          {user.user_type === 'agent' ? 'My Posted Properties' : 'Admin Property Dashboard'}
        </h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or address..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value as 'sell' | 'rent' | '')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Listings</option>
              <option value="sell">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            <Link
              href="/properties/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Create Property
            </Link>
          </div>
          {loading ? (
            <p className="text-center text-gray-600">Loading properties...</p>
          ) : properties.length === 0 ? (
            <p className="text-center text-gray-600">No properties found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${property.price.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property.listing_type === 'sell' ? 'For Sale' : 'For Rent'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{property.property_type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${property.address}, ${property.city}, ${property.state}`}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/properties/${property.id}`} className="text-blue-600 hover:text-blue-800 mr-4">
                          <EyeIcon className="h-5 w-5 inline" />
                        </Link>
                        <Link href={`/properties/${property.id}/edit`} className="text-yellow-600 hover:text-yellow-800 mr-4">
                          <PencilIcon className="h-5 w-5 inline" />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}