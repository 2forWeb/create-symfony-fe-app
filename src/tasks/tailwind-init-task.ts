import { exec } from 'node:child_process';
import { BaseTask } from './base-task';
import fs from 'node:fs';

export class TailwindInitTask extends BaseTask {
    name = 'Initializing Tailwind';

    async doRun(): Promise<void> {
        await new Promise((resolve, reject) => {
            exec('symfony console tailwind:init', (error, _stdout, stderr) => {
                if (error) {
                    reject(new Error(`Failed to initialize Tailwind: ${stderr}`));
                } else {
                    // Fix the generated css so that it complies with oxfmt rules
                    fs.writeFileSync(
                        'assets/styles/app.css',
                        fs
                            .readFileSync('assets/styles/app.css')
                            .toString()
                            .replace(/import "tailwindcss"/g, "import 'tailwindcss'")
                    );

                    resolve(undefined);
                }
            });
        });
    }
}
