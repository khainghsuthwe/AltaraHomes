'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProperty, getUser } from '@/lib/api';
import { Property, User } from '@/types/types';
import { HomeIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';
import dynamic from 'next/dynamic';
import { useMapEvents } from 'react-leaflet'; // Direct import for the hook
import 'leaflet/dist/leaflet.css';

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

export default function CreateProperty() {
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    price: 0,
    listing_type: 'sell',
    property_type: 'house',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    bedrooms: 0,
    bathrooms: 0,
    square_feet: 0,
    amenities: [],
    image_urls: [],
    latitude: undefined,
    longitude: undefined,
  });
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [amenityInput, setAmenityInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const router = useRouter();
  const MYANMAR_STATES = [
    'Kachin',
    'Kayah',
    'Kayin',
    'Chin',
    'Sagaing',
    'Tanintharyi',
    'Bago',
    'Magway',
    'Mandalay',
    'Mon',
    'Rakhine',
    'Yangon',
    'Shan',
    'Ayeyarwady',
  ];

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await getUser();
        const fetchedUser = response.data;
        if (fetchedUser.user_type !== 'agent' && fetchedUser.user_type !== 'admin') {
          setError('You must be an agent or admin to create a property.');
          router.push('/login');
        } else {
          setUser(fetchedUser);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Please sign in to create a property.');
        router.push('/login');
      } finally {
        setIsAuthChecked(true);
      }
    }
    checkAuth();
  }, [router]);

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities?.includes(amenityInput.trim())) {
      setFormData({
        ...formData,
        amenities: [...(formData.amenities || []), amenityInput.trim()],
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities?.filter((a) => a !== amenity) || [],
    });
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim() && !formData.image_urls?.includes(imageUrlInput.trim())) {
      setFormData({
        ...formData,
        image_urls: [...(formData.image_urls || []), imageUrlInput.trim()],
      });
      setImageUrlInput('');
    }
  };

  const removeImageUrl = (url: string) => {
    setFormData({
      ...formData,
      image_urls: formData.image_urls?.filter((u) => u !== url) || [],
    });
  };

  const handleMapClick = (lat: number, lng: number) => {
    setFormData({ ...formData, latitude: lat, longitude: lng });
  };

  const searchAddress = async () => {
    if (!addressSearch.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressSearch)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'YourAppName/1.0 (contact@yourdomain.com)' } }
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setFormData({ ...formData, latitude: parseFloat(lat), longitude: parseFloat(lon) });
      } else {
        setError('Address not found. Please try another address.');
      }
    } catch (err) {
      console.error('Error searching address:', err);
      setError('Failed to search address. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.price! < 0 || formData.bedrooms! < 0 || formData.bathrooms! < 0 || formData.square_feet! < 0) {
      setError('Price, bedrooms, bathrooms, and square feet must be non-negative.');
      setLoading(false);
      return;
    }

    try {
      await createProperty(formData);
      router.push('/properties');
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 401) {
        setError('Session expired. Please sign in again.');
        router.push('/login');
      } else if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { [key: string]: string[] | string };
        const errorMessages = Object.values(errorData).flat().join(' ');
        setError(errorMessages || 'Failed to create property.');
      } else {
        setError('Failed to create property. Please try again.');
      }
      console.error('Create property error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Custom hook for handling map events
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  if (!isAuthChecked) {
    return <p className="text-center py-16 text-dark/70">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-light p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-dark mb-6 flex items-center">
          <PlusCircleIcon className="h-8 w-8 mr-2 text-accent" />
          Create New Property
        </h2>
        {error && <p className="text-danger mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-dark">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min="0"
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">Listing Type</label>
              <select
                value={formData.listing_type}
                onChange={(e) => setFormData({ ...formData, listing_type: e.target.value as 'sell' | 'rent' })}
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">Property Type</label>
              <select
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value as 'house' | 'apartment' | 'condo' | 'land' })}
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Select a state</option>
                {MYANMAR_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">Zip Code</label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">Bedrooms</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                required
                min="0"
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark">Bathrooms</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                required
                min="0"
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark">Square Feet</label>
              <input
                type="number"
                value={formData.square_feet}
                onChange={(e) => setFormData({ ...formData, square_feet: Number(e.target.value) })}
                required
                min="0"
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-dark">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark">Amenities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g., Pool, Garage"
                className="flex-1 px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-primary text-light rounded-lg hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities?.map((amenity) => (
                <span
                  key={amenity}
                  className="flex items-center bg-secondary text-dark text-sm px-3 py-1 rounded-full"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="ml-2 text-dark hover:text-danger"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark">Image URLs (Pexels)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.pexels.com/photos/..."
                className="flex-1 px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={addImageUrl}
                className="px-4 py-2 bg-primary text-light rounded-lg hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.image_urls?.map((url) => (
                <span
                  key={url}
                  className="flex items-center bg-secondary text-dark text-sm px-3 py-1 rounded-full"
                >
                  {url.substring(0, 20)}...
                  <button
                    type="button"
                    onClick={() => removeImageUrl(url)}
                    className="ml-2 text-dark hover:text-danger"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark">Location</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={addressSearch}
                onChange={(e) => setAddressSearch(e.target.value)}
                placeholder="Search address..."
                className="flex-1 px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="button"
                onClick={searchAddress}
                className="px-4 py-2 bg-primary text-light rounded-lg hover:bg-primary/90"
              >
                Search
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium text-dark">Latitude</label>
                <input
                  type="number"
                  value={formData.latitude ?? ''}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                  step="any"
                  className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark">Longitude</label>
                <input
                  type="number"
                  value={formData.longitude ?? ''}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                  step="any"
                  className="w-full px-3 py-2 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>
            <div className="h-64 rounded-lg overflow-hidden">
              <MapContainer
                center={[16.8409, 96.1700]} // Yangon, Myanmar
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {formData.latitude != null && formData.longitude != null && (
                  <Marker position={[formData.latitude, formData.longitude]}>
                    <Popup>Selected Location</Popup>
                  </Marker>
                )}
                <MapClickHandler />
              </MapContainer>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-3 bg-primary text-light rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            {loading ? 'Creating Property...' : 'Create Property'}
          </button>
        </form>
        <p className="mt-4 text-center text-dark/70">
          <Link href="/properties" className="text-accent hover:text-accent/80">
            Back to Properties
          </Link>
        </p>
      </div>
    </div>
  );
}