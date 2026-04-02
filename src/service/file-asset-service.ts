import { BaseAsset } from '../skeleton/base-asset';
import fs from 'node:fs';
import { resolve } from 'path';

export class FileAssetService {
    async generateAssets(assets: BaseAsset[]): Promise<void> {
        const promises = [];
        for (const asset of assets) {
            promises.push(new Promise((r, reject) => {
                if (asset.relativePath !== './' && !fs.existsSync(resolve(process.cwd(), asset.relativePath))) {
                    fs.mkdirSync(resolve(process.cwd(), asset.relativePath), { recursive: true });
                }
       
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
