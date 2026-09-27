import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { queryClient } from './lib/queryClient.ts'
import { registerAuthInterceptors } from './services/interceptors.tsx'
import { purgeLegacyTokenStorage } from './services/auth/tokenStorage.ts'

// Antes de montar React, para que no exista ninguna peticion sin la cabecera
// Authorization.
registerAuthInterceptors()

// El store dejo de usar `persist`, pero una sesion vieja puede seguir en
// localStorage si el usuario no limpio el navegador. Se borra aqui y no dentro
// de `hydrate()`: si la app abre en `/login` la hidratacion nunca corre y los
// tokens antigos se quedarian en disco.
purgeLegacyTokenStorage()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
