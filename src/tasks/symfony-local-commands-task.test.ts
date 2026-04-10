import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SymfonyLocalCommandsTask } from './symfony-local-commands-task';

describe('SymfonyLocalCommandsTask', () => {
    let originalCwd: string;

    beforeEach(() => {
        originalCwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(originalCwd);
    });

    it('writes workers YAML when missing and appends when file exists', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
        process.chdir(dir);

        const yamlPath = path.join(dir, '.symfony.local.yaml');

        const task1 = new SymfonyLocalCommandsTask();
        task1.symfonyLocalCommands = {
            'vite-stimulus': ["cmd: ['npm', 'run', 'watch']"],
        };
        await task1.doRun();
        expect(fs.readFileSync(yamlPath, 'utf-8')).toBe(`workers:\n${task1.getSymfonyLocalCommandsContents()}`);

        const task2 = new SymfonyLocalCommandsTask();
        task2.symfonyLocalCommands = {
            tailwind: ["cmd: ['symfony', 'console', 'tailwind:build']"],
        };
        await task2.doRun();
        expect(fs.readFileSync(yamlPath, 'utf-8')).toBe(
            `workers:\n${task1.getSymfonyLocalCommandsContents()}${task2.getSymfonyLocalCommandsContents()}`
        );
    });
});
