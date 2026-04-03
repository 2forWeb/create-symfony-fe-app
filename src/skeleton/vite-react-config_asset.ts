import { BaseAsset } from './base-asset';

export class ViteStimulusConfigAsset extends BaseAsset {
    name = 'vite.stimulus.config.js';
    relativePath = './';

    getContents(): string {
        return `import { defineConfig } from 'vite';
import fg from 'fast-glob';

const entries = fg.sync('client/react/**/*.tsx');

export default defineConfig({
    root: '.',
    publicDir: false,

    build: {
        rolldownOptions: {
            input: entries,
            external: ['react'],
            tsconfig: 'client/react/tsconfig.json',
            preserveEntrySignatures: 'allow-extension',
            output: {
                entryFileNames: '[name].js',
            },
            treeshake: false,
        },
        outDir: 'assets/react/controllers',
    },
});
`;
    }
}
