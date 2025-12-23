import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Package, DollarSign, Tag } from 'lucide-react';
import MNavbar from '../components/MNavbar';
import Pop from '../components/Pop';

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

const Overview = () => {
  const [fruits, setFruits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/fruits')
      .then((response) => {
        setFruits(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:5555/fruits/${deleteId}`)
      .then(() => {
        setFruits(fruits.filter((fruit) => fruit._id !== deleteId));
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error deleting fruit:', error);
        setShowModal(false);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <MNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <MNavbar />
      
      <div className="ml-64 p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Product Overview</h1>
              <p className="text-gray-600">Manage your product inventory</p>
            </div>
            <Link
              to="/fruits/create"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="text-3xl font-bold text-gray-800">{fruits.length}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Stock</p>
                  <p className="text-3xl font-bold text-green-600">
                    {fruits.filter(f => (f.stockUnits || 0) > 0).length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">On Discount</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {fruits.filter(f => f.discount).length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Tag className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fruits.map((fruit) => {
            const imageUrl = decodeBase64(fruit.image);
            const isOutOfStock = (fruit.stockUnits || 0) <= 0;

            return (
              <div
                key={fruit._id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
              >
                <Link to={`/fruits/details/${fruit._id}`} className="block relative overflow-hidden">
                  <img
                    className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={imageUrl || '/path-to-placeholder-image'}
                    alt={fruit.foodname}
                  />
                  {fruit.discount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {fruit.discount}% OFF
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute top-3 left-3 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Out of Stock
                    </div>
                  )}
                </Link>

                <div className="p-5">
                  <Link to={`/fruits/details/${fruit._id}`}>
                    <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                      {fruit.foodname}
                    </h3>
                  </Link>

                  {/* <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Package className="w-4 h-4" />
                    <span>{fruit.quantity}</span>
                  </div> */}

                  <div className="mb-4">
                    {fruit.discount ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-green-600">Rs. {fruit.total}</span>
                        <span className="text-sm text-gray-400 line-through">Rs. {fruit.price}</span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-gray-800">Rs. {fruit.price}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/fruits/edit/${fruit._id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(fruit._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {fruits.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">Start by adding your first product</p>
            <Link
              to="/fruits/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </Link>
          </div>
        )}
      </div>

      <Pop isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={confirmDelete} />
    </div>
  );
};

export default Overview;