import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { NavLink, Route, Routes } from 'react-router-dom'
import NotFound from './components/Common/NotFound'
import Home from './components/Pages/Home'
import About from './components/Pages/About'
import Navbar from './components/Common/Navbar'
// import './App.css'

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/about' element={<About/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </>
  )
}

export default App
