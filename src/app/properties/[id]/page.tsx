'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProperty, createInquiry, deleteProperty, getUser } from '@/lib/api';
import { Property, InquiryRequest, User } from '@/types/types';
import Map from '@/components/Map';
import AgentCard from '@/components/AgentCard';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon, UserIcon, SparklesIcon, ArrowsPointingOutIcon, TagIcon, PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [inquiry, setInquiry] = useState<InquiryRequest>({
    name: '',
    email: '',
    phone: '',
    message: '',
    property: Number(id),
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [propertyResponse, userResponse] = await Promise.all([
          getProperty(Number(id)),
          getUser().catch(() => null),
        ]);
        setProperty(propertyResponse.data);
        setUser(userResponse?.data || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInquiry(inquiry);
      alert('Inquiry submitted successfully!');
      setInquiry({ ...inquiry, name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(Number(id));
        router.push('/properties');
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property. Please try again.');
      }
    }
  };

  const nextImage = () => {
    if (property && property.image_urls.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.image_urls.length);
    }
  };

  const prevImage = () => {
    if (property && property.image_urls.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.image_urls.length) % property.image_urls.length);
    }
  };

  if (loading) return <p className="text-center py-16 text-dark/70">Loading...</p>;
  if (!property) return <p className="text-center py-16 text-dark">Property not found</p>;

  const imageUrl = property.image_urls.length > 0 && property.image_urls[currentImageIndex]?.startsWith('https://images.pexels.com')
    ? property.image_urls[currentImageIndex]
    : '/placeholder.jpg';

  return (
    <div className="container mx-auto p-4 bg-muted">
      <h1 className="text-3xl font-bold text-dark mb-4">{property.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Photo Gallery */}
          <div className="relative h-96 mb-4">
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover rounded-lg"
            />
            {property.image_urls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary text-light p-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-light p-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {property.image_urls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-primary' : 'bg-dark/30'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {property.latitude != null && property.longitude != null && !isNaN(property.latitude) && !isNaN(property.longitude) ? (
            <div className="mt-4 h-64 rounded-lg overflow-hidden">
              <Map latitude={property.latitude} longitude={property.longitude} />
            </div>
          ) : (
            <p className="mt-4 text-center text-dark/70">Map unavailable: Invalid or missing coordinates</p>
          )}
        </div>
        <div>
          <p className="text-accent text-2xl font-semibold">${property.price.toLocaleString()}</p>
          <p className="text-dark/70 text-sm mt-1">
            {property.address}, {property.city}, {property.state} {property.zip_code}
          </p>
          <p className="mt-4 text-dark">{property.description}</p>
          <ul className="mt-4 space-y-2 text-dark">
            <li className="flex items-center">
              <HomeIcon className="h-5 w-5 mr-2 text-accent" />
              Bedrooms: <span className="font-semibold ml-1">{property.bedrooms}</span>
            </li>
            <li className="flex items-center">
              <SparklesIcon className="h-5 w-5 mr-2 text-accent" />
              Bathrooms: <span className="font-semibold ml-1">{property.bathrooms}</span>
            </li>
            <li className="flex items-center">
              <ArrowsPointingOutIcon className="h-5 w-5 mr-2 text-accent" />
              Square Area: <span className="font-semibold ml-1">{property.square_feet} sqft</span>
            </li>
            <li className="flex items-center">
              <TagIcon className="h-5 w-5 mr-2 text-accent" />
              Type: <span className="font-semibold ml-1">{property.property_type}</span>
            </li>
            <li className="flex items-center">
              <TagIcon className="h-5 w-5 mr-2 text-accent" />
              Listing: <span className="font-semibold ml-1">{property.listing_type === 'sell' ? 'For Sale' : 'For Rent'}</span>
            </li>
            {property.amenities?.length > 0 && (
              <li>
                Amenities:
                <ul className="list-disc pl-8 mt-1">
                  {property.amenities.map((amenity, index) => (
                    <li key={index} className="text-dark/70">{amenity}</li>
                  ))}
                </ul>
              </li>
            )}
          </ul>
          {(user?.user_type === 'admin' || user?.user_type === 'agent') && (
            <div className="mt-6 flex space-x-4">
              <Link
                href={`/properties/${id}/edit`}
                className="px-4 py-2 bg-accent text-light rounded-lg hover:bg-accent/90 transition-colors flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-danger text-light rounded-lg hover:bg-danger/90 transition-colors flex items-center"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-dark mb-4">Contact Agent</h2>
        <AgentCard agent={property.agent} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-dark mb-4">Send Inquiry</h2>
        <div className="bg-light p-6 rounded-lg shadow-md max-w-lg mx-auto">
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark flex items-center">
                <UserIcon className="h-4 w-4 mr-2 text-accent" />
                Full Name
              </label>
              <input
                type="text"
                value={inquiry.name}
                onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                placeholder="Full Name"
                required
                className="w-full p-3 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2 text-accent" />
                Email
              </label>
              <input
                type="email"
                value={inquiry.email}
                onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                placeholder="Email"
                required
                className="w-full p-3 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2 text-accent" />
                Phone Number
              </label>
              <input
                type="tel"
                value={inquiry.phone}
                onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                placeholder="Phone Number"
                required
                className="w-full p-3 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark flex items-center">
                <ChatBubbleLeftIcon className="h-4 w-4 mr-2 text-accent" />
                Your Message
              </label>
              <textarea
                value={inquiry.message}
                onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                placeholder="Your Message"
                rows={5}
                required
                className="w-full p-3 border border-dark/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary text-light rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
            >
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}