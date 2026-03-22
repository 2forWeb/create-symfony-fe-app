import { ConsoleService } from './service/console-service';
import { VersionService } from './service/version-service';

const versionService = new VersionService();
const version = versionService.getVersion();

const consoleService = new ConsoleService();
const p = consoleService.getPalette();
const r = consoleService.getResetSequence();

console.log(`\n${p.text}  Create Symfony FE App ${p.textBright}- ${p.primary}Version ${version}${r}\n\n`);
