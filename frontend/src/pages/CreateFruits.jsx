import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MNavbar from '../components/MNavbar';
import { Plus, Upload, Package, DollarSign, Percent, Image as ImageIcon } from 'lucide-react';

const CreateFruits = () => {
  const [foodname, setFoodname] = useState('');
  //const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [unitType, setUnitType] = useState('weight');
  const [unitAmount, setUnitAmount] = useState(100);
  const [unitUnit, setUnitUnit] = useState('g');
  const [stockUnits, setStockUnits] = useState(0);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [discount, setDiscount] = useState('');
  const [total, setTotal] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    const calculateTotal = () => {
      const priceValue = parseFloat(price) || 0;
      const discountValue = parseFloat(discount) || 0;
      const discountedPrice = priceValue - (priceValue * discountValue) / 100;
      setTotal(discountedPrice.toFixed(2));
    };

    calculateTotal();
  }, [price, discount]);

  const handleSaveFruit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let base64Image = null;
      if (image) {
        base64Image = await convertToBase64(image);
      }

      const unitLabel = `${unitAmount}${unitUnit}`;
      const data = {
        foodname,
        // quantity: quantity || unitLabel,
        price,
        unitType,
        unitAmount: Number(unitAmount),
        unitUnit,
        stockUnits: Number(stockUnits || 0),
        image: base64Image,
        discount,
        total,
      };

      await axios.post('http://localhost:5555/fruits', data);
      navigate('/manager/overview');
    } catch (error) {
      alert('An error happened. Please check console.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <MNavbar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Add New Product</h1>
            <p className="text-gray-600">Create a new product listing for your store</p>
          </div>

          {loading && <Spinner />}

          <form onSubmit={handleSaveFruit} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column */}
              <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Basic Information
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="foodname">
                      Product Name *
                    </label>
                    <input
                      id="foodname"
                      type="text"
                      value={foodname}
                      onChange={(e) => setFoodname(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="quantity">
                      Quantity / Description *
                    </label>
                    <input
                      id="quantity"
                      type="text"
                      placeholder="e.g. 500g, 1kg, 1 piece pack"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="unitType">
                      Unit Type *
                    </label>
                    <select
                      id="unitType"
                      value={unitType}
                      onChange={(e) => {
                        const v = e.target.value;
                        setUnitType(v);
                        if (v === 'weight') {
                          setUnitAmount(100);
                          setUnitUnit('g');
                        } else {
                          setUnitAmount(1);
                          setUnitUnit('piece');
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="weight">Weight (price per weight unit)</option>
                      <option value="pieces">Pieces (price per piece)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="unitAmount">
                        Unit Amount *
                      </label>
                      <input
                        id="unitAmount"
                        type="number"
                        value={unitAmount}
                        onChange={(e) => setUnitAmount(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="unitUnit">
                        Unit *
                      </label>
                      <select
                        id="unitUnit"
                        value={unitUnit}
                        onChange={(e) => setUnitUnit(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      >
                        {unitType === 'weight' ? (
                          <>
                            <option value="g">g</option>
                            <option value="kg">kg</option>
                          </>
                        ) : (
                          <>
                            <option value="piece">piece</option>
                            <option value="pack">pack</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" htmlFor="price">
                      <DollarSign className="w-4 h-4" />
                      Price (for the selected unit) *
                    </label>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="stockUnits">
                      Stock (number of units)
                    </label>
                    <input
                      id="stockUnits"
                      type="number"
                      value={stockUnits}
                      onChange={(e) => setStockUnits(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Media & Pricing
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
                    {imagePreview && (
                      <div className="mb-4 relative group">
                        <img
                          className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                          src={imagePreview}
                          alt="Preview"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition-all flex items-center justify-center">
                          <p className="text-white opacity-0 group-hover:opacity-100 font-semibold">Image Preview</p>
                        </div>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        id="image"
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <label
                        htmlFor="image"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer"
                      >
                        <Upload className="w-5 h-5 text-gray-500" />
                        <span className="text-gray-600 font-medium">
                          {image ? image.name : 'Upload product image'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2" htmlFor="discount">
                      <Percent className="w-4 h-4" />
                      Discount (%)
                    </label>
                    <input
                      id="discount"
                      type="number"
                      step="0.01"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="total">
                      Final Price (After Discount)
                    </label>
                    <input
                      id="total"
                      type="text"
                      value={total}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 font-semibold"
                    />
                  </div>

                  {discount && parseFloat(discount) > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">Savings:</span> Rs. {(parseFloat(price) - parseFloat(total)).toFixed(2)} ({discount}% off)
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-xs text-blue-800 mb-2 font-semibold">Quick Tips:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Use high-quality images for better presentation</li>
                      <li>• Set accurate stock levels to avoid overselling</li>
                      <li>• Discounts are optional but can boost sales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/manager/overview')}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFruits;