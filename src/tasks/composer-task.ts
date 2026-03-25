import { exec } from 'node:child_process';
import { BaseTask } from './base-task';

export class ComposerTask extends BaseTask {
    name = 'Installing Composer Packages';

    composerPackages?: string[];

    async doRun(): Promise<void> {
        await new Promise((resolve, reject) => {
            exec(`composer require ${this.composerPackages?.join(' ')}`, (error, _stdout, stderr) => {
                if (error) {
                    reject(new Error(`Failed to install composer packages: ${stderr}`));
                } else {
                    resolve(undefined);
                }
            });
        });
    }
}
