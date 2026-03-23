import { exec } from 'node:child_process';
import { BaseTask } from './base-task';

export class NpmInitTask extends BaseTask {
    name = 'Initializing NPM Project';

    npmPackages?: string[];

    async doRun(): Promise<void> {
        await new Promise((resolve, reject) => {
            exec(`npm init -y`, (error, _stdout, stderr) => {
                if (error) {
                    reject(new Error(`Failed to initialize node project: ${stderr}`));
                } else {
                    resolve(undefined);
                }
            });
        });
    }
}
