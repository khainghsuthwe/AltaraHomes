'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { UserIcon, HeartIcon, ShieldCheckIcon, PhoneIcon, EnvelopeIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <p className="text-center py-16 text-dark/70">Loading...</p>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-light p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-dark mb-6">Your Profile</h2>
        {user.profile_picture && (
          <div className="flex justify-center mb-6">
            <img
              src={user.profile_picture}
              alt="Profile Picture"
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
        )}
        <div className="space-y-4">
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-accent" />
            <span>
              Name: <span className="font-semibold">{user.first_name} {user.last_name}</span>
            </span>
          </div>
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 mr-2 text-accent" />
            <span>
              Email: <span className="font-semibold">{user.email}</span>
            </span>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 mr-2 text-accent" />
            <span>
              Phone: <span className="font-semibold">{user.phone || 'Not provided'}</span>
            </span>
          </div>
          <div className="flex items-center">
            <InformationCircleIcon className="h-5 w-5 mr-2 text-accent" />
            <span>
              Bio: <span className="font-semibold">{user.bio || 'Not provided'}</span>
            </span>
          </div>
          <div className="flex items-center">
            <span>
              Role: <span className="font-semibold">{user.user_type}</span>
            </span>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/favorites"
            className="inline-flex items-center px-4 py-2 bg-primary text-light rounded-lg hover:bg-primary/90 transition-colors"
          >
            <HeartIcon className="h-5 w-5 mr-2" />
            View Favorites
          </Link>
          {(user.user_type === 'admin' || user.user_type === 'agent') && (
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-success text-light rounded-lg hover:bg-success/90 transition-colors"
            >
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}