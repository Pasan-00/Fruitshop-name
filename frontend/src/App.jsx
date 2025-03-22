import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateFruits from './pages/CreateFruits'
import ShowFruits from './pages/ShowFruits'
import EditFruits from './pages/EditFruits'
import DeleteFruits from './pages/DeleteFruits'
import ManagerLogin from './pages/ManagerLogin'
import Overview from './pages/Overview'



const App = () => {
  return(
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/fruits/create' element={<CreateFruits/>}/>
      <Route path='/fruits/details/:id' element={<ShowFruits/>}/>
      <Route path='/fruits/edit/:id' element={<EditFruits/>}/>
      <Route path='/fruits/delete/:id' element={<DeleteFruits/>}/>

      <Route path='/manager/login' element={<ManagerLogin/>}/>
      <Route path='/manager/overview' element={<Overview/>}/>
    </Routes>
    
  );
}

export default App