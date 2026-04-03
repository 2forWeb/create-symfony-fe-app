import { BaseTask } from './base-task';
import { FileAssetService } from '../service/file-asset-service';
import { TsconfigAsset } from '../skeleton/client/react/tsconfig_asset';
import { HelloAsset } from '../skeleton/client/react/hello_asset';
import { ViteReactConfigAsset } from '../skeleton/vite-react-config_asset';

export class ReactInitTask extends BaseTask {
    name = 'Creating the React TypeScript environment';

    async doRun(): Promise<void> {
        try {
            const assetManager = new FileAssetService();

            await assetManager.generateAssets([new HelloAsset(), new TsconfigAsset(), new ViteReactConfigAsset()]);
        } catch (error) {
            this.errorMessage = (error as Error).message;
            throw error;
        }
    }
}
