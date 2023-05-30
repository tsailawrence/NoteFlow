import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
    VITE_AVAI_CSS: JSON.stringify(findCss()),
  };

  return defineConfig({
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: process.env.FRONTEND_EXPOSE_PORT,
      hmr: false,
    },
    build: {
      manifest: true,
      rollupOptions: {
        input: '/index.html',
      },
    },
  });
};

const findCss = () => {
  const available = [];

  const files = fs.readdirSync(
    path.join(process.cwd(), 'node_modules', 'highlight.js', 'styles'),
  );

  for (let i = 0; i < files.length; i += 1) {
    if (/.css/.test(files[i])) {
      available.push(files[i].split('.')[0]);
    }
  }

  return available;
};
