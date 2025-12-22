import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch (e) {
      // ignore
    }
  }, [items])

  const addToCart = (product) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i._id === product._id)
      if (idx > -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: (next[idx].qty || 1) + 1 }
        return next
      }
      return [{ ...product, qty: 1 }, ...prev]
    })
  }

  const removeFromCart = (id) => {
    // restore stock on server for the removed item
    setItems(prev => {
      const item = prev.find(i => i._id === id)
      if (item) {
        const qty = item.qty || 1
        axios.post(`http://localhost:5555/fruits/${id}/increment`, { qty }).catch(() => {})
      }
      return prev.filter(i => i._id !== id)
    })
  }

  const updateQuantity = (id, qty) => {
    setItems(prev => prev.map(i => i._id === id ? { ...i, qty: qty } : i))
  }

  const clearCart = () => {
    // restore stock for all items
    items.forEach(item => {
      const qty = item.qty || 1
      axios.post(`http://localhost:5555/fruits/${item._id}/increment`, { qty }).catch(() => {})
    })
    setItems([])
  }


  const itemCount = items.reduce((s, it) => s + (it.qty || 0), 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

export default CartContext
