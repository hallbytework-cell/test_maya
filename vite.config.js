import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// Analytics injector to prevent unused code bundling in production
const isProduction = process.env.NODE_ENV === 'production';

// https://vite.dev/config/
export default defineConfig({
        plugins: [
                react(),
                tailwindcss(),
                compression({
                        verbose: true,
                        disable: false,
                        threshold: 10240,
                        algorithm: 'brotli',
                        ext: '.br',
                }),
                compression({
                        verbose: true,
                        disable: false,
                        threshold: 10240,
                        algorithm: 'gzip',
                        ext: '.gz',
                }),
                visualizer({
                        open: false,
                        gzipSize: true,
                        brotliSize: true,
                        filename: 'stats.html',
                        title: 'Bundle Size Analysis - Mobile Optimized',
                }),
        ],
        resolve: {
                alias: {
                        "@": path.resolve(__dirname, "src"),
                        "@components": path.resolve(__dirname, "src/components"),
                        "@pages": path.resolve(__dirname, "src/pages"),
                        "@data": path.resolve(__dirname, "src/data"),
                },
        },
        build: {
                rollupOptions: {
                        input: {
                                main: path.resolve(__dirname, 'index.html'),
                        },
                        output: {
                                // Optimize chunk naming for better caching
                                entryFileNames: 'js/[name]-[hash].js',
                                chunkFileNames: 'js/[name]-[hash].js',
                                assetFileNames: (assetInfo) => {
                                        const info = assetInfo.name.split('.');
                                        const ext = info[info.length - 1];
                                        if (/png|jpe?g|gif|svg|webp/.test(ext)) {
                                                return 'images/[name]-[hash][extname]';
                                        }
                                        if (/woff|woff2|eot|ttf|otf/.test(ext)) {
                                                return 'fonts/[name]-[hash][extname]';
                                        }
                                        if (ext === 'css') {
                                                return 'css/[name]-[hash][extname]';
                                        }
                                        return '[name]-[hash][extname]';
                                },
                        },
                        // Tree-shaking configuration for maximum unused code removal
                        treeshake: {
                                moduleSideEffects: false, // Assume no side effects for better tree shaking
                                propertyReadSideEffects: false,
                                tryCatchDeoptimization: false,
                        },
                },
                // Aggressive minification
                minify: 'esbuild',
                esbuild: {
                        drop: ['console', 'debugger'],
                        pure: ['console.log', 'console.debug', 'console.info'],
                },
                chunkSizeWarningLimit: 500,
                reportCompressedSize: true,
                // Target modern browsers for smaller bundles (ES2020)
                target: ['es2020', 'edge88', 'firefox78', 'chrome80', 'safari14'],
                sourcemap: false,
                // CSS optimization - split CSS for better caching
                cssCodeSplit: true,
                polyfillDynamicImport: false, // No polyfills for modern browsers
                // Advanced terser configuration for maximum compression
                terserOptions: {
                        compress: {
                                drop_console: true,
                                drop_debugger: true,
                                passes: 3, // Three compression passes for maximum optimization
                                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn', 'console.error'],
                                pure_getters: true,
                                unsafe: true,
                                unsafe_arrows: true,
                                unsafe_comps: true,
                                unsafe_Function: true,
                                unsafe_methods: true,
                                unsafe_proto: true,
                                unsafe_regexp: true,
                        },
                        mangle: {
                                toplevel: true,
                                safari10: false, // No need to support old Safari
                        },
                        format: {
                                comments: false,
                                max_line_len: 0,
                                preamble: null,
                        },
                },
                // Inline small assets to reduce HTTP requests
                assetsInlineLimit: 8192,
                lib: {
                        entry: path.resolve(__dirname, 'src/main.jsx'),
                        name: 'MV-EcomUI',
                },
        },
        // Optimize dependencies with pre-bundling
        optimizeDeps: {
                include: [
                        'react',
                        'react-dom',
                        'react-router-dom',
                        '@reduxjs/toolkit',
                        'react-redux',
                        'axios',
                        '@tanstack/react-query',
                ],
                exclude: [
                        'react-hot-toast',
                        'framer-motion',
                        'react-confetti',
                ],
                // Force pre-bundling and enable no external for better tree shaking
                force: true,
        },
        // Server optimization for dev (mobile testing)
        server: {
                middlewareMode: false,
                hmr: {
                        protocol: 'ws',
                        host: 'localhost',
                        port: 5173,
                },
                // Reduce memory usage on mobile dev servers
                cors: true,
        },
});