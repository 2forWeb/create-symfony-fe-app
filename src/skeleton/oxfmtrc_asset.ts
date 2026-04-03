import { BaseAsset } from './base-asset';

export class OxfmtRcAsset extends BaseAsset {
    name = '.oxfmtrc.json';

    relativePath = './';

    getContents(): string {
        return JSON.stringify(this.getJsonContents(), null, 2);
    }

    getJsonContents(): Record<string, unknown> {
        return {
            $schema: './node_modules/oxfmt/configuration_schema.json',
            printWidth: 130,
            tabWidth: 4,
            trailingComma: 'es5',
            semi: true,
            singleQuote: true,
        };
    }
}
