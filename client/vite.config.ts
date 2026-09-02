import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // The BFF lives on :4000; the client talks to /graphql like it is local.
      '/graphql': 'http://localhost:4000',
    },
  },
});