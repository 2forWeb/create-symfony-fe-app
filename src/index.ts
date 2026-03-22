import { ConsoleService } from './service/console-service';
import { VersionService } from './service/version-service';

const versionService = new VersionService();
const version = versionService.getVersion();

const consoleService = new ConsoleService();
const p = consoleService.getPalette();
const r = consoleService.getResetSequence();

console.log(`\n${p.text}  Create Symfony FE App ${p.textBright}- ${p.primary}Version ${version}${r}\n`);

consoleService.printHexColor(p.text, null, '  Choose the components you want to add to your symfony application:\n');

const options = [
    'TypeScript StimulusJS Controlleres',
    'TypeScript React Components',
    'TailwindCSS',
    'OxLint/OxFormat',
]

options.forEach((option, index) => {
    console.log(`${p.primary}  [${index === 0 ? p.tertiary + '■' + p.primary : ' '}] ${p.textBright}${option}`);
});
