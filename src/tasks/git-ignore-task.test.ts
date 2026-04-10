import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GitIgnoreTask } from './git-ignore-task';

describe('GitIgnoreTask', () => {
    let originalCwd: string;

    beforeEach(() => {
        originalCwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(originalCwd);
    });

    it('creates .gitignore with lines when missing, appends when present', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
        process.chdir(dir);

        const gitignorePath = path.join(dir, '.gitignore');

        const task1 = new GitIgnoreTask();
        task1.gitIgnore = ['/assets/controllers/'];
        await task1.doRun();
        expect(fs.readFileSync(gitignorePath, 'utf-8')).toBe('/assets/controllers/\n');

        const task2 = new GitIgnoreTask();
        task2.gitIgnore = ['/assets/react/'];
        await task2.doRun();
        expect(fs.readFileSync(gitignorePath, 'utf-8')).toBe('/assets/controllers/\n\n/assets/react/\n');
    });
});
