import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ReactInitTask } from './react-init-task';

describe('ReactInitTask', () => {
    let originalCwd: string;

    beforeEach(() => {
        originalCwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(originalCwd);
    });

    it('writes React client assets under client/react and vite.react.config.js', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
        process.chdir(dir);

        await new ReactInitTask().doRun();

        const hello = path.join(dir, 'client', 'react', 'Hello.tsx');
        expect(fs.readFileSync(hello, 'utf-8')).toContain('Hello World!');
        expect(fs.existsSync(path.join(dir, 'vite.react.config.js'))).toBe(true);
    });
});
