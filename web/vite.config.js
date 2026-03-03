import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

/**
 * Configuración de Vite — build tool y dev server del proyecto.
 *
 * Plugins activos:
 * - react()      → Soporte JSX con SWC (compilador rápido en Rust, alternativa a Babel).
 * - tailwindcss() → Integración de Tailwind CSS v4 directamente como plugin de Vite
 *                    (no necesita tailwind.config.js separado).
 *
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
