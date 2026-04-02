import { BaseTask } from './base-task';
import { FileAssetService } from '../service/file-asset-service';
import { TsconfigAsset } from '../skeleton/client/controllers/tsconfig_asset';
import HelloControllerAsset from '../skeleton/client/controllers/hello_controller_asset';
import { ViteStimulusConfigAsset } from '../skeleton/vite-stimulus-config_asset';
import fs from 'node:fs';
import { resolve } from 'path';

export class StimulusInitTask extends BaseTask {
    name = 'Creating the Stimulus TypeScript environment';

    private async copyOriginalControllers(): Promise<void> {
        const sourceRoot = resolve(process.cwd(), 'assets/controllers');
        const destinationRoot = resolve(process.cwd(), 'client/original-controllers');

        if (!fs.existsSync(sourceRoot)) {
            return;
        }

        fs.mkdirSync(destinationRoot, { recursive: true });

        const walk = (sourceDir: string, relativeDir = ''): void => {
            const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

            for (const entry of entries) {
                const sourcePath = resolve(sourceDir, entry.name);
                const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
                const destinationPath = resolve(destinationRoot, relativePath);

                if (entry.isDirectory()) {
                    fs.mkdirSync(destinationPath, { recursive: true });
                    walk(sourcePath, relativePath);
                    continue;
                }

                if (entry.isFile() && entry.name.endsWith('.js')) {
                    fs.mkdirSync(resolve(destinationPath, '..'), { recursive: true });
                    fs.copyFileSync(sourcePath, destinationPath);
                }
            }
        };

        walk(sourceRoot);
    }

    async doRun(): Promise<void> {
        try {
            const assetManager = new FileAssetService();

            const promises = [];
            promises.push(assetManager.generateAssets([
                new HelloControllerAsset(),
                new TsconfigAsset(),
                new ViteStimulusConfigAsset(),
            ]));

            promises.push(this.copyOriginalControllers());

            await Promise.all(promises);
        } catch (error) {
            this.errorMessage = (error as Error).message;
            throw error;
        }
    }
}
