import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';


// below is what is initially input - updated code reflected since line 23
// https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   plugins: [
//     react(),
//     eslint({
//       lintOnStart: true,
//       failOnError: mode === "production"
//     })
//   ],
//   // To automatically open the app in the browser whenever the server starts,
//   // uncomment the following lines:
//   // server: {
//   //   open: true
//   // }
// }));

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    },
  }
}));
