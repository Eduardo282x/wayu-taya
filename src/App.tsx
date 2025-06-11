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
import Home from './pages/home/Home'
import { EventForm } from './pages/documents/events/EventForm'
import { Toaster } from 'react-hot-toast';
import { Users } from './pages/users/Users';

import "@/styles/people.css";
import "@/styles/user.css";
import { Inventory } from './pages/health/inventory/inventory'
import { Medicine } from './pages/health/medicine/Medicine'


function App() {

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />}></Route>

          <Route path='/' element={<Home />}></Route>

          <Route element={<Layout />}>
            <Route path='/documentos' element={<Documents />}></Route>
            <Route path='/documentos/personas' element={<People />}></Route>
            <Route path='/documentos/comunidades' element={<Communities />}></Route>
            <Route path='/documentos/actividades' element={<Activities />}></Route>
            <Route path='/documentos/eventos' element={<Events />}></Route>
            <Route path='/documentos/eventos/formulario' element={<EventForm />}></Route>
            <Route path='/documentos/documentos' element={<Doc />}></Route>
            <Route path='/usuarios' element={<Users />}></Route>

            <Route path='/salud/inventario' element={<Inventory />}></Route>
            <Route path='/salud/medicamentos' element={<Medicine />}></Route>

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
