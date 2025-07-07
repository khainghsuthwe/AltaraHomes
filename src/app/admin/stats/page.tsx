'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminStats, getUser } from '@/lib/api';
import type { AdminStats } from '@/types/types'; // Use type-only import
import { ChartBarIcon } from '@heroicons/react/24/outline';

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchStats() {
      try {
        const userResponse = await getUser();
        if (userResponse.data.user_type !== 'admin') {
          router.push('/');
          return;
        }
        const response = await getAdminStats();
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load stats. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [router]);

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard - Statistics</h1>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Total Users</h2>
                <p className="text-2xl">{stats.total_users}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Total Properties</h2>
                <p className="text-2xl">{stats.total_properties}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">Total Inquiries</h2>
                <p className="text-2xl">{stats.total_inquiries}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}