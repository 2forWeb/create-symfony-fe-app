#! /usr/bin/env node
//#region src/service/console-service.ts
var ConsoleService = class {
	printRgbColor(fgColor, bgColor, message) {
		const fgColorCode = this.getRgbColor(fgColor);
		const bgColorCode = bgColor ? this.getRgbColor(bgColor, true) : "";
		const resetCode = this.getResetSequence();
		console.log(`${bgColorCode}${fgColorCode}${message}${resetCode}`);
	}
	getRgbColor(color, background = false) {
		return background ? `\x1b[48;2;${color.r};${color.g};${color.b}m` : `\x1b[38;2;${color.r};${color.g};${color.b}m`;
	}
	getHexColor(hex, background = false) {
		const rgb = this.hexToRgb(hex);
		return this.getRgbColor(rgb, background);
	}
	hexToRgb(hex) {
		const bigint = parseInt(hex.replace("#", ""), 16);
		return {
			r: bigint >> 16 & 255,
			g: bigint >> 8 & 255,
			b: bigint & 255
		};
	}
	getResetSequence() {
		return "\x1B[0m";
	}
	getPalette() {
		return {
			primary: this.getHexColor("#0a50b3"),
			secondary: this.getHexColor("#073a18"),
			text: this.getHexColor("#bababa"),
			textBright: this.getHexColor("#FFFFFF")
		};
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
var consoleService = new ConsoleService();
var p = consoleService.getPalette();
var r = consoleService.getResetSequence();
console.log(`\n${p.text}  Create Symfony FE App ${p.textBright}- ${p.primary}Version ${version}${r}\n\n`);
//#endregion
