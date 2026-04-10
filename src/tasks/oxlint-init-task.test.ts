import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { OxLintInitTask } from './oxlint-init-task';

describe('OxLintInitTask', () => {
    let originalCwd: string;

    beforeEach(() => {
        originalCwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(originalCwd);
    });

    it('writes Oxlint and Oxfmt config files at project root', async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
        process.chdir(dir);

        await new OxLintInitTask().doRun();

        const oxlintPath = path.join(dir, '.oxlintrc.json');
        const oxfmtPath = path.join(dir, '.oxfmtrc.json');
        expect(fs.existsSync(oxlintPath)).toBe(true);
        expect(fs.existsSync(oxfmtPath)).toBe(true);

        const oxlint = JSON.parse(fs.readFileSync(oxlintPath, 'utf-8')) as { plugins?: string[] };
        expect(oxlint.plugins).toContain('typescript');
    });
});
