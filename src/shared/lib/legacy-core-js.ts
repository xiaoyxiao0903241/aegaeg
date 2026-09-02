/**
 * 仅开发环境使用的 core-js 语言级 polyfill（Chrome 91 模拟器）。
 * 生产构建改用 @vitejs/plugin-legacy 的 modernPolyfills——保持本入口为第一个
 * 模块脚本，使 `pnpm dev` 与生产环境的 API 面一致。
 */
import 'core-js/features/object/has-own'
import 'core-js/features/array/at'
import 'core-js/features/string/at'
