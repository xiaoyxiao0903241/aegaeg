/**
 * Inline boot polyfills for Chromium <93 (e.g. Android 11 Chrome 91).
 * Must run in a classic <script> before any `type="module"` entry — ESM imports are hoisted.
 */
export const LEGACY_RUNTIME_POLYFILLS_BOOT_SCRIPT = [
  'try{',
  "if(typeof Object.hasOwn!=='function'){",
  'Object.hasOwn=function(o,p){return Object.prototype.hasOwnProperty.call(o,p)}',
  '}',
  'if(!Array.prototype.at){',
  'Array.prototype.at=function(n){n=Math.trunc(n)||0;if(n<0)n+=this.length;return n<0||n>=this.length?void 0:this[n]}',
  '}',
  '}catch{}',
].join('')
