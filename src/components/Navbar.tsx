'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { UserCircleIcon, HeartIcon, PlusCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const isSeller = user && ['admin', 'agent'].includes(user.user_type);

  const navLinkClasses = (href: string) =>
    `block md:inline-block py-2 px-3 rounded-md transition-all duration-200 ${
      pathname === href
        ? 'text-accent bg-secondary font-semibold'
        : 'text-dark hover:text-accent hover:bg-secondary'
    }`;

  const handleNavClick = () => {
    if (window.innerWidth < 768) setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-menu')) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-light shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-accent">
          Altara Homes
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-dark hover:text-accent focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>

        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-light md:bg-transparent md:flex items-center md:space-x-6 px-4 md:px-0 py-4 md:py-0 shadow-md md:shadow-none transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
        >
          <Link href="/" className={navLinkClasses('/')} onClick={handleNavClick}>
            Home
          </Link>
          <Link href="/properties" className={navLinkClasses('/properties')} onClick={handleNavClick}>
            Properties
          </Link>
          <Link href="/about" className={navLinkClasses('/about')} onClick={handleNavClick}>
            About
          </Link>

          {!loading && user ? (
            <>
              <div className="relative group profile-menu">
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-dark hover:text-accent py-2 px-3 rounded-md"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  Profile
                  <span className="ml-1">▾</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute mt-2 left-0 md:right-0 w-48 bg-light border border-dark/30 rounded-lg shadow-lg z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-dark hover:bg-secondary"
                      onClick={handleNavClick}
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      Profile
                    </Link>
                    <Link
                      href="/favorites"
                      className="flex items-center gap-2 px-4 py-2 text-dark hover:bg-secondary"
                      onClick={handleNavClick}
                    >
                      <HeartIcon className="w-5 h-5" />
                      Favorites
                    </Link>
                    {isSeller && (
                      <Link
                        href="/create-property"
                        className="flex items-center gap-2 px-4 py-2 text-dark hover:bg-secondary"
                        onClick={handleNavClick}
                      >
                        <PlusCircleIcon className="w-5 h-5" />
                        Create Property
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  logout();
                  handleNavClick();
                }}
                className="flex items-center gap-1 text-dark hover:text-danger py-2 px-3 rounded-md"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            !loading && (
              <Link href="/login" className={navLinkClasses('/login')} onClick={handleNavClick}>
                Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}