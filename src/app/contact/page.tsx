'use client';

import { useState } from 'react';
import { createInquiry } from '@/lib/api';
import { InquiryRequest } from '@/types/types';

export default function Contact() {
  const [inquiry, setInquiry] = useState<InquiryRequest>({
    name: '',
    email: '',
    phone: '',
    message: '',
    property: 0, // General inquiry, no property ID
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInquiry(inquiry);
      alert('Inquiry sent successfully!');
      setInquiry({ name: '', email: '', phone: '', message: '', property: 0 });
    } catch (error) {
      console.error('Error sending inquiry:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <input
          type="text"
          value={inquiry.name}
          onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
          placeholder="Full Name"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          value={inquiry.email}
          onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          value={inquiry.phone}
          onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
          placeholder="Phone Number"
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          value={inquiry.message}
          onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
          placeholder="Your Message"
          rows={5}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}