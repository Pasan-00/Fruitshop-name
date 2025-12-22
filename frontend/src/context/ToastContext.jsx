import React, { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', timeout = 3000) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, type }
    setToasts((t) => [...t, toast])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, timeout)
  }, [])

  const removeToast = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-xs px-4 py-2 rounded shadow text-sm text-white ${t.type === 'error' ? 'bg-red-600' : t.type === 'success' ? 'bg-green-600' : 'bg-gray-800'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastContext
