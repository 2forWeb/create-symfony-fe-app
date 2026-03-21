import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    publicDir: false,
    build: {
        outDir: 'dist',
        minify: false,
        lib: false,
        rollupOptions: {
            input: 'src/index.ts',
            output: {
                entryFileNames: '[name].js',
                format: 'cjs',
                banner: '#! /usr/bin/env node'
            }
        }
    }
});
