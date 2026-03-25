import { ConsoleService } from './service/console-service';
import { VersionService } from './service/version-service';
import { AppOptions } from './types/app-options';
import { ColorPalette } from './types/color';
import * as readline from 'node:readline';
import { TaskService } from './service/task-service';
import { Task } from './types/task';

export class Application {
    console: ConsoleService

    version: string;

    p: ColorPalette;

    options: AppOptions;

    tasks: TaskService;

    selectedIndex: number = 0;

    constructor() {
        const versionService = new VersionService();
        this.version = versionService.getVersion();
        this.console = new ConsoleService();
        this.p = this.console.getPalette();

        this.options = this.getDefaultOptions();
        this.tasks = new TaskService();
    }

    printWelcomeMessage() {
        const r = this.console.getResetSequence();
        const t = this.p.text;
        const p = this.p.primary;
        const s = this.p.secondary;
        const T = this.p.textBright;

        console.log(`\n${T}  Create Symfony FE App - Version ${p}${this.version}${r}\n`);

        this.console.printFormattedRgbColor(t, null, '  Choose the components you want to add to your symfony application:\n');

        console.log(`${t}  Use ${s}↑${t} and ${s}↓${t} to navigate, ${s}Space${t} to select/deselect, and ${s}Enter${t} to confirm your choices.\n${r}`);
    }

    printOptions() {
        const T = this.p.textBright;
        const t = this.p.tertiary;
        const p = this.p.primary;
        const bg = this.p.bgSelected;
        const r = this.console.getResetSequence();

        this.options.forEach((option, index) => {
            const isSelectedIndex = this.selectedIndex === index;
            console.log(`${T}  [${isSelectedIndex ? bg : ''}${option.selected ? (isSelectedIndex ? T : t) + '■' + T : ' '}${r}${T}] ${p}${option.name}`);
        });

        console.log('');
    }

    updateOptions() {
        readline.moveCursor(process.stdout, 0, -(this.options.length + 1));
        this.printOptions();
    }

    startInputLoop() {
        readline.emitKeypressEvents(process.stdin);

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        process.stdin.on('keypress', async (str, key) => {
            if (key.name === 'up') {
                this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
                this.updateOptions();
            } else if (key.name === 'down') {
                this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
                this.updateOptions();
            } else if (key.name === 'space') {
                this.options[this.selectedIndex].selected = !this.options[this.selectedIndex].selected;
                this.updateOptions();
            } else if (key.name === 'escape') {
                process.stdin.setRawMode(false);
                process.stdin.removeAllListeners('keypress');

                process.exit(0);
            } else if (key.name === 'return') {
                process.stdin.setRawMode(false);
                process.stdin.removeAllListeners('keypress');

                if (!this.options.some(option => option.selected)) {
                    this.noOptionsExit();
                }

                process.stdin.setRawMode(false);
                process.stdin.removeAllListeners('keypress');

                this.showContinueMessage();

                await this.runTasks();

                process.exit(0);
            }
        });
    }

    private noOptionsExit() {
        const T = this.p.textBright;
        const r = this.console.getResetSequence();
        
        console.log(`\n  ${T}You've selected no options. Exiting.${r}\n`);
        process.exit(0);
    }

    private showContinueMessage() {
        const T = this.p.textBright;
        const r = this.console.getResetSequence();

        console.log(`  ${T}Installing client...${r}\n`);
    }

    private async runTasks() {
        if (!await this.tasks.queryInstallNpmPackages(this.options) || !await this.tasks.queryInstallComposerPackages(this.options)) {
            process.exit(0);
        }

        const preparedTasks = this.tasks.prepareTasks(this.options);

        console.log('\n');
        this.tasks.printTaskStatuses(preparedTasks);

        let currentTaskIndex = 0;

        while (preparedTasks.some(task => task.status !== 'completed' && task.status !== 'failed') && !preparedTasks.find(task => task.status === 'failed')) {
            if (preparedTasks[currentTaskIndex].status === 'pending') {
                preparedTasks[currentTaskIndex].run();
            }

            if (preparedTasks[currentTaskIndex].status === 'completed') {
                currentTaskIndex++;
            }

            this.tasks.updateTaskStatuses(preparedTasks);

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.tasks.updateTaskStatuses(preparedTasks);

        if (preparedTasks.some(task => task.status === 'failed')) {
            const E = this.p.danger;
            const r = this.console.getResetSequence();

            const errorMessage = preparedTasks.find(task => task.status === 'failed')?.errorMessage || 'An error occurred';

            console.log(`\n  ${E}Error: ${errorMessage}${r}\n\n`);
        } else {
            const S = this.p.secondary;
            const r = this.console.getResetSequence();

            console.log(`\n  ${S}All tasks completed successfully!${r}\n\n`);
        }
    }

    private getDefaultOptions(): AppOptions {
        return [
            { name: 'TypeScript StimulusJS Controlleres', taskId: 'typescript-stimulus-controllers', selected: true },
            { name: 'TypeScript React Components', taskId: 'typescript-react-components', selected: false },
            { name: 'TailwindCSS', taskId: 'tailwindcss', selected: false },
            { name: 'OxLint / OxFormat', taskId: 'oxlint-oxformat', selected: true },
        ];
    }
}
