import { exec } from 'node:child_process';
import { BaseTask } from './base-task';

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

            await new Promise((resolve, reject) => {
                exec(`touch ${process.cwd()}/client/controllers/hello_controller.ts`, (error, _stdout, stderr) => {
                    if (error) {
                        reject(new Error(`Failed to create the basic stimulus controller: ${stderr}`));
                    } else {
                        resolve(undefined);
                    }
                });
            });
        } catch (error) {
            this.errorMessage = (error as Error).message;
            throw error;
        }
    }
}
