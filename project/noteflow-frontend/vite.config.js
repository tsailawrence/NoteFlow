import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: process.env.FRONTEND_EXPOSE_PORT,
      https: {
        key: './server.key',
        cert: './server.cert',
      },
      hmr: false,
    },
  });
};
