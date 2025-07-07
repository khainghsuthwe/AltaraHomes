import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Footer() {
  return (
     <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4">Altara Homes</h3>
                <p className="text-gray-300">Find your dream home with our trusted real estate services.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/about" className="hover:text-blue-400">About</Link></li>
                  <li><Link href="/properties" className="hover:text-blue-400">Properties</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-400">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    <a href="mailto:info@altarahomes.com" className="hover:text-blue-400">info@altarahomes.com</a>
                  </li>
                  <li className="flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    <a href="tel:+1234567890" className="hover:text-blue-400">+1 (234) 567-890</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center border-t border-gray-700 pt-4">
              <p>© {new Date().getFullYear()} Altara Homes. All rights reserved.</p>
            </div>
          </div>
        </footer>
  );
}