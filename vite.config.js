import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const pages = [
  'index', 'connexion', 'inscription', 'mot-de-passe-oublie',
  'etudiant', 'employe', 'gerant', 'admin',
];

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(pages.map(page => [
        page, resolve(process.cwd(), `${page}.html`),
      ])),
    },
  },
  server: { port: 5173, allowedHosts: ['terminal.local'] },
});
