import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
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
    axios.delete(`http://localhost:5555/fruits/${deleteId}`)
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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <MNavbar />
      <div className='ml-96'>
        <div className="w-full md:w-1/2 lg:w-8/12 xl:w-9/12 md:pl-6">
          <div className="flex items-stretch flex-wrap -mx-3">
            {fruits.map((fruit) => {
              const imageUrl = decodeBase64(fruit.image);

              return (
                <div key={fruit._id} className="w-full xl:w-1/3 px-3 mb-2">
                  <div className="p-10 xl:px-9 xl:pt-24 xl:pb-12 bg-white rounded-3xl">
                  <a href={`/fruits/details/${fruit._id}`}>
                      <img
                        className="mb-2 xl:mb-8 mx-auto h-40 object-cover"
                        src={imageUrl || '/path-to-placeholder-image'}
                        alt={fruit.foodname}
                      />
                    </a>
                    <div className='text-center'>
                      <a href={`/fruits/details/${fruit._id}`}>
                        <p className="text-xl leading-8 font-heading font-medium hover:underline">
                          {fruit.foodname}
                        </p>
                      </a>
                      <p className="text-xl text-blue-950 font-heading font-medium tracking-tighter">
                        <span>{fruit.quantity}</span>
                        <span className="text-base pl-2">g</span>
                      </p>
                      {fruit.discount ? (
                        <p className="text-xl text-blue-950 font-heading font-medium tracking-tighter">
                          <span className="text-base pr-1">Rs.</span>
                          <span className="line-through">{fruit.price}</span>
                          <span className="pl-2">{fruit.total}</span>
                        </p>
                      ) : (
                        <p className="text-xl text-blue-950 font-heading font-medium tracking-tighter">
                          <span className="text-base pr-1">Rs.</span>
                          <span>{fruit.price}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex justify-start gap-x-4 mt-4">
                      <Link to={`/fruits/edit/${fruit._id}`}>
                        <AiOutlineEdit className="text-2xl text-yellow-600 cursor-pointer" />
                      </Link>
                      <button onClick={() => handleDelete(fruit._id)}>
                        <MdOutlineDelete className="text-2xl text-red-600 cursor-pointer ml-20" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="sm:mx-auto sm:w-96">
          <a
            href="/fruits"
            className="block py-5 px-10 w-full text-xl leading-6 text-white font-medium tracking-tighter font-heading text-center bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl"
          >
            More products
          </a>
        </div>
      </div>

      <Pop
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Overview;
