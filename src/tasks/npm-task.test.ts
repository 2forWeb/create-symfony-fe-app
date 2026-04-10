import fs from 'node:fs';
import type { ChildProcess } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { mockExec } = vi.hoisted(() => ({
    mockExec: vi.fn((command: string, callback?: (error: Error | null, stdout: string, stderr: string) => void): ChildProcess => {
        if (callback) {
            callback(null, '', '');
        }
        return {} as ChildProcess;
    }),
}));

vi.mock('node:child_process', async () => {
    const actual = await vi.importActual<typeof import('node:child_process')>('node:child_process');
    return { ...actual, exec: mockExec };
});

import { NpmTask } from './npm-task';

describe('NpmTask', () => {
    let originalCwd: string;

    beforeEach(() => {
        originalCwd = process.cwd();
        mockExec.mockImplementation((command, callback) => {
            if (callback) {
                callback(null, '', '');
            }
            return {} as ChildProcess;
        });
    });

    afterEach(() => {
        process.chdir(originalCwd);
        mockExec.mockClear();
    });

    it('runs npm install -D with configured packages from cwd', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
        process.chdir(dir);

        const task = new NpmTask();
        task.npmPackages = ['vite', 'typescript'];

        await task.doRun();

        expect(mockExec).toHaveBeenCalledTimes(1);
        expect(mockExec.mock.calls[0][0]).toBe('npm install -D vite typescript');
    });
});
