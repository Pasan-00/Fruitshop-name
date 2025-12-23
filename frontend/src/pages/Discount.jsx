import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { computePricePer100g, formatCurrency, getUnitInfo, getStockLabel } from '../utils/units';
import { FiShoppingCart, FiPackage, FiTag, FiTrendingDown } from 'react-icons/fi';
import { GiSparkles } from 'react-icons/gi';

const decodeBase64 = (base64String) => {
  try {
    const base64Data = base64String?.startsWith('data:image/')
      ? base64String.replace(/^data:image\/(png|jpg|jpeg|gif);base64,/, '')
      : base64String || '';

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

const Discount = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/fruits')
      .then((res) => {
        const all = res.data?.data || [];
        const discounted = all.filter((p) => p.discount);
        setProducts(discounted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 px-4">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <GiSparkles className="w-5 h-5" />
            <span className="font-semibold">Limited Time Offers</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Amazing Discounts</h1>
          <p className="text-xl text-white/90 mb-6">Save big on fresh, quality products</p>
          <div className="flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FiTag className="w-4 h-4" />
              <span>Up to 50% Off</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <FiTrendingDown className="w-4 h-4" />
              <span>Best Deals</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Special Offers</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 rounded"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading discounted products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Active Discounts</h3>
            <p className="text-gray-600 mb-6">Check back soon for exciting offers!</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const imageUrl = decodeBase64(product.image);
              const { amount, unit, label: unitLabel } = getUnitInfo(product);
              const isOutOfStock = (product.stockUnits || 0) <= 0;
              const savings = ((product.price - product.total) / product.price * 100).toFixed(0);

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200"
                >
                  <Link to={`/fruits/details/${product._id}`} className="block relative overflow-hidden">
                    <img
                      className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={imageUrl || '/path-to-placeholder-image'}
                      alt={product.foodname}
                    />
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <FiTag className="w-3 h-3" />
                      {savings}% OFF
                    </div>
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </Link>

                  <div className="p-5">
                    <Link to={`/fruits/details/${product._id}`}>
                      <h3 className="text-lg font-bold text-gray-800 hover:text-orange-600 transition-colors mb-2 line-clamp-2">
                        {product.foodname}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-3">
                      <FiPackage className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-500">{getStockLabel(product)}</p>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-3 mb-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-orange-600">Rs. {product.total}</span>
                        <span className="text-sm text-gray-400 line-through">Rs. {product.price}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">per {unitLabel}</p>
                      {computePricePer100g(amount, unit, product.total) != null && (
                        <p className="text-xs text-gray-500">
                          ~Rs. {formatCurrency(computePricePer100g(amount, unit, product.total))} / 100g
                        </p>
                      )}
                      <p className="text-xs font-semibold text-green-600 mt-2">
                        You save Rs. {(product.price - product.total).toFixed(2)}
                      </p>
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
                          : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      }`}
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Discount;