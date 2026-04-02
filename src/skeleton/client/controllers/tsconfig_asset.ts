import { BaseAsset } from "../../base-asset";

export class TsconfigAsset extends BaseAsset {
    name = 'tsconfig.json';
    relativePath = 'client/controllers';

    getContents(): string {
        return JSON.stringify(this.getJsonContents(), null, 2);
    }

    getJsonContents(): Record<string, unknown> {
        return {
            compilerOptions: {
                module: 'ES2020',
                target: 'ES2020',
                allowJs: false,
                moduleResolution: 'node',
                declaration: false,
                esModuleInterop: true,
                strict: true,
                skipLibCheck: true,
                forceConsistentCasingInFileNames: true,
                noImplicitAny: true,
                removeComments: false,
                preserveConstEnums: true,
                baseUrl: './',
                outDir: '../../assets/controllers',
            },
            include: [
                './**/*.ts',
            ],
            exclude: ['node_modules', '**/*.spec.ts'],
        };
    }
}
