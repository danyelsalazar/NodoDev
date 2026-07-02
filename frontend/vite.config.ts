import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// SECCION: Configuracion limpia de Vite sin plugins de estilos externos
export default defineConfig({
  plugins: [react()],
})
