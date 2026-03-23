import { BaseTask } from './base-task';

export class NpmTask extends BaseTask {
    name = 'Installing NPM Packages';

    npmPackages?: string[];

    async doRun(): Promise<void> {
        await new Promise((resolve, reject) => setTimeout(() => {
            resolve(undefined);
        }, 1000));
    }
}
