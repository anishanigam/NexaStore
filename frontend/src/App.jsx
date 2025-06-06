import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Product from './pages/Product'
import PlaceOrder from './pages/PlaceOrder'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ScrollToTop from './components/ScrollToTop'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer/>
      <Navbar/>
      <SearchBar/>

      <ScrollToTop/>
      
      <Routes>
       <Route path='/' element = {<Home/>} />
       <Route path='/collection' element = {<Collection/>} />
       <Route path='/about' element = {<About/>} />
       <Route path='/cart' element = {<Cart/>} />
       <Route path='/contact' element = {<Contact/>} />
       <Route path='/Login' element = {<Login/>} />
       <Route path='/orders' element = {<Orders/>} />
       <Route path='/product/:productId' element = {<Product/>} />
       <Route path='/place-order' element = {<PlaceOrder/>} />
       <Route path='/verify' element = {<verify/>} />
      </Routes>

      <Footer/>

    </div>
  )
}

export default App