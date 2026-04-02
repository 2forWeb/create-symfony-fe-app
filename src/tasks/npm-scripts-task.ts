import { BaseTask } from './base-task';
import fs from 'node:fs';
import { resolve } from 'path';

export class NpmScriptsTask extends BaseTask {
    name = 'Adding NPM scripts to package.json';

    npmScripts?: Record<string, string>;

    async doRun(): Promise<void> {
        return new Promise((r, reject) => {
            if (!this.npmScripts) {
                r(undefined);
            }

            const packageJsonPath = resolve(process.cwd(), 'package.json');

            if (!fs.existsSync(packageJsonPath)) {
                throw new Error(`Could not find package.json in ${process.cwd()}`);
            }

            fs.readFile(packageJsonPath, 'utf-8', (err, data) => {
                if (err) {
                    reject(new Error(`Failed to read package.json: ${err.message}`));
                } else {
                    const packageJson = JSON.parse(data) as {
                        scripts?: Record<string, string>;
                    } & Record<string, unknown>;
                    
                    packageJson.scripts ??= {};

                    for (const [scriptName, scriptValue] of Object.entries(this.npmScripts ?? {})) {
                        packageJson.scripts[scriptName] = scriptValue;
                    }

                    const scriptNames = Object.keys(this.npmScripts ?? {});
                    const buildStimulusScript = scriptNames.includes('build:stimulus') ? 'npm run build:stimulus' : '';
                    const buildReactScript = scriptNames.includes('build:react') ? 'npm run build:react' : '';
                    const connector = buildStimulusScript && buildReactScript ? ' && ' : '';

                    packageJson.scripts['build'] = `${buildStimulusScript} ${connector} ${buildReactScript}`.trim();

                    fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, (err) => {
                        if (err) {
                            reject(new Error(`Failed to write package.json: ${err.message}`));
                        } else {
                            r(undefined);
                        }
                    });
                }
            });
        });
    }
}
