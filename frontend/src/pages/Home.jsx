import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer'; // Assuming Footer component exists

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

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/fruits') // Update with the correct backend API endpoint
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Our Fruit Store!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const imageUrl = decodeBase64(product.image);

            return (
              <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden">
                <a href={`/products/${product._id}`}>
                  <img
                    className="h-48 w-full object-cover"
                    src={imageUrl || '/path-to-placeholder-image'}
                    alt={product.foodname}
                  />
                </a>
                <div className="p-4">
                  <a href={`/products/${product._id}`}>
                    <h2 className="text-lg font-bold hover:underline">{product.foodname}</h2>
                  </a>
                  <p className="mt-2 text-gray-600">
                    <span>{product.quantity}g</span>
                  </p>
                  <p className="mt-2 text-blue-700 font-semibold">
                    Rs. {product.discount ? (
                      <>
                        <span className="line-through">{product.price}</span> <span>{product.total}</span>
                      </>
                    ) : (
                      product.price
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <a
            href="/products"
            className="py-3 px-6 text-lg text-white font-medium bg-blue-500 hover:bg-blue-600 rounded-lg"
          >
            View More Products
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
