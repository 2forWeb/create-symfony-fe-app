import fs from 'node:fs';
import { resolve } from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { BaseAsset } from '../skeleton/base-asset';
import { FileAssetService } from './file-asset-service';

class MockAsset extends BaseAsset {
    name = 'mock-file.txt';
    relativePath = 'test-output';

    getContents(): string {
        return 'mock asset contents';
    }
}

describe('FileAssetService', () => {
    const outputDirectory = resolve(process.cwd(), 'test-output');
    const outputFilePath = resolve(outputDirectory, 'mock-file.txt');

    afterEach(() => {
        fs.rmSync(outputDirectory, { recursive: true, force: true });
    });

    it('creates asset file in test-output and writes expected contents', async () => {
        const service = new FileAssetService();

        await service.generateAssets([new MockAsset()]);

        expect(fs.existsSync(outputFilePath)).toBe(true);
        expect(fs.readFileSync(outputFilePath, 'utf-8')).toBe('mock asset contents');
    });
});
