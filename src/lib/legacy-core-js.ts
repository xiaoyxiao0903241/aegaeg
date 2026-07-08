/**
 * Dev-only language polyfills via core-js (Chrome 91 emulator).
 * Production build uses @vitejs/plugin-legacy modernPolyfills instead — keep this
 * entry as the first module script so `pnpm dev` matches prod API surface.
 */
import 'core-js/features/object/has-own'
import 'core-js/features/array/at'
import 'core-js/features/string/at'
