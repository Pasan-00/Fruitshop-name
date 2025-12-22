import React from 'react'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { computePricePer100g, formatCurrency, getStockLabel } from '../utils/units'

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
}

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart()

  const total = items.reduce((s, it) => {
    const price = Number(it.total ?? it.price ?? 0)
    return s + (price * (it.qty || 1))
  }, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
        <p className="text-center text-gray-600 mb-8">Items you added to your cart will appear here.</p>

        {items.length === 0 ? (
          <div className="bg-white rounded shadow p-6">
            <p className="text-gray-500">Your cart is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {items.map(item => (
              <div key={item._id} className="flex items-center bg-white p-4 rounded shadow">
                <img src={decodeBase64(item.image) || '/path-to-placeholder-image'} alt={item.foodname} className="w-24 h-24 object-cover rounded mr-4" />
                <div className="flex-1">
                  <h2 className="font-semibold">{item.foodname}</h2>
                  <p className="text-sm text-gray-600">{(() => {
                    const amount = item.unitAmount ?? (item.unitValue ? parseFloat(String(item.unitValue)) : null)
                    const unit = item.unitUnit ?? (item.unitValue ? String(item.unitValue).replace(/^[0-9\s\.]+/, '').trim() : (item.unitType === 'pieces' ? 'piece' : 'g'))
                    const unitLabel = amount != null ? `${amount}${unit}` : (item.unitValue || (item.unitType === 'pieces' ? '1 piece' : '100g'))
                    const normalized = computePricePer100g(amount, unit, item.total ?? item.price)
                    return (
                      <>
                        {`Rs. ${item.total ?? item.price} / ${unitLabel}`}
                        {normalized != null && (
                          <div className="text-xs text-gray-500">(~Rs. {formatCurrency(normalized)} / 100g)</div>
                        )}
                      </>
                    )
                  })()}</p>
                  <p className="text-sm text-gray-500">{getStockLabel(item)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => updateQuantity(item._id, Math.max(1, (item.qty || 1) - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
                    <span className="px-3">{item.qty || 1}</span>
                    <button onClick={() => updateQuantity(item._id, (item.qty || 1) + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Rs. {(Number(item.total ?? item.price) * (item.qty || 1)).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item._id)} className="mt-2 text-sm text-red-600">Remove</button>
                </div>
              </div>
            ))}

            <div className="bg-white p-4 rounded shadow flex items-center justify-between">
              <div>
                <button onClick={clearCart} className="px-4 py-2 bg-red-600 text-white rounded">Clear Cart</button>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">Total: Rs. {total.toFixed(2)}</p>
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Checkout</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Cart
