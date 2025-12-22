import React from 'react';
import { Mail, Send, Facebook, Twitter, Linkedin, Instagram, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Top Section - CTA */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-bold mb-2">Ready to Start Shopping?</h3>
              <p className="text-green-100">Get fresh fruits delivered to your doorstep</p>
            </div>
            <a
              href="/products"
              className="group relative px-8 py-4 bg-white text-green-600 font-bold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="relative z-10">Shop Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              <span className="relative z-10 opacity-0 group-hover:opacity-100 text-white transition-opacity">Shop Now</span>
            </a>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🍎</span>
                </div>
                <h3 className="text-2xl font-bold">FruityCart</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Your trusted source for fresh, quality fruits delivered straight to your home. Experience freshness like never before.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-green-600 hover:to-emerald-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-lg font-bold mb-6 text-white">Quick Links</h5>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="text-gray-400 hover:text-green-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-green-500 group-hover:w-4 transition-all duration-200"></span>
                    Home
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-gray-400 hover:text-green-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-green-500 group-hover:w-4 transition-all duration-200"></span>
                    Products
                  </a>
                </li>
                <li>
                  <a href="/discount" className="text-gray-400 hover:text-green-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-green-500 group-hover:w-4 transition-all duration-200"></span>
                    Discounts
                  </a>
                </li>
                <li>
                  <a href="/cart" className="text-gray-400 hover:text-green-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-green-500 group-hover:w-4 transition-all duration-200"></span>
                    Cart
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h5 className="text-lg font-bold mb-6 text-white">Customer Service</h5>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-green-500 group-hover:w-4 transition-all duration-200"></span>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-green-500 group-hover:w-4 transition-all duration-200"></span>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-green-500 group-hover:w-4 transition-all duration-200"></span>
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-500 transition-colors duration-200 flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-green-500 group-hover:w-4 transition-all duration-200"></span>
                    Shipping Info
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="text-lg font-bold mb-6 text-white">Stay Updated</h5>
              <p className="text-gray-400 mb-4 text-sm">Subscribe to get special offers and updates</p>
              <form className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Send className="w-4 h-4" />
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
                <a href="#" className="hover:text-green-500 transition-colors">
                  Terms & Conditions
                </a>
                <span className="text-gray-700">|</span>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Privacy Policy
                </a>
                <span className="text-gray-700">|</span>
                <a href="#" className="hover:text-green-500 transition-colors">
                  Cookie Policy
                </a>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span>© 2024 FruityCart. All rights reserved.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;