import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { StimulusInitTask } from './stimulus-init-task';

describe('StimulusInitTask', () => {
    let originalCwd: string;

    beforeEach(() => {
        originalCwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(originalCwd);
    });

    it('writes Stimulus assets and copies .js controllers from assets/controllers into client/original-controllers', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
        process.chdir(dir);

        const controllersDir = path.join(dir, 'assets', 'controllers');
        fs.mkdirSync(controllersDir, { recursive: true });
        fs.writeFileSync(path.join(controllersDir, 'legacy.js'), '// legacy', 'utf-8');

        await new StimulusInitTask().doRun();

        const helloController = path.join(dir, 'client', 'controllers', 'hello_controller.ts');
        expect(fs.existsSync(helloController)).toBe(true);
        expect(fs.readFileSync(helloController, 'utf-8')).toContain('Hello Stimulus!');

        const copied = path.join(dir, 'client', 'original-controllers', 'legacy.js');
        expect(fs.readFileSync(copied, 'utf-8')).toBe('// legacy');
    });
});
