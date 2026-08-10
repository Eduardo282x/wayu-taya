import { BrowserRouter, Route, Routes } from 'react-router';

import { Music } from './pages/music/Music';
import { Food } from './pages/food/Food';
import { Water } from './pages/water/Water';

import { Login } from './pages/auth/login/Login';
import { Layout } from './layout/Layout';
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
import { ProvidersInstitutions } from './pages/documents/providers/ProvidersInstitutions';
import { useAxiosInterceptor } from './services/Interceptor';
import { Reports } from './pages/health/reports/Reports';
import { Documents } from './pages/documents/documents/Documents';
import { ProtectedRouter } from './layout/ProtectedRouter';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  useAxiosInterceptor();
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
          <Route path='/login' element={<Login />}></Route>
          <Route element={<ProtectedRouter />}>
            <Route path='/' element={<Home />}></Route>

            <Route element={<Layout />}>
              <Route path='documentos'>
                <Route index element={<Documents />} />
                <Route path='personas' element={<People />} />
                <Route path='actividades' element={<Activities />} />
                <Route path='documentos' element={<Documents />} />
                <Route path='eventos' element={<Events />} />
                <Route path='proveedores' element={<ProvidersInstitutions />} />
              </Route>

              <Route path='salud'>
                <Route index element={<Health />} />
                <Route path='donaciones' element={<Donations />} />
                <Route path='reportes' element={<Reports />} />
                <Route path='eventos' element={<Events />} />
                <Route path='inventario' element={<Inventory />} />
                <Route path='medicamentos' element={<Medicine />} />
                <Route path='almacenes' element={<Store />} />
                <Route path='proveedores' element={<ProvidersInstitutions />} />
                <Route path='instituciones' element={<ProvidersInstitutions />} />
              </Route>

              <Route path='musica' element={<Music />}></Route>
              <Route path='alimentos' element={<Food />}></Route>
              <Route path='agua' element={<Water />}></Route>

              <Route path='usuarios' element={<Users />}></Route>
              <Route path='perfil' element={<Profile />}></Route>
            </Route>
          </Route>

          </Routes>
        </ErrorBoundary>
      </BrowserRouter>

    </>
  )
}

export default App
