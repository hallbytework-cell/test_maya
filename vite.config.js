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
                                // Advanced code splitting strategy for optimal chunk sizes
                                manualChunks(id) {
                                        // Vendor chunks
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
                                                return 'vendor-common';
                                        }
                                },
                        },
                },
                // Use esbuild for faster minification
                minify: 'esbuild',
                // Aggressive optimization
                chunkSizeWarningLimit: 500,
                reportCompressedSize: true,
                // Target modern browsers for smaller bundles
                target: 'es2020',
                // CSS optimization
                cssCodeSplit: true,
                sourcemap: false,
                // Advanced optimization config
                terserOptions: {
                        compress: {
                                drop_console: true,
                                drop_debugger: true,
                                pure_funcs: ['console.log', 'console.info', 'console.debug'],
                        },
                        mangle: true,
                },
                assetsInlineLimit: 4096, // Inline assets smaller than 4KB
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
        },
        // Server optimization for dev
        server: {
                middlewareMode: false,
                hmr: {
                        protocol: 'ws',
                        host: 'localhost',
                        port: 5173,
                },
        },
});