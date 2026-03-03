/**
 * Configuración de ESLint (flat config format — ESLint v9+).
 *
 * Extiende las reglas recomendadas de JS y añade plugins específicos de React:
 * - react-hooks    → Valida las reglas de los Hooks (exhaustive-deps, rules-of-hooks).
 * - react-refresh  → Asegura compatibilidad con HMR (Hot Module Replacement) de Vite.
 *
 * Regla personalizada:
 * - no-unused-vars → Ignora variables que empiezan con mayúscula o underscore (_).
 *                     Esto permite importar componentes React o prefijos como `_err`
 *                     sin que ESLint marque error.
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignora la carpeta dist/ (build de producción)
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,             // Reglas base recomendadas de JavaScript
      reactHooks.configs.flat.recommended, // Reglas de React Hooks
      reactRefresh.configs.vite,           // Compatibilidad con Vite HMR
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // Variables globales del navegador (window, document, etc.)
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Habilita el parsing de JSX
        sourceType: 'module',        // Usa ES modules (import/export)
      },
    },
    rules: {
      // Permite variables no usadas si empiezan con mayúscula (componentes) o _ (ignoradas)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
