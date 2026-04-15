import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Application } from '../application';
import { TaskService } from './task-service';
import type { NpmTask } from '../tasks/npm-task';
import type { NpmScriptsTask } from '../tasks/npm-scripts-task';
import type { GitIgnoreTask } from '../tasks/git-ignore-task';
import type { SymfonyLocalCommandsTask } from '../tasks/symfony-local-commands-task';

/** Literals match `TaskService.getTasks()` in task-service.ts */
const EXPECT_DEFAULT_NPM_SCRIPTS = {
    'build:stimulus': 'node ./node_modules/.bin/vite build --config vite.stimulus.config.js',
    'build:stimulus:watch': 'node ./node_modules/.bin/vite build --config vite.stimulus.config.js --watch',
    'typecheck:stimulus': 'tsc --project client/controllers/tsconfig.json --noEmit',
    lint: 'oxlint && npm run fmt',
    fmt: 'oxfmt --check client/**/*.ts client/**/*.tsx assets/styles/**/*.css',
    'fmt:fix': 'oxfmt client/**/*.ts client/**/*.tsx assets/styles/**/*.css',
};

const EXPECT_DEFAULT_NPM_PACKAGES = [
    'vite',
    'vite-plugin-static-copy',
    'fast-glob',
    '@hotwired/stimulus',
    'typescript',
    'oxlint',
    'oxfmt',
];

describe('TaskService', () => {
    let service: TaskService;
    let originalCwd: string;

    beforeEach(() => {
        service = new TaskService();
        originalCwd = process.cwd();
    });

    afterEach(() => {
        process.chdir(originalCwd);
    });

    describe('getSelectedTasks', () => {
        it('returns selected catalog task names in Application default option order', () => {
            const opts = Application.getDefaultOptions();

            expect(service.getSelectedTasks(opts).map((t) => t.name)).toEqual([
                'typescript-stimulus-controllers',
                'oxlint-oxformat',
            ]);
        });

        it('returns empty when every option is deselected', () => {
            const opts = Application.getDefaultOptions();

            for (const o of opts) {
                o.selected = false;
            }

            expect(service.getSelectedTasks(opts)).toEqual([]);
        });

        it('returns all options when every option is selected', () => {
            const opts = Application.getDefaultOptions();

            for (const o of opts) {
                o.selected = true;
            }

            expect(service.getSelectedTasks(opts).map((t) => t.name)).toEqual([
                'typescript-stimulus-controllers',
                'typescript-react-components',
                'tailwindcss',
                'oxlint-oxformat',
            ]);
        });
    });

    describe('getComposerPackages', () => {
        it('returns no composer packages for Application defaults', () => {
            expect(service.getComposerPackages(Application.getDefaultOptions())).toEqual([]);
        });

        it('returns merged composer packages when every stack is selected', () => {
            const opts = Application.getDefaultOptions();

            for (const o of opts) {
                o.selected = true;
            }

            expect(service.getComposerPackages(opts)).toEqual(['symfony/ux-react', 'symfonycasts/tailwind-bundle']);
        });
    });

    describe('getNpmPackages', () => {
        it('returns base plus stacks for Application defaults', () => {
            expect(service.getNpmPackages(Application.getDefaultOptions())).toEqual(EXPECT_DEFAULT_NPM_PACKAGES);
        });

        it('returns base plus all stacks when every option is selected', () => {
            const opts = Application.getDefaultOptions();

            for (const o of opts) {
                o.selected = true;
            }

            expect(service.getNpmPackages(opts)).toEqual([
                'vite',
                'vite-plugin-static-copy',
                'fast-glob',
                '@hotwired/stimulus',
                'typescript',
                '@types/react@18',
                'react@18',
                'oxlint',
                'oxfmt',
            ]);
        });
    });

    describe('getNpmScripts', () => {
        it('merges npm scripts from selected stacks for Application defaults', () => {
            expect(service.getNpmScripts(Application.getDefaultOptions())).toEqual(EXPECT_DEFAULT_NPM_SCRIPTS);
        });
    });

    describe('getGitIgnoreStatements', () => {
        it('collects gitignore entries from selected stacks for Application defaults', () => {
            expect(service.getGitIgnoreStatements(Application.getDefaultOptions())).toEqual(['/node_modules/', '/assets/controllers/']);
        });
    });

    describe('getSymfonyLocalCommands', () => {
        it('merges symfony local commands from selected stacks for Application defaults', () => {
            expect(service.getSymfonyLocalCommands(Application.getDefaultOptions())).toEqual({
                'vite-stimulus': ["cmd: ['npm', 'run', 'build:stimulus:watch']"],
            });
        });
    });

    describe('shouldInitializeNpm', () => {
        it('returns true when package.json is missing in cwd', () => {
            const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
            process.chdir(dir);

            expect(service.shouldInitializeNpm()).toBe(true);

            process.chdir(originalCwd);
            fs.rmSync(dir, { recursive: true, force: true });
        });

        it('returns false when package.json exists in cwd', () => {
            const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
            process.chdir(dir);

            fs.writeFileSync(path.join(dir, 'package.json'), '{}\n', 'utf-8');

            expect(service.shouldInitializeNpm()).toBe(false);

            process.chdir(originalCwd);
            fs.rmSync(dir, { recursive: true, force: true });
        });
    });

    describe('prepareTasks', () => {
        it('prepends npm init and matches serialized pipeline for Application defaults in an empty directory', () => {
            const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
            process.chdir(dir);

            try {
                const opts = Application.getDefaultOptions();
                const prepared = service.prepareTasks(opts);

                expect(prepared[0].name).toEqual('Initializing NPM Project');
                expect(prepared[1].name).toEqual('Installing NPM Packages');
                expect((prepared[1] as NpmTask).npmPackages).toEqual(EXPECT_DEFAULT_NPM_PACKAGES);
                expect(prepared[2].name).toEqual('Creating the Stimulus TypeScript environment');
                expect(prepared[3].name).toEqual('Creating the Oxlint environment');
                expect(prepared[4].name).toEqual('Adding NPM scripts to package.json');
                expect((prepared[4] as NpmScriptsTask).npmScripts).toEqual(EXPECT_DEFAULT_NPM_SCRIPTS);
                expect(prepared[5].name).toEqual('Adding Git Ignore Statements');
                expect((prepared[5] as GitIgnoreTask).gitIgnore).toEqual(['/node_modules/', '/assets/controllers/']);
                expect(prepared[6].name).toEqual('Adding Symfony Local Commands');
                expect((prepared[6] as SymfonyLocalCommandsTask).symfonyLocalCommands).toEqual({
                    'vite-stimulus': ["cmd: ['npm', 'run', 'build:stimulus:watch']"],
                });
            } finally {
                process.chdir(originalCwd);
                fs.rmSync(dir, { recursive: true, force: true });
            }
        });

        it('skips npm init when package.json exists (only stimulus selected)', () => {
            const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-symfony-fe-app-'));
            process.chdir(dir);

            fs.writeFileSync(path.join(dir, 'package.json'), '{"name":"x"}\n', 'utf-8');
            try {
                const opts = Application.getDefaultOptions();
                for (const o of opts) {
                    o.selected = o.taskId === 'typescript-stimulus-controllers';
                }
                const names = service.prepareTasks(opts).map((t) => t.name);
                expect(names[0]).toBe('Installing NPM Packages');
            } finally {
                process.chdir(originalCwd);
                fs.rmSync(dir, { recursive: true, force: true });
            }
        });
    });
});
