import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import { computePricePer100g, formatCurrency, getUnitInfo, getStockLabel } from '../utils/units'

const ShowFruits= () => {
  const[fruit, setFruit] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/fruits/${id}`)
      .then((response) => {
          setFruit(response.data);
          setLoading(false);
        }
      )
      .catch((error) => {
        console.log(error);
        setLoading(false)
      });
  }, [])
  return(
    <div className='p-4'>
      <BackButton/>
      <h1 className='text-3xl my-4'>Show Food</h1>
      {loading ? (
        <Spinner/>
      ) : (
        <div className='flex-col border-2 border-sky-400 rounded-xl w-fit p-4'>
          <div className='my-4'> 
            <span className='text-xl mr-4 text-gray-500'>Id</span>
            <span>{fruit._id}</span>
          </div>
          <div className='my-4'> 
            <span className='text-xl mr-4 text-gray-500'>Food Name</span>
            <span>{fruit.foodname}</span>
          </div>
          <div className='my-4'> 
            <span className='text-xl mr-4 text-gray-500'>Quantity</span>
            <span>{getStockLabel(fruit)}</span>
          </div>
          <div className='my-4'> 
            <span className='text-xl mr-4 text-gray-500'>Price (per unit)</span>
            <span>
              {(() => {
                const amount = fruit.unitAmount ?? (fruit.unitValue ? parseFloat(String(fruit.unitValue)) : null)
                const unit = fruit.unitUnit ?? (fruit.unitValue ? String(fruit.unitValue).replace(/^[0-9\s\.]+/, '').trim() : (fruit.unitType === 'pieces' ? 'piece' : 'g'))
                const unitLabel = amount != null ? `${amount}${unit}` : (fruit.unitValue || (fruit.unitType === 'pieces' ? '1 piece' : '100g'))
                const normalized = computePricePer100g(amount, unit, fruit.price)
                return (
                  <>
                    {`Rs. ${fruit.price} / ${unitLabel}`}
                    {normalized != null && (
                      <div className="text-xs text-gray-500">(~Rs. {formatCurrency(normalized)} / 100g)</div>
                    )}
                  </>
                )
              })()}
            </span>
          </div>
          {fruit.discount ? (
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Discounted Price</span>
              <span>
                {(() => {
                  const amount = fruit.unitAmount ?? (fruit.unitValue ? parseFloat(String(fruit.unitValue)) : null)
                  const unit = fruit.unitUnit ?? (fruit.unitValue ? String(fruit.unitValue).replace(/^[0-9\s\.]+/, '').trim() : (fruit.unitType === 'pieces' ? 'piece' : 'g'))
                  const unitLabel = amount != null ? `${amount}${unit}` : (fruit.unitValue || (fruit.unitType === 'pieces' ? '1 piece' : '100g'))
                  return `Rs. ${fruit.total} / ${unitLabel}`
                })()}
              </span>
            </div>
          ) : null}
          <div className='my-4'> 
            <span className='text-xl mr-4 text-gray-500'>Create Time</span>
            <span>{fruit.createdAt ? new Date(fruit.createdAt).toString() : ''}</span>
          </div>
          <div className='my-4'> 
            <span className='text-xl mr-4 text-gray-500'>Last Update Time</span>
            <span>{fruit.updatedAt ? new Date(fruit.updatedAt).toString() : ''}</span>
          </div>
        </div>
      )}
      </div>

  )
}

export default ShowFruits
