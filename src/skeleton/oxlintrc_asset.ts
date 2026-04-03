import { BaseAsset } from './base-asset';

export class OxlintRcAsset extends BaseAsset {
    name = '.oxlintrc.json';

    relativePath = './';

    getContents(): string {
        return JSON.stringify(this.getJsonContents(), null, 2);
    }

    getJsonContents(): Record<string, unknown> {
        return {
            $schema: './node_modules/oxlint/configuration_schema.json',
            plugins: ['oxc', 'typescript', 'unicorn', 'node'],
            env: {
                builtin: true,
                browser: true,
            },
            ignorePatterns: ['**', '!client/', '!client/**/*.ts', '!client/**/*.tsx'],
        };
    }
}
