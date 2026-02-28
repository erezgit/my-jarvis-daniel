import path from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import createHtmlPlugin from "vite-plugin-simple-html";

/**
 * Vite config for SQLite mode.
 * Proxies /api/* requests to the Express API server on port 3001.
 * Uses the SQLite entry point (src/main.sqlite.tsx).
 */
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          mainScript: `src/main.sqlite.tsx`,
        },
      },
    }),
  ],
  // Explicit mode: override .env.development Supabase vars at compile time
  define: {
    "import.meta.env.VITE_APP_MODE": JSON.stringify("sqlite"),
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(""),
    "import.meta.env.VITE_SB_PUBLISHABLE_KEY": JSON.stringify(""),
  },
  base: "/preview/",
  esbuild: {
    keepNames: true,
  },
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "ra-core",
      "react-router",
      "react-router-dom",
      "@tanstack/react-query",
      "@tanstack/react-query-persist-client",
      "@tanstack/query-async-storage-persister",
      "lucide-react",
      "ra-i18n-polyglot",
      "ra-language-english",
      "ra-supabase-language-english",
      "ra-supabase-core",
      "react-error-boundary",
      "react-hook-form",
      "date-fns",
      "lodash",
      "lodash/get",
      "lodash/set",
      "lodash/matches",
      "lodash/pickBy",
      "lodash/isEqual",
      "sonner",
      "jsonexport/dist",
      "clsx",
      "tailwind-merge",
      "class-variance-authority",
      "inflection",
      "query-string",
      "dompurify",
      "marked",
      "diacritic",
      "papaparse",
      "cmdk",
      "vaul",
      "mime/lite",
      "@streamparser/json-whatwg",
      "@supabase/supabase-js",
      "@radix-ui/react-accordion",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-tooltip",
      "react-cropper",
      "react-dropzone",
    ],
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: "0.0.0.0",
    hmr: {
      path: "vite-ws",
    },
    proxy: {
      "/preview/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/preview/, ""),
      },
    },
  },
});
