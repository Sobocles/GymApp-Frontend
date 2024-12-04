import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import GestorGymPro from './GestorGymPro.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GestorGymPro />
  </StrictMode>,
)
