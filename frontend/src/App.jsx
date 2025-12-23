import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import HeaderBar from './components/HeaderBar'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import Discount from './pages/Discount'
import Cart from './pages/Cart'
import CreateFruits from './pages/CreateFruits'
import ShowFruits from './pages/ShowFruits'
import EditFruits from './pages/EditFruits'
import DeleteFruits from './pages/DeleteFruits'
import ManagerLogin from './pages/ManagerLogin'
import Overview from './pages/Overview'

const AppContent = () => {
  const location = useLocation();
  
  // Define admin routes that shouldn't show HeaderBar
  const isAdminRoute = location.pathname.startsWith('/manager') || 
                       location.pathname.startsWith('/fruits/create') || 
                       location.pathname.startsWith('/fruits/edit') ||
                       location.pathname.startsWith('/fruits/delete');

  return (
    <>
      {/* Show HeaderBar only on customer pages */}
      {!isAdminRoute && <HeaderBar />}
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/fruits/create' element={<CreateFruits/>}/>
        <Route path='/fruits/details/:id' element={<ShowFruits/>}/>
        <Route path='/fruits/edit/:id' element={<EditFruits/>}/>
        <Route path='/fruits/delete/:id' element={<DeleteFruits/>}/>
        <Route path='/manager/login' element={<ManagerLogin/>}/>
        <Route path='/manager/overview' element={<Overview/>}/>
        <Route path='/discount' element={<Discount/>}/>
        <Route path='/cart' element={<Cart/>}/>
      </Routes>
    </>
  );
}

const App = () => {
  return(
    <ToastProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ToastProvider>
  );
}

export default App