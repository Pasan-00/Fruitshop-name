import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Home, Tag, Menu, X, Apple } from 'lucide-react';

const HeaderBar = () => {
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/discount', label: 'Discounts', icon: Tag },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: itemCount }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
          : 'bg-white shadow-md py-2'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              FruityCart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:text-green-600 font-medium rounded-xl hover:bg-green-50 transition-all duration-200 group"
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse">
                      {link.badge}
                    </span>
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col gap-2 pb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-green-600 font-medium rounded-xl hover:bg-green-50 transition-all duration-200"
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="ml-auto flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;