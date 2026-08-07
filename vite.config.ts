import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GROQ_API_KEY': JSON.stringify(env.VITE_GROQ_API_KEY || ''),
      'import.meta.env.VITE_GROQ_MODEL': JSON.stringify(
        env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile',
      ),
    },
    server: {
      // Igual que en NADA-AMORES-Y-TRAICIONES: el navegador no puede llamar a
      // api.groq.com directo desde localhost por CORS, así que en dev lo
      // proxeamos.
      proxy: {
        '/api/groq': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/groq/, ''),
        },
      },
    },
  };
});
