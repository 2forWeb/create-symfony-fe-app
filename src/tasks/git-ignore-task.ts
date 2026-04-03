import { BaseTask } from './base-task';
import fs from 'node:fs';
import { resolve } from 'path';

export class GitIgnoreTask extends BaseTask {
    name = 'Adding Git Ignore Statements';

    gitIgnore?: string[];

    async doRun(): Promise<void> {
        await new Promise((r, reject) => {
            if (!this.gitIgnore) {
                r(undefined);
                return;
            }

            const gitIgnorePath = resolve(process.cwd(), '.gitignore');
            const fileExists = fs.existsSync(gitIgnorePath);
            const lines = this.gitIgnore.join('\n');
            const content = fileExists ? `\n${lines}\n` : `${lines}\n`;

            fs.writeFile(
                gitIgnorePath,
                content,
                fileExists ? { flag: 'a' } : {},
                (error) => {
                    if (error) {
                        reject(new Error(`Failed to add git ignore statements: ${error.message}`));
                    } else {
                        r(undefined);
                    }
                },
            );
        });
    }
}
