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

import { TailwindInitTask } from './tailwind-init-task';

describe('TailwindInitTask', () => {
    let originalCwd: string;

    beforeEach(() => {
        originalCwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(originalCwd);
        mockExec.mockClear();
    });

    it('after symfony tailwind:init succeeds, rewrites double-quoted tailwind import to single quotes', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
        process.chdir(dir);

        const cssDir = path.join(dir, 'assets', 'styles');
        fs.mkdirSync(cssDir, { recursive: true });
        const cssPath = path.join(cssDir, 'app.css');
        fs.writeFileSync(cssPath, '@import "tailwindcss";\n', 'utf-8');

        mockExec.mockImplementation((command, callback) => {
            expect(command).toBe('symfony console tailwind:init');
            if (callback) {
                callback(null, '', '');
            }
            return {} as ChildProcess;
        });

        await new TailwindInitTask().doRun();

        expect(fs.readFileSync(cssPath, 'utf-8')).toBe("@import 'tailwindcss';\n");
    });
});
