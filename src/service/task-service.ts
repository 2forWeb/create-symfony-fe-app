import { BaseTask } from '../tasks/base-task';
import { NpmTask } from '../tasks/npm-task';
import { ColorPalette } from '../types/color';
import type { Task } from '../types/task';
import { ConsoleService } from './console-service';
import * as readline from 'node:readline/promises';
import * as readlineSync from 'node:readline';
import { resolve } from 'path';
import { existsSync } from 'node:fs';
import { AppOptions } from '../types/app-options';
import { NpmInitTask } from '../tasks/npm-init-task';
import { ComposerTask } from '../tasks/composer-task';
import { TailwindInitTask } from '../tasks/tailwind-init-task';
import { StimulusInitTask } from '../tasks/stimulus-init-task';
import { NpmScriptsTask } from '../tasks/npm-scripts-task';
import { GitIgnoreTask } from '../tasks/git-ignore-task';
import { SymfonyLocalCommandsTask } from '../tasks/symfony-local-commands-task';
import { OxLintInitTask } from '../tasks/oxlint-init-task';

export class TaskService {
    console: ConsoleService;
    p: ColorPalette;

    spinnerFrames = ['-', '\\', '|', '/'];
    currentSpinnerStep = 0;
    tasksDisplayed = 0;

    constructor() {
        this.console = new ConsoleService();
        this.p = this.console.getPalette();
    }

    getTasks(): Task[] {
        return [
            {
                name: 'typescript-stimulus-controllers',
                composerPackages: [],
                npmPackages: ['@hotwired/stimulus', 'typescript'],
                tasks: [new StimulusInitTask()],
                npmScripts: {
                    'build:stimulus': 'node ./node_modules/.bin/vite build --config vite.stimulus.config.js',
                    'build:stimulus:watch': 'node ./node_modules/.bin/vite build --config vite.stimulus.config.js --watch',
                    'typecheck:stimulus': 'tsc --project client/controllers/tsconfig.json --noEmit',
                },
                gitIgnore: ['assets/controllers'],
                symfonyLocalCommand: {
                    'vite-stimulus': ["cmd: ['npm', 'run','build:stimulus:watch']"],
                },
            },
            {
                name: 'typescript-react-components',
                composerPackages: ['symfony/ux-react'],
                npmPackages: ['@types/react', 'react@18'],
                tasks: [],
                npmScripts: {
                    'build:react': 'node ./node_modules/.bin/vite build --config vite.react.config.js',
                    'build:react:watch': 'node ./node_modules/.bin/vite build --config vite.react.config.js --watch',
                    'typecheck:react': 'tsc --project client/react/tsconfig.json --noEmit',
                },
                gitIgnore: ['assets/react'],
                symfonyLocalCommand: {
                    'vite-react': ["cmd: ['npm', 'run','build:react:watch']"],
                },
                /**
                 * ReactInitTask
                 * ReactViteConfigTask
                 * ReactCreateSkeletonTask
                 */
            },
            {
                name: 'tailwindcss',
                composerPackages: ['symfonycasts/tailwind-bundle'],
                npmPackages: [],
                tasks: [new TailwindInitTask()],
                /**
                 * TailwindFixCssTask ?
                 */
            },
            {
                name: 'oxlint-oxformat',
                composerPackages: [],
                npmPackages: ['oxlint', 'oxfmt'],
                tasks: [new OxLintInitTask()],
                npmScripts: {
                    lint: 'oxlint && npm run fmt',
                    fmt: 'oxfmt --check',
                    'fmt:fix': 'oxfmt',
                },
            },
        ];
    }

    async queryInstallNpmPackages(options: AppOptions) {
        const T = this.p.textBright;
        const r = this.console.getResetSequence();

        const npmPackages = this.getNpmPackages(options);

        if (npmPackages.length === 0) {
            return true;
        }

        console.log(`${T}  The following npm packages will be installed:\n\n  ${this.p.primary}${npmPackages.join(', ')}\n${r}`);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const answer = await rl.question(`${T}  Are you sure? (y/N) ${r}`);

        if (answer.match(/^y(es)?$/i)) {
            return true;
        }

        console.log(`\n  ${T}Installation cancelled. Exiting.${r}\n`);

        return false;
    }

    async queryInstallComposerPackages(options: AppOptions) {
        const T = this.p.textBright;
        const r = this.console.getResetSequence();

        const composerPackages = this.getComposerPackages(options);

        if (composerPackages.length === 0) {
            return true;
        }

        console.log(
            `\n${T}  The following composer packages will be installed:\n\n  ${this.p.primary}${composerPackages.join(', ')}\n${r}`
        );

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const answer = await rl.question(`${T}  Are you sure? (y/N) ${r}`);

        if (answer.match(/^y(es)?$/i)) {
            return true;
        }

        console.log(`\n  ${T}Installation cancelled. Exiting.${r}\n`);

        return false;
    }

    prepareTasks(options: AppOptions): BaseTask[] {
        const composerPackages = this.getComposerPackages(options);
        const npmPackages = this.getNpmPackages(options);
        const npmScripts = this.getNpmScripts(options);
        const gitIgnoreStatements = this.getGitIgnoreStatements(options);
        const symfonyLocalCommands = this.getSymfonyLocalCommands(options);

        const installTasks: BaseTask[] = [];

        if (composerPackages.length > 0) {
            const composerTask = new ComposerTask();
            composerTask.composerPackages = composerPackages;

            installTasks.push(composerTask);
        }

        if (npmPackages.length > 0) {
            const npmTask = new NpmTask();
            npmTask.npmPackages = npmPackages;

            installTasks.push(npmTask);
        }

        const mutateTasks = [];
        for (const task of this.getSelectedTasks(options)) {
            mutateTasks.push(...task.tasks);
        }

        const npmScriptsTask = Object.keys(npmScripts).length > 0 ? new NpmScriptsTask() : null;
        if (npmScriptsTask) {
            npmScriptsTask.npmScripts = npmScripts;
        }

        const gitIgnoreTask = gitIgnoreStatements.length > 0 ? new GitIgnoreTask() : null;
        if (gitIgnoreTask) {
            gitIgnoreTask.gitIgnore = gitIgnoreStatements;
        }

        const symfonyLocalCommandsTask = Object.keys(symfonyLocalCommands).length > 0 ? new SymfonyLocalCommandsTask() : null;
        if (symfonyLocalCommandsTask) {
            symfonyLocalCommandsTask.symfonyLocalCommands = symfonyLocalCommands;
        }

        return [
            ...(this.shouldInitializeNpm() ? [new NpmInitTask()] : []),
            ...installTasks,
            ...mutateTasks,
            ...(npmScriptsTask ? [npmScriptsTask] : []),
            ...(gitIgnoreTask ? [gitIgnoreTask] : []),
            ...(symfonyLocalCommandsTask ? [symfonyLocalCommandsTask] : []),
        ];
    }

    shouldInitializeNpm(): boolean {
        const packagesJsonPath = resolve(process.cwd(), 'package.json');
        return !existsSync(packagesJsonPath);
    }

    getComposerPackages(options: AppOptions): string[] {
        const selectedTasks = this.getSelectedTasks(options);
        const composerPackages: string[] = [];

        selectedTasks.forEach((task) => {
            if (task) {
                composerPackages.push(...task.composerPackages);
            }
        });

        return composerPackages.filter((pkg, index) => composerPackages.indexOf(pkg) === index);
    }

    getNpmPackages(options: AppOptions): string[] {
        const selectedTasks = this.getSelectedTasks(options);
        const npmPackages: string[] = ['vite', 'vite-plugin-static-copy', 'fast-glob'];

        selectedTasks.forEach((task) => {
            if (task) {
                npmPackages.push(...task.npmPackages);
            }
        });

        return npmPackages.filter((pkg, index) => npmPackages.indexOf(pkg) === index);
    }

    getNpmScripts(options: AppOptions): Record<string, string> {
        const selectedTasks = this.getSelectedTasks(options);
        let npmScripts: Record<string, string> = {};

        selectedTasks.forEach((task) => {
            if (task.npmScripts) {
                npmScripts = { ...npmScripts, ...task.npmScripts };
            }
        });

        return npmScripts;
    }

    getGitIgnoreStatements(options: AppOptions): string[] {
        const selectedTasks = this.getSelectedTasks(options);
        const gitIgnoreStatements: string[] = [];

        selectedTasks.forEach((task) => {
            if (task.gitIgnore) {
                gitIgnoreStatements.push(...task.gitIgnore);
            }
        });

        return gitIgnoreStatements;
    }

    getSymfonyLocalCommands(options: AppOptions): Record<string, string[]> {
        const selectedTasks = this.getSelectedTasks(options);
        let symfonyLocalCommands: Record<string, string[]> = {};

        selectedTasks.forEach((task) => {
            if (task.symfonyLocalCommand) {
                symfonyLocalCommands = { ...symfonyLocalCommands, ...task.symfonyLocalCommand };
            }
        });

        return symfonyLocalCommands;
    }

    getSelectedTasks(options: AppOptions): Task[] {
        const taskData = this.getTasks();

        return options
            .filter((option) => option.selected)
            .map((option) => taskData.find((task) => task.name === option.taskId)) as Task[];
    }

    getSpinnerFrame() {
        const frame = this.spinnerFrames[this.currentSpinnerStep];
        this.currentSpinnerStep = (this.currentSpinnerStep + 1) % this.spinnerFrames.length;

        return frame;
    }

    printTaskStatuses(tasks: BaseTask[]) {
        const T = this.p.textBright;
        const P = this.p.primary;
        const r = this.console.getResetSequence();

        this.tasksDisplayed = 0;
        for (const task of tasks) {
            console.log(`  ${T}[${this.printTaskStatusSymbol(task.status)}${T}] ${P}${task.name}${r}`);
            this.tasksDisplayed++;

            if (task.status === 'pending') {
                break;
            }
        }

        console.log('');
    }

    printTaskStatusSymbol(status: string) {
        const P = this.p.primary;
        const S = this.p.secondary;
        const E = this.p.danger;
        const r = this.console.getResetSequence();

        switch (status) {
            case 'pending':
                return ' ';
            case 'running':
                return `${P}${this.getSpinnerFrame()}${r}`;
            case 'completed':
                return `${S}✓${r}`;
            case 'failed':
                return `${E}✗${r}`;
            default:
                return ' ';
        }
    }

    async updateTaskStatuses(tasks: BaseTask[]) {
        readlineSync.moveCursor(process.stdout, 0, -(this.tasksDisplayed + 1));
        this.printTaskStatuses(tasks);
    }
}
