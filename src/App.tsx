import { BrowserRouter, Route, Routes } from 'react-router';

import { Music } from './pages/music/Music';
import { Food } from './pages/food/Food';
import { Water } from './pages/water/Water';

import { Login } from './pages/auth/login/Login';
import { Layout } from './pages/layout/Layout';
import Home from './pages/home/Home';

import { People } from './pages/documents/people/People';
import { Events } from './pages/documents/events/Events';
// import { Doc } from './pages/documents/doc/Doc';

import { Activities } from './pages/documents/activities/Activities';

import { Inventory } from './pages/health/inventory/inventory';
import { Medicine } from './pages/health/medicine/Medicine';
import { Donations } from './pages/health/donations/Donations';
import { Health } from './pages/health/Health';

import { Users } from './pages/users/Users';
import { Profile } from './pages/users/profile/Profile';
import { Toaster } from 'react-hot-toast';
import './App.css'
import { Store } from './pages/health/store/Store';
import { Category } from './pages/health/category/Category';
import { ProvidersInstitutions } from './pages/documents/providers/ProvidersInstitutions';
import { useAxiosInterceptor } from './services/Interceptor';
import { Reports } from './pages/health/reports/Reports';
import { Documents } from './pages/documents/documents/Documents';

function App() {
  useAxiosInterceptor();
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
            <Route path='/documentos/actividades' element={<Activities />}></Route>
            <Route path='/documentos/documentos' element={<Documents />}></Route>
            <Route path='/documentos/eventos' element={<Events />}></Route>
            <Route path='/documentos/proveedores' element={<ProvidersInstitutions />}></Route>

            <Route path='/salud' element={<Health />}></Route>
            <Route path='/salud/donaciones' element={<Donations />}></Route>
            <Route path='/salud/reportes' element={<Reports/>}></Route>
            <Route path='/salud/eventos' element={<Events />}></Route>
            <Route path='/salud/inventario' element={<Inventory />}></Route>
            <Route path='/salud/medicamentos' element={<Medicine />}></Route>
            <Route path='/salud/almacenes' element={<Store />}></Route>
            <Route path='/salud/categorías' element={<Category />}></Route>
            <Route path='/salud/proveedores' element={<ProvidersInstitutions />}></Route>
            <Route path='/salud/instituciones' element={<ProvidersInstitutions />} />

            <Route path='/musica' element={<Music />}></Route>
            <Route path='/alimentos' element={<Food />}></Route>
            <Route path='/agua' element={<Water />}></Route>

            <Route path='/usuarios' element={<Users />}></Route>
            <Route path='/perfil' element={<Profile />}></Route>
          </Route>

        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
