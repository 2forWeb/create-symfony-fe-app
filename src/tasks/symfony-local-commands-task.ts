import { BaseTask } from './base-task';
import { resolve } from 'path';
import fs from 'node:fs';

export class SymfonyLocalCommandsTask extends BaseTask {
    name = 'Adding Symfony Local Commands';

    symfonyLocalCommands?: Record<string, string[]>;

    async doRun(): Promise<void> {
        await new Promise((r, reject) => {
            if (!this.symfonyLocalCommands) {
                r(undefined);
                return;
            }

            const symfonyLocalCommandsPath = resolve(process.cwd(), '.symfony.local.yaml');
            const fileExists = fs.existsSync(symfonyLocalCommandsPath);
            const content = fileExists
                ? this.getSymfonyLocalCommandsContents()
                : `workers:\n${this.getSymfonyLocalCommandsContents()}`;

            fs.writeFile(
                symfonyLocalCommandsPath,
                content,
                fileExists ? { flag: 'a' } : {},
                (error) => {
                    if (error) {
                        reject(new Error(`Failed to add symfony local commands: ${error.message}`));
                    } else {
                        r(undefined);
                    }
                },
            );
        });
    }

    getSymfonyLocalCommandsContents(): string {
        const contents: string[] = ['\n'];

        for (const [commandName, commandValue] of Object.entries(this.symfonyLocalCommands ?? {})) {
            contents.push(`    ${commandName}:\n`);

            for (const command of commandValue) {
                contents.push(`        ${command}\n`);
            }

            contents.push('\n');
        }

        return contents.join('');
    }
}
