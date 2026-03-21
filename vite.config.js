import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
const version = packageJson.version;

export default defineConfig({
    root: '.',
    publicDir: false,
    define: {
        APP_VERSION: JSON.stringify(version),
    },
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
