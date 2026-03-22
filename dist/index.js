#! /usr/bin/env node
//#region src/service/console-service.ts
var ConsoleService = class {
	printRgbColor(fgColor, bgColor, message) {
		const fgColorCode = this.getRgbColor(fgColor);
		const bgColorCode = bgColor ? this.getRgbColor(bgColor, true) : "";
		const resetCode = this.getResetSequence();
		console.log(`${bgColorCode}${fgColorCode}${message}${resetCode}`);
	}
	printFormattedRgbColor(fgRgb, bgRgb, message) {
		const resetCode = this.getResetSequence();
		console.log(`${bgRgb || ""}${fgRgb}${message}${resetCode}`);
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
			primary: this.getHexColor("#3289cb"),
			secondary: this.getHexColor("#0fd374"),
			tertiary: this.getHexColor("#e5ec6f"),
			text: this.getHexColor("#bababa"),
			textBright: this.getHexColor("#FFFFFF"),
			bgSelected: this.getHexColor("#7f868b", true)
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
//#region src/application.ts
var Application = class {
	constructor() {
		this.selectedIndex = 0;
		this.version = new VersionService().getVersion();
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
		this.console.printFormattedRgbColor(t, null, "  Choose the components you want to add to your symfony application:\n");
		console.log(`${t}  Use ${s}↑${t} and ${s}↓${t} to navigate, ${s}Space${t} to select/deselect, and ${s}Enter${t} to confirm your choices.\n${r}`);
	}
	printOptions() {
		const T = this.p.textBright;
		const t = this.p.tertiary;
		const p = this.p.primary;
		const bg = this.p.bgSelected;
		const r = this.console.getResetSequence();
		this.options.forEach((option, index) => {
			console.log(`${T}  [${this.selectedIndex === index ? bg : ""}${option.selected ? t + "■" + T : " "}${r}${T}] ${p}${option.name}`);
		});
		console.log("");
	}
	getDefaultOptions() {
		return [
			{
				name: "TypeScript StimulusJS Controlleres",
				selected: true
			},
			{
				name: "TypeScript React Components",
				selected: false
			},
			{
				name: "TailwindCSS",
				selected: false
			},
			{
				name: "OxLint / OxFormat",
				selected: true
			}
		];
	}
};
//#endregion
//#region src/index.ts
var app = new Application();
app.printWelcomeMessage();
app.printOptions();
//#endregion
