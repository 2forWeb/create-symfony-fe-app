import { BaseAsset } from '../skeleton/base-asset';
import fs from 'node:fs';
import { resolve } from 'path';

export class FileAssetService {
    async generateAssets(assets: BaseAsset[]): Promise<void> {
        const promises = [];
        for (const asset of assets) {
            promises.push(new Promise((r, reject) => {
                fs.writeFile(resolve(process.cwd(), asset.getFilePath()), asset.getContents(), (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        r(undefined);
                    }
                });
            }));
        }

        await Promise.all(promises);
    }
}
