import React, { useState } from 'react';
import { LayoutDashboard, Package, Plus, LogOut, Menu, X, TrendingUp, Apple } from 'lucide-react';

const MNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '#',
      active: true
    },
    {
      title: 'Add Product',
      icon: Plus,
      href: '/fruits/create'
    }
    // {
    //   title: 'Orders',
    //   icon: TrendingUp,
    //   href: '#'
    // }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 sm:hidden p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0 bg-gradient-to-b from-slate-900 to-gray-900 shadow-2xl`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-800">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Apple className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FruityCart</h1>
                <p className="text-xs text-gray-400">Admin Panel</p>
              </div>
            </a>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <a
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                        item.active
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                      <span>{item.title}</span>
                      {item.active && (
                        <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center font-bold text-white">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Admin User</p>
                <p className="text-xs text-gray-400">admin@fruitycart.com</p>
              </div>
            </div>

            <a
              href="#"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl font-medium transition-all duration-200 border border-red-500/20"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MNavbar;