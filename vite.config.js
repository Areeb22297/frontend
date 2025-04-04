import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'client-error-handler',
      configureServer(server) {
        // Attach error handler to catch 'clientError' events
        server.httpServer.on('clientError', (err, socket) => {
          console.error('Client error:', err);
          // Send a basic HTTP error response and destroy the socket
          socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
          socket.destroy();
        });
      }
    }
  ],
  server: {
    port: 8080,
    https: false, // Run Vite over HTTP
    host: '0.0.0.0',
    hmr: {
      protocol: 'wss', // Use WSS for secure HMR (adjust in production)
      host: '192.168.2.249',
    },
    proxy: {
      '/api': {
        target: 'http://192.168.2.249:8000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://192.168.2.249:8000',
        ws: true,
        rewrite: (path) => path.replace(/^\/ws/, '/ws/messages'),
      }
    },
  },
});
