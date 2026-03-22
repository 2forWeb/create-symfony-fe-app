import { ConsoleService } from './service/console-service';
import { VersionService } from './service/version-service';
import { AppOptions } from './types/app-options';
import { ColorPalette } from './types/color';

export class Application {
    console: ConsoleService

    version: string;

    p: ColorPalette;

    options: AppOptions;

    selectedIndex: number = 0;

    constructor() {
        const versionService = new VersionService();
        this.version = versionService.getVersion();
        this.console = new ConsoleService();
        this.p = this.console.getPalette();

        this.options = this.getDefaultOptions();
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
            console.log(`${T}  [${this.selectedIndex === index ? bg : ''}${option.selected ? t + '■' + T : ' '}${r}${T}] ${p}${option.name}`);
        });

        console.log('');
    }

    private getDefaultOptions(): AppOptions {
        return [
            { name: 'TypeScript StimulusJS Controlleres', selected: true },
            { name: 'TypeScript React Components', selected: false },
            { name: 'TailwindCSS', selected: false },
            { name: 'OxLint / OxFormat', selected: true },
        ];
    }
}
