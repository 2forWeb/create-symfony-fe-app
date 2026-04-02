import { exec } from 'node:child_process';
import { BaseTask } from './base-task';
import { FileAssetService } from '../service/file-asset-service';
import { TsconfigAsset } from '../skeleton/client/controllers/tsconfig_asset';
import HelloControllerAsset from '../skeleton/client/controllers/hello_controller_asset';
import { ViteStimulusConfigAsset } from '../skeleton/vite-stimulus-config_asset';

export class StimulusInitTask extends BaseTask {
    name = 'Creating the Stimulus TypeScript environment';

    async doRun(): Promise<void> {
        try {
            await new Promise((resolve, reject) => {
                exec(`cd ${process.cwd()} && mkdir -p client/controllers`, (error, _stdout, stderr) => {
                    if (error) {
                        reject(new Error(`Failed to create Stimulus directory: ${stderr}`));
                    } else {
                        resolve(undefined);
                    }
                });
            });

            const assetManager = new FileAssetService();

            await assetManager.generateAssets([
                new HelloControllerAsset(),
                new TsconfigAsset(),
                new ViteStimulusConfigAsset(),
            ]);
        } catch (error) {
            this.errorMessage = (error as Error).message;
            throw error;
        }
    }
}
