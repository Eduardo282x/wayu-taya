import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { Home } from './components/Home'
import { Documents } from './pages/documents/Documents'
import { Music } from './pages/music/Music'
import { Food } from './pages/food/Food'
import { Health } from './pages/health/Health'
import { Water } from './pages/water/Water'
import { Login } from './pages/auth/login/Login'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/documentos' element={<Documents></Documents>}></Route>
          <Route path='/musica' element={<Music></Music>}></Route>
          <Route path='/alimentos' element={<Food></Food>}></Route>
          <Route path='/salud' element={<Health></Health>}></Route>
          <Route path='/agua' element={<Water></Water>}></Route>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
