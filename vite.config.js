import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

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
                        output: {
                                // Advanced code splitting strategy optimized for mobile
                                manualChunks(id) {
                                        // Vendor chunks - split large libraries
                                        if (id.includes('node_modules')) {
                                                if (id.includes('react')) {
                                                        return 'vendor-react';
                                                }
                                                if (id.includes('@mui') || id.includes('@emotion')) {
                                                        return 'vendor-ui';
                                                }
                                                if (id.includes('redux') || id.includes('react-redux') || id.includes('@reduxjs')) {
                                                        return 'vendor-state';
                                                }
                                                if (id.includes('axios') || id.includes('@tanstack/react-query')) {
                                                        return 'vendor-data';
                                                }
                                                if (id.includes('framer-motion') || id.includes('react-confetti')) {
                                                        return 'vendor-animation';
                                                }
                                                if (id.includes('firebase')) {
                                                        return 'vendor-firebase';
                                                }
                                                if (id.includes('lucide-react') || id.includes('react-icons')) {
                                                        return 'vendor-icons';
                                                }
                                                return 'vendor-common';
                                        }
                                        // App code chunks - split by page/feature
                                        if (id.includes('src/pages')) {
                                                const match = id.match(/src\/pages\/([^/]+)/);
                                                if (match) {
                                                        return `page-${match[1]}`;
                                                }
                                        }
                                },
                                // Optimize chunk naming for better caching
                                entryFileNames: 'js/[name]-[hash].js',
                                chunkFileNames: 'js/[name]-[hash].js',
                                assetFileNames: (assetInfo) => {
                                        const info = assetInfo.name.split('.');
                                        const ext = info[info.length - 1];
                                        if (/png|jpe?g|gif|svg/.test(ext)) {
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
                },
                // Mobile-optimized minification
                minify: 'esbuild',
                chunkSizeWarningLimit: 350, // Stricter limit for mobile
                reportCompressedSize: true,
                // Target modern mobile browsers for smaller bundles
                target: 'es2020',
                // CSS optimization - inline critical CSS
                cssCodeSplit: true,
                sourcemap: false,
                // Advanced optimization config for mobile
                terserOptions: {
                        compress: {
                                drop_console: true,
                                drop_debugger: true,
                                pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
                                passes: 2, // Additional pass for better compression
                        },
                        mangle: {
                                toplevel: true, // Mangle all variables for smaller output
                        },
                        format: {
                                comments: false, // Remove all comments for smaller size
                        },
                },
                // Aggressive inlining threshold for mobile
                assetsInlineLimit: 8192, // Inline assets up to 8KB (reduced network requests)
                rollupOptions: {
                        output: {
                                // ... existing output config
                        },
                        // External dependencies optimization
                        external: [], // Don't externalize for bundle optimization
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
                ],
                exclude: [
                        'react-hot-toast',
                        'framer-motion',
                        'react-confetti',
                        'react-lazy-load-image-component',
                ],
                // Force pre-bundle for mobile performance
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