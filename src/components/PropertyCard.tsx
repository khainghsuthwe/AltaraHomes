'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Property } from '@/types/types';
import { addFavorite, removeFavorite, getUser } from '@/lib/api';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
      try {
        const userResponse = await getUser();
        setIsAuthenticated(true);
        const isFav = property.favorited_by?.some((fav) => fav.user.id === userResponse.data.id);
        setIsFavorited(!!isFav);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkFavorite();
  }, [property]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      if (isFavorited) {
        await removeFavorite(property.id);
        setIsFavorited(false);
      } else {
        await addFavorite(property.id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const imageUrl = property.image_urls.length > 0 && property.image_urls[0].startsWith('https://images.pexels.com')
    ? property.image_urls[0]
    : '/placeholder.jpg';

  return (
    <div className="bg-light rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-2 left-2 px-2 py-1 rounded text-light text-sm font-semibold ${
            property.listing_type === 'sell' ? 'bg-success' : 'bg-primary'
          }`}
        >
          {property.listing_type === 'sell' ? 'For Sale' : 'For Rent'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-dark">{property.title}</h3>
        <p className="text-dark/70">{property.address}, {property.city}</p>
        <p className="text-accent font-semibold">${property.price.toLocaleString()}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-dark/70">
            {property.bedrooms} Bed | {property.bathrooms} Bath | {property.square_feet} sqft
          </span>
          <button onClick={handleFavoriteToggle} className="text-dark hover:text-danger">
            {isFavorited ? (
              <HeartSolidIcon className="h-6 w-6 text-danger" />
            ) : (
              <HeartIcon className="h-6 w-6" />
            )}
          </button>
        </div>
        <Link
          href={`/properties/${property.id}`}
          className="block mt-4 text-center px-4 py-2 bg-primary text-light rounded-md hover:bg-primary/90"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}