/**
 * Inline boot polyfills for Chromium <93 (e.g. Android 11 Chrome 91).
 * Must run in a classic <script> before any `type="module"` entry — ESM imports are hoisted.
 *
 * Covers:
 * - Object.hasOwn (Chrome 93+)
 * - .at() on Array / String / TypedArray / DOM lists / PerformanceEntryList (Chrome 92+)
 *   — web-vitals LCP attribution calls `entries.at(-1)` on PerformanceEntryList.
 */
export const LEGACY_RUNTIME_POLYFILLS_BOOT_SCRIPT = [
  'try{',
  "if(typeof Object.hasOwn!=='function'){",
  'Object.hasOwn=function(o,p){return Object.prototype.hasOwnProperty.call(o,p)}',
  '}',
  'var __aegisAt=function(n){var l=this.length>>0;n=Math.trunc(n)||0;if(n<0)n+=l;return n<0||n>=l?void 0:this[n]};',
  'var __patchAt=function(p){if(p&&!p.at)p.at=__aegisAt};',
  '__patchAt(Array.prototype);',
  '__patchAt(String.prototype);',
  'typeof NodeList!=="undefined"&&__patchAt(NodeList.prototype);',
  'typeof HTMLCollection!=="undefined"&&__patchAt(HTMLCollection.prototype);',
  'typeof DOMTokenList!=="undefined"&&__patchAt(DOMTokenList.prototype);',
  'typeof PerformanceEntryList!=="undefined"&&__patchAt(PerformanceEntryList.prototype);',
  'typeof Int8Array!=="undefined"&&__patchAt(Int8Array.prototype);',
  'typeof Uint8Array!=="undefined"&&__patchAt(Uint8Array.prototype);',
  'typeof Uint8ClampedArray!=="undefined"&&__patchAt(Uint8ClampedArray.prototype);',
  'typeof Int16Array!=="undefined"&&__patchAt(Int16Array.prototype);',
  'typeof Uint16Array!=="undefined"&&__patchAt(Uint16Array.prototype);',
  'typeof Int32Array!=="undefined"&&__patchAt(Int32Array.prototype);',
  'typeof Uint32Array!=="undefined"&&__patchAt(Uint32Array.prototype);',
  'typeof Float32Array!=="undefined"&&__patchAt(Float32Array.prototype);',
  'typeof Float64Array!=="undefined"&&__patchAt(Float64Array.prototype);',
  'typeof BigInt64Array!=="undefined"&&__patchAt(BigInt64Array.prototype);',
  'typeof BigUint64Array!=="undefined"&&__patchAt(BigUint64Array.prototype);',
  '}catch{}',
].join('')
