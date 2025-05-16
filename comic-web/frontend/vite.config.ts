import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite';
// import dotenv from 'dotenv';

// dotenv.config();
//import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   port: Number(process.env.VITE_PORT)
  // },
  plugins: [tailwindcss(),],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
