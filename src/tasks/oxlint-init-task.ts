import { BaseTask } from './base-task';
import { FileAssetService } from '../service/file-asset-service';
import { OxlintRcAsset } from '../skeleton/oxlintrc_asset';
import { OxfmtRcAsset } from '../skeleton/oxfmtrc_asset';

export class OxLintInitTask extends BaseTask {
    name = 'Creating the Oxlint environment';

    async doRun(): Promise<void> {
        try {
            const assetManager = new FileAssetService();

            await assetManager.generateAssets([new OxfmtRcAsset(), new OxlintRcAsset()]);
        } catch (error) {
            this.errorMessage = (error as Error).message;
            throw error;
        }
    }
}
