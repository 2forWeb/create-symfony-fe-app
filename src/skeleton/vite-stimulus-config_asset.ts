import { BaseAsset } from './base-asset';

export class ViteStimulusConfigAsset extends BaseAsset {
    name = 'vite.stimulus.config.js';
    relativePath = './';

    getContents(): string {
        return `import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fg from 'fast-glob';

const entries = fg.sync('client/controllers/**/*.ts');

/** @type {import('vite').UserConfig} */
export default defineConfig({
    root: '.',
    publicDir: false,

    build: {
        rolldownOptions: {
            input: entries,
            external: ['@hotwired/stimulus'],
            tsconfig: 'client/controllers/tsconfig.json',
            preserveEntrySignatures: 'allow-extension',
            output: {
                entryFileNames: '[name].js',
            },
        },
        outDir: 'assets/controllers',
    },

    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'client/original-controllers/**/*.js',
                    dest: '.',
                },
            ],
        }),
    ],
});
`;
    }
}
