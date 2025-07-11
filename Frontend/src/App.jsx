import { Route, Routes } from 'react-router-dom'
import NotFound from './components/Common/NotFound'
import Home from './components/Pages/Home'
import About from './components/Pages/About'
import Navbar from './components/Common/Navbar'

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
