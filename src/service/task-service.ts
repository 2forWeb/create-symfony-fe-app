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
                npmPackages: ['@hotwired/stimulus', 'typescript'],
            },
            {
                name: 'typescript-react-components',
                npmPackages: ['@types/react', 'react@18'],
            },
            {
                name: 'tailwindcss',
                npmPackages: [],
            },
            {
                name: 'oxlint-oxformat',
                npmPackages: ['oxlint', 'oxfmt'],
            },
        ];
    }

    async queryInstallNpmPackages(options: AppOptions) {
        const T = this.p.textBright;
        const r = this.console.getResetSequence();

        const npmPackages = this.getNpmPackages(options);

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

    prepareTasks(options: AppOptions): BaseTask[] {
        const npmTask = new NpmTask();
        npmTask.npmPackages = this.getNpmPackages(options);

        for (const task of this.getSelectedTasks(options)) {
            // TODO: Add tasks
        }

        return [
            ...(this.shouldInitializeNpm() ? [new NpmInitTask()] : []),
            npmTask,
        ];
    }

    shouldInitializeNpm(): boolean {
        const packagesJsonPath = resolve(process.cwd(), 'package.json');
        return !existsSync(packagesJsonPath);
    }

    getNpmPackages(options: AppOptions): string[] {
        const selectedTasks = this.getSelectedTasks(options);
        const npmPackages: string[] = ['vite', 'vite-plugin-static-copy'];

        selectedTasks.forEach(task => {
            if (task) {
                npmPackages.push(...task.npmPackages);
            }
        });

        return npmPackages.filter((pkg, index) => npmPackages.indexOf(pkg) === index);
    }

    getSelectedTasks(options: AppOptions): Task[] {
        const taskData = this.getTasks();

        return options
            .filter(option => option.selected)
            .map(option => taskData.find((task) => task.name === option.taskId)) as Task[];
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
