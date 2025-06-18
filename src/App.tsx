import { BrowserRouter, Route, Routes } from 'react-router';

import { Music } from './pages/music/Music';
import { Food } from './pages/food/Food';
import { Water } from './pages/water/Water';

import { Login } from './pages/auth/login/Login';
import { Layout } from './pages/layout/Layout';
import Home from './pages/home/Home';

import { People } from './pages/documents/people/People';
import { Events } from './pages/documents/events/Events';
import { Documents } from './pages/documents/Documents';
// import { Doc } from './pages/documents/doc/Doc';

import { Communities } from './pages/documents/communities/Communities';
import { Activities } from './pages/documents/activities/Activities';

import { Inventory } from './pages/health/inventory/inventory';
import { Medicine } from './pages/health/medicine/Medicine';
import { Donations } from './pages/health/donations/Donations';
import { Health } from './pages/health/Health';

import { Users } from './pages/users/Users';
import { Toaster } from 'react-hot-toast';
import './App.css'
import { DocumentosTable } from './pages/documents/doc/documentos-table';
import { Store } from './pages/health/store/Store';


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
            <Route path='/documentos/documentos' element={<DocumentosTable />}></Route>
            <Route path='/documentos/eventos' element={<Events />}></Route>


            <Route path='/salud' element={<Health />}></Route>
            <Route path='/salud/donaciones' element={<Donations />}></Route>
            <Route path='/salud/inventario' element={<Inventory />}></Route>
            <Route path='/salud/medicamentos' element={<Medicine />}></Route>
            <Route path='/salud/almacenes' element={<Store />}></Route>

            <Route path='/musica' element={<Music />}></Route>
            <Route path='/alimentos' element={<Food />}></Route>
            <Route path='/agua' element={<Water />}></Route>

            <Route path='/usuarios' element={<Users />}></Route>
          </Route>

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
