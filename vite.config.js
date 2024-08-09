import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "src/icons/**/*", dest: "icons" },
        { src: "src/manifest.json", dest: "" },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: "src/content.jsx",
      },
      output: {
        entryFileNames: "content.js",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
