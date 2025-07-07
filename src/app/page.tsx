'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProperties } from '@/lib/api';
import { Property } from '@/types/types';
import { useAuth } from '@/lib/auth-context';
import { SparklesIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProperties({ is_featured: true, limit: 6 });
        setFeaturedProperties(response.data.results || []);
      } catch (err) {
        setError('Failed to load featured properties.');
        console.error('Error fetching featured properties:', err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-muted">
      {/* Hero Section */}
      <div className="bg-primary text-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Home Today</h1>
          <p className="text-lg mb-8">Whether you are renting, buying, or selling, we have the perfect property for you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties?listing_type=rent"
              className="px-6 py-3 bg-light text-primary rounded-lg hover:bg-secondary transition-colors"
            >
              Rent a Home
            </Link>
            <Link
              href="/properties"
              className="px-6 py-3 bg-transparent border-2 border-light text-light rounded-lg hover:bg-light hover:text-primary transition-colors"
            >
              View Properties
            </Link>
            {!authLoading && user && (user.user_type === 'admin' || user.user_type === 'agent') && (
              <Link
                href="/create-property"
                className="px-6 py-3 bg-success text-light rounded-lg hover:bg-success/90 transition-colors"
              >
                Sell a Property
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-light py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-dark mb-6">Start Your Real Estate Journey</h2>
          <p className="text-lg text-dark/70 mb-8">Explore our offerings and take the next step toward your dream property.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-muted rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-dark mb-4">Rent a Home</h3>
              <p className="text-dark/70 mb-4">Find the perfect rental property to suit your lifestyle.</p>
              <Link
                href="/properties?listing_type=rent"
                className="inline-block px-4 py-2 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors"
              >
                Browse Rentals
              </Link>
            </div>

            <div className="p-6 bg-muted rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-dark mb-4">Buy a Property</h3>
              <p className="text-dark/70 mb-4">Discover homes for sale in your desired location.</p>
              <Link
                href="/properties?listing_type=sell"
                className="inline-block px-4 py-2 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors"
              >
                Browse for Sale
              </Link>
            </div>

            {!authLoading ? (
              user && (user.user_type === 'admin' || user.user_type === 'agent') ? (
                <div className="p-6 bg-muted rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-dark">Sell Your Property</h3>
                  <p className="text-dark/70 mb-4">List your property and reach potential buyers.</p>
                  <Link
                    href="/create-property"
                    className="inline-block px-4 py-2 bg-success text-light rounded-lg hover:bg-success/90 transition-colors"
                  >
                    List Property
                  </Link>
                </div>
              ) : (
                <div className="p-6 bg-secondary rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-dark">Join Our Community</h3>
                  <p className="text-dark/70">Sign up to save favorites and contact agents.</p>
                  <Link
                    href="/register"
                    className="inline-block px-4 py-2 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            ) : (
              <div className="p-6 bg-muted rounded-lg shadow-md">
                <h3 className="text-dark/70 mb-4">Loading...</h3>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-full">
          <h2 className="text-3xl font-bold text-dark mb-8 flex items-center">
            <SparklesIcon className="h-8 w-8 text-accent mr-2" />
            Featured Properties
          </h2>

          {error && <p className="text-danger">{error}</p>}
          {featuredProperties.length === 0 && !error && (
            <p className="text-dark/70 text-center">No featured properties available.</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {featuredProperties.map((property) => (
              <Link key={property.id} href={`/properties/${property.id}`} className="group">
                <div className="bg-light rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={property.image_urls[0] || '/placeholder.jpg'}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-dark">{property.title}</h3>
                    <p className="text-dark/70 text-sm mb-2">
                      {property.address}, {property.city}, {property.state}
                    </p>
                    <p className="text-accent font-bold">${property.price.toLocaleString()}</p>
                    <div className="flex space-x-2 text-dark/70 text-sm mt-2">
                      <span>{property.bedrooms} Beds</span>
                      <span>•</span>
                      <span>{property.bathrooms} Baths</span>
                      <span>•</span>
                      <span>{property.square_feet} sqft</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}