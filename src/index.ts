import { ConsoleService } from './service/console-service';
import { VersionService } from './service/version-service';

const versionService = new VersionService();
const version = versionService.getVersion();

const consoleService = new ConsoleService();

consoleService.printRgbColor(
    { r: 206, g: 80, b: 150 },
    { r: 50, g: 50, b: 50 },
    `Create Symfony FE App - Version ${version}`
);

console.log('\n');
