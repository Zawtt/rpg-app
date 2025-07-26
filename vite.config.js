import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Define o caminho base para o seu aplicativo quando ele for implantado.
  // Para GitHub Pages, deve ser o nome do seu repositório.
  // Exemplo: se seu repositório é 'rpg-app', use '/rpg-app/'.
  base: '/rpg-app/', // <-- Adicione ou modifique esta linha com o nome do seu repositório

  plugins: [react()],
});
