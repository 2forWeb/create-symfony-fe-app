import { BaseAsset } from '../../base-asset';

export class HelloAsset extends BaseAsset {
    name = 'Hello.tsx';
    relativePath = 'client/react';

    getContents(): string {
        return `import React from 'react';

export default function Hello() {
    return <h1>Hello World!</h1>;
}
`;
    }
}
