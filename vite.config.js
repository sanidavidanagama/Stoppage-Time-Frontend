import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
server: {
  host: true
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})