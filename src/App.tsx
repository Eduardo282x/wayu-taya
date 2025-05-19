import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { Documents } from './pages/documents/Documents'
import { Music } from './pages/music/Music'
import { Food } from './pages/food/Food'
import { Health } from './pages/health/Health'
import { Water } from './pages/water/Water'
import { Login } from './pages/auth/login/Login'
import { Events } from './pages/documents/events/Events'
import { People } from './pages/documents/people/People'
import { Doc } from './pages/documents/doc/Doc'
import { Layout } from './pages/layout/Layout'
import { Communities } from './pages/documents/communities/Communities'
import { Activities } from './pages/documents/activities/Activities'
import  Home  from './pages/home/Home'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}></Route>

          <Route path='/' element={<Home />}></Route>

          <Route element={<Layout/>}>
            <Route path='/documentos' element={<Documents />}></Route>
            <Route path='/documentos/personas' element={<People />}></Route>
            <Route path='/documentos/comunidades' element={<Communities />}></Route>
            <Route path='/documentos/actividades' element={<Activities />}></Route>
            <Route path='/documentos/eventos' element={<Events />}></Route>
            <Route path='/documentos/documentos' element={<Doc />}></Route>

            <Route path='/musica' element={<Music />}></Route>
            <Route path='/alimentos' element={<Food />}></Route>
            <Route path='/salud' element={<Health />}></Route>
            <Route path='/agua' element={<Water />}></Route>
          </Route>
          
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
