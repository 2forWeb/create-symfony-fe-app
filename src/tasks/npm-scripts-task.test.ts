import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { NpmScriptsTask } from './npm-scripts-task';

describe('NpmScriptsTask', () => {
    let originalCwd: string;

    beforeEach(() => {
        originalCwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(originalCwd);
    });

    it('merges scripts and sets build from stimulus and react script keys', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
        process.chdir(dir);

        const packageJsonPath = path.join(dir, 'package.json');
        fs.writeFileSync(packageJsonPath, JSON.stringify({ name: 'test-proj' }, null, 2) + '\n', 'utf-8');

        const task = new NpmScriptsTask();
        task.npmScripts = {
            'build:stimulus': 'node ./node_modules/.bin/vite build --config vite.stimulus.config.js',
            'build:react': 'node ./node_modules/.bin/vite build --config vite.react.config.js',
        };

        await task.doRun();

        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
            scripts: Record<string, string>;
        };
        expect(pkg.scripts['build:stimulus']).toBe(task.npmScripts['build:stimulus']);
        expect(pkg.scripts['build:react']).toBe(task.npmScripts['build:react']);
        // npm-scripts-task.ts joins with spaces around connector, then .trim() leaves inner double spaces
        expect(pkg.scripts.build).toBe('npm run build:stimulus  &&  npm run build:react');
    });
});
