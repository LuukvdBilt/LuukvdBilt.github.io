import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/LuukPokemonFE.github.io/', // <- dit zorgt dat alle assets correct geladen worden
})

