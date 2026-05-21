import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // <--- Huu mstari ni muhimu sana kwa ajili ya Render!
  build: {
    outDir: 'dist'
  }
})
