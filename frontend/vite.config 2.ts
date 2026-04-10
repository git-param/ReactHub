import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
  server: {
    watch: {
      // json-server writes to these files; ignore to avoid full page reloads.
      ignored: ['**/db.json', '**/src/data/Feedback.json'],
    },
  },
})
