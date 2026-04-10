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

import { ComposerTask } from './composer-task';

describe('ComposerTask', () => {
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

    it('runs composer require with configured packages from cwd', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
        process.chdir(dir);

        const task = new ComposerTask();
        task.composerPackages = ['symfony/ux-react', 'symfonycasts/tailwind-bundle'];

        await task.doRun();

        expect(mockExec).toHaveBeenCalledTimes(1);
        expect(mockExec.mock.calls[0][0]).toBe('composer require symfony/ux-react symfonycasts/tailwind-bundle');
    });
});
