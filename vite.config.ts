import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'NADA Alarma Emocional',
          short_name: 'NADA Alarma',
          description:
            'Alarma de activación de energía emocional: te levanta con gratitud, frases motivadoras y un vigía anti-scroll.',
          theme_color: '#10121a',
          background_color: '#10121a',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        },
      }),
    ],
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
