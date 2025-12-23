import React, { useState } from 'react';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { computePricePer100g, formatCurrency, getStockLabel } from '../utils/units';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package, X, MapPin, Phone, Calendar, User, Leaf } from 'lucide-react';

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

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    mobile1: '',
    mobile2: '',
    deliveryDate: '',
    deliveryTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((s, it) => {
    const price = Number(it.total ?? it.price ?? 0);
    return s + price * (it.qty || 1);
  }, 0);

  const deliveryFee = subtotal > 0 ? (subtotal >= 10000 ? 0 : 350) : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setShowCheckoutModal(true);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      customer: {
        name: formData.customerName,
        address: formData.address,
        mobile1: formData.mobile1,
        mobile2: formData.mobile2
      },
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      items: items.map(item => ({
        productId: item._id,
        productName: item.foodname,
        quantity: item.qty || 1,
        unitPrice: Number(item.total ?? item.price),
        totalPrice: Number(item.total ?? item.price) * (item.qty || 1)
      })),
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      orderDate: new Date().toISOString()
    };

    try {
      // Replace with your actual API endpoint
      // const response = await axios.post('http://localhost:5555/orders', orderData);
      
      console.log('Order submitted:', orderData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Order placed successfully! We will contact you soon.');
      clearCart();
      setShowCheckoutModal(false);
      setFormData({
        customerName: '',
        address: '',
        mobile1: '',
        mobile2: '',
        deliveryDate: '',
        deliveryTime: ''
      });
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col pt-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShoppingCart className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Shopping Cart</h1>
          </div>
          <p className="text-center text-green-100">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 flex-1">
        {items.length === 0 ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-12 text-center border border-green-100">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start adding some fresh fruits to your cart!</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Browse Products
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const imageUrl = decodeBase64(item.image);
                const amount = item.unitAmount ?? (item.unitValue ? parseFloat(String(item.unitValue)) : null);
                const unit = item.unitUnit ?? (item.unitValue ? String(item.unitValue).replace(/^[0-9\s\.]+/, '').trim() : item.unitType === 'pieces' ? 'piece' : 'g');
                const unitLabel = amount != null ? `${amount}${unit}` : (item.unitValue || (item.unitType === 'pieces' ? '1 piece' : '100g'));
                const normalized = computePricePer100g(amount, unit, item.total ?? item.price);
                const itemPrice = Number(item.total ?? item.price);
                const itemTotal = itemPrice * (item.qty || 1);

                return (
                  <div key={item._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-green-100 hover:border-green-300">
                    <div className="flex flex-col sm:flex-row gap-4 p-5">
                      <div className="flex-shrink-0">
                        <img src={imageUrl || '/path-to-placeholder-image'} alt={item.foodname} className="w-full sm:w-32 h-32 object-cover rounded-xl" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{item.foodname}</h3>
                        
                        <div className="space-y-1 mb-4">
                          <p className="text-sm text-gray-600">Rs. {itemPrice.toFixed(2)} / {unitLabel}</p>
                          {normalized != null && (
                            <p className="text-xs text-gray-500">(~Rs. {formatCurrency(normalized)} / 100g)</p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Package className="w-3 h-3" />
                            {getStockLabel(item)}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-green-50 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item._id, Math.max(1, (item.qty || 1) - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-green-100 rounded-md transition-colors">
                              <Minus className="w-4 h-4 text-green-600" />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-800">{item.qty || 1}</span>
                            <button onClick={() => updateQuantity(item._id, (item.qty || 1) + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-green-100 rounded-md transition-colors">
                              <Plus className="w-4 h-4 text-green-600" />
                            </button>
                          </div>

                          <button onClick={() => removeFromCart(item._id)} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors">
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="text-right sm:text-left sm:ml-auto flex-shrink-0">
                        <p className="text-xl font-bold text-green-600">Rs. {itemTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button onClick={clearCart} className="w-full sm:w-auto px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-red-200">
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-green-100">
                <div className="flex items-center gap-2 mb-6">
                  <Leaf className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-semibold">
                      {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `Rs. ${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  {subtotal > 0 && subtotal < 10000 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-green-700">Add Rs. {(10000 - subtotal).toFixed(2)} more for free delivery!</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-green-100">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-2xl text-green-600">Rs. {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button onClick={handleCheckout} className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-4 pt-4 border-t border-green-100">
                  <div className="flex items-start gap-3 text-xs text-gray-500">
                    <Package className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                    <p>Secure checkout • Fast delivery • 100% fresh guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Checkout</h2>
              </div>
              <button onClick={() => setShowCheckoutModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" htmlFor="customerName">
                  <User className="w-4 h-4 text-green-600" />
                  Full Name *
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" htmlFor="address">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your complete delivery address"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" htmlFor="mobile1">
                    <Phone className="w-4 h-4 text-green-600" />
                    Primary Mobile *
                  </label>
                  <input
                    id="mobile1"
                    name="mobile1"
                    type="tel"
                    value={formData.mobile1}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="07XXXXXXXX"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" htmlFor="mobile2">
                    <Phone className="w-4 h-4 text-green-600" />
                    Secondary Mobile
                  </label>
                  <input
                    id="mobile2"
                    name="mobile2"
                    type="tel"
                    value={formData.mobile2}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="07XXXXXXXX (Optional)"
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" htmlFor="deliveryDate">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Preferred Delivery Date *
                  </label>
                  <input
                    id="deliveryDate"
                    name="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" htmlFor="deliveryTime">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Preferred Delivery Time *
                  </label>
                  <select
                    id="deliveryTime"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select time slot</option>
                    <option value="08:00-10:00">08:00 AM - 10:00 AM</option>
                    <option value="10:00-12:00">10:00 AM - 12:00 PM</option>
                    <option value="12:00-14:00">12:00 PM - 02:00 PM</option>
                    <option value="14:00-16:00">02:00 PM - 04:00 PM</option>
                    <option value="16:00-18:00">04:00 PM - 06:00 PM</option>
                    <option value="18:00-20:00">06:00 PM - 08:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Order Summary
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span className="font-semibold">{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-green-300">
                    <span>Total:</span>
                    <span className="text-green-600">Rs. {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Cart;