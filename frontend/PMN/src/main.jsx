import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Devolucion from './pages/devolucion.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Devolucion />
  </StrictMode>,
)
