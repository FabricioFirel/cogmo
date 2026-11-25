/* global process */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// O proxy manda as chamadas /api para o Django, por isso o front não precisa
// saber o endereço do backend nem lidar com CORS no desenvolvimento.
// Para apontar para outra porta, crie frontend/.env.local com a linha:
//   API_PROXY_TARGET=http://127.0.0.1:8001
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const alvo = env.API_PROXY_TARGET || 'http://127.0.0.1:8000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': alvo,
      },
    },
  }
})
