import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import Head from '../components/Head';
import { useCart } from '../context/CartContext';
import { computePricePer100g, formatCurrency, getUnitInfo, getStockLabel } from '../utils/units';
import { useToast } from '../context/ToastContext';
import { ShoppingCart, TrendingUp, Package } from 'lucide-react';

const decodeBase64 = (base64String) => {
  try {
    const base64Data = base64String.startsWith('data:image/')
      ? base64String.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '')
      : base64String;

    const binaryString = window.atob(base64Data);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);

    for (let i = 0; i < binaryLen; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to decode base64 string:', error);
    return '';
  }
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/fruits')
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading fresh products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 px-4">
        <div className="container mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="src/assets/logo.png"
              alt="Fruity Cart Logo"
              className="w-20 h-20 object-contain"
            />
            {/* <span className="text-2xl font-bold hidden sm:block">
              Fruity Cart
            </span> */}
          </div>

          {/* Center Content */}
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Fruity Cart
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Book now and Pickup Your Farm-fresh quality Fruits
            </p>

            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span>Fresh Fruits</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Best Prices</span>
              </div>
            </div>
          </div>

        </div>
      </div>


      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Products</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageUrl = decodeBase64(product.image);
            const { amount, unit, label: unitLabel } = getUnitInfo(product);
            const isOutOfStock = (product.stockUnits || 0) <= 0;

            return (
              <div
                key={product._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200"
              >
                <a href={`/products/${product._id}`} className="block relative overflow-hidden">
                  <img
                    className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={imageUrl || '/path-to-placeholder-image'}
                    alt={product.foodname}
                  />
                  {product.discount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      Sale
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold">Out of Stock</span>
                    </div>
                  )}
                </a>

                <div className="p-5">
                  <a href={`/products/${product._id}`}>
                    <h3 className="text-lg font-bold text-gray-800 hover:text-green-600 transition-colors mb-2 line-clamp-2">
                      {product.foodname}
                    </h3>
                  </a>

                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">{getStockLabel(product)}</p>
                  </div>

                  <div className="mb-4">
                    {product.discount ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">Rs. {product.total}</span>
                          <span className="text-sm text-gray-400 line-through">Rs. {product.price}</span>
                        </div>
                        <p className="text-xs text-gray-500">per {unitLabel}</p>
                        {computePricePer100g(amount, unit, product.total) != null && (
                          <p className="text-xs text-gray-400">
                            ~Rs. {formatCurrency(computePricePer100g(amount, unit, product.total))} / 100g
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-800">Rs. {product.price}</span>
                        </div>
                        <p className="text-xs text-gray-500">per {unitLabel}</p>
                        {computePricePer100g(amount, unit, product.price) != null && (
                          <p className="text-xs text-gray-400">
                            ~Rs. {formatCurrency(computePricePer100g(amount, unit, product.price))} / 100g
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    disabled={isOutOfStock}
                    onClick={async () => {
                      try {
                        await axios.post(`http://localhost:5555/fruits/${product._id}/decrement`, { qty: 1 });
                        setProducts((prev) =>
                          prev.map((p) =>
                            p._id === product._id ? { ...p, stockUnits: (p.stockUnits || 0) - 1 } : p
                          )
                        );
                        addToCart(product);
                        showToast(`${product.foodname} added to cart`, 'success');
                      } catch (err) {
                        console.error('Add to cart failed:', err);
                        showToast(err?.response?.data?.message || 'Unable to add to cart', 'error');
                      }
                    }}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isOutOfStock
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* <div className="mt-16 text-center">
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            View All Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div> */}
      </div>

      <Footer />
    </div>
  );
};

export default Home;