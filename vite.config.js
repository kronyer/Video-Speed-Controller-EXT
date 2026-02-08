// Vite config para build separado de content e popup
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";

const isContent = process.env.BUILD_TARGET === "content";
const isPopup = process.env.BUILD_TARGET === "popup";

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
      input: isContent
        ? { content: "src/content.jsx" }
        : isPopup
        ? { popup: "src/popup.main.jsx" }
        : {},
      output: isContent
        ? {
            entryFileNames: "content.js",
            format: "iife",
            name: "ContentScript",
          }
        : isPopup
        ? {
            entryFileNames: "popup.js",
            format: "es",
          }
        : {},
    },
    outDir: "dist",
    emptyOutDir: isContent, // Só limpa ao buildar content
  },
});
