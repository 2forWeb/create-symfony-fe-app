import { exec } from 'node:child_process';
import { BaseTask } from './base-task';

export class TailwindInitTask extends BaseTask {
    name = 'Initializing Tailwind';

    async doRun(): Promise<void> {
        await new Promise((resolve, reject) => {
            exec('symfony console tailwind:init', (error, _stdout, stderr) => {
                if (error) {
                    reject(new Error(`Failed to initialize Tailwind: ${stderr}`));
                } else {
                    resolve(undefined);
                }
            });
        });
    }
}
