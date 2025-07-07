'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminUsers, getUser } from '@/lib/api';
import { User } from '@/types/types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userResponse = await getUser();
        if (userResponse.data.user_type !== 'admin') {
          router.push('/');
          return;
        }
        const response = await getAdminUsers();
        const users = response.data.results 
          ? response.data.results 
          : Array.isArray(response.data.data) 
            ? response.data.data 
            : [response.data.data].filter((item): item is User => item !== undefined);
        setUsers(users);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [router]);

  if (loading) return <p className="text-center py-16">Loading...</p>;
  if (error) return <p className="text-center py-16 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Admin - Manage Users</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">User Type</th>
              <th className="p-4 text-left">Name</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.username}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.user_type}</td>
                <td className="p-4">{user.first_name} {user.last_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}