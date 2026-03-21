#! /usr/bin/env node
//#region src/service/console-service.ts
var ConsoleService = class {
	printRgbColor(fgColor, bgColor, message) {
		const fgColorCode = `\x1b[38;2;${fgColor.r};${fgColor.g};${fgColor.b}m`;
		const bgColorCode = bgColor ? `\x1b[48;2;${bgColor.r};${bgColor.g};${bgColor.b}m` : "";
		console.log(`${bgColorCode}${fgColorCode}${message}[0m`);
	}
};
//#endregion
//#region src/service/version-service.ts
var VersionService = class {
	getVersion() {
		return "1.0.0";
	}
};
//#endregion
//#region src/index.ts
var version = new VersionService().getVersion();
new ConsoleService().printRgbColor({
	r: 206,
	g: 80,
	b: 150
}, {
	r: 50,
	g: 50,
	b: 50
}, `Create Symfony FE App - Version ${version}`);
console.log("\n");
//#endregion
