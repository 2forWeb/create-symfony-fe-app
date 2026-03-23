#! /usr/bin/env node
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let node_readline = require("node:readline");
node_readline = __toESM(node_readline);
let node_readline_promises = require("node:readline/promises");
node_readline_promises = __toESM(node_readline_promises);
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
			danger: this.getHexColor("#871515"),
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
//#region src/tasks/base-task.ts
var BaseTask = class {
	constructor() {
		this.name = "Base Task";
		this.status = "pending";
		this.errorMessage = "";
		this.c = new ConsoleService();
		this.p = this.c.getPalette();
	}
	async run() {
		try {
			this.status = "running";
			await this.doRun();
			this.status = "completed";
		} catch (error) {
			this.status = "failed";
			this.errorMessage = error.message;
		}
	}
};
//#endregion
//#region src/tasks/npm-task.ts
var NpmTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Installing NPM Packages";
	}
	async doRun() {
		await new Promise((resolve, reject) => setTimeout(() => {
			resolve(void 0);
		}, 1e3));
	}
};
//#endregion
//#region src/service/task-service.ts
var TaskService = class {
	constructor() {
		this.spinnerFrames = [
			"-",
			"\\",
			"|",
			"/"
		];
		this.currentSpinnerStep = 0;
		this.console = new ConsoleService();
		this.p = this.console.getPalette();
	}
	getTasks() {
		return [
			{
				name: "typescript-stimulus-controllers",
				npmPackages: [
					"@symfony/stimulus-bridge",
					"@types/stimulus",
					"stimulus"
				]
			},
			{
				name: "typescript-react-components",
				npmPackages: [
					"@types/react",
					"@types/react-dom",
					"react",
					"react-dom"
				]
			},
			{
				name: "tailwindcss",
				npmPackages: [
					"tailwindcss",
					"postcss",
					"autoprefixer"
				]
			},
			{
				name: "oxlint-oxformat",
				npmPackages: ["oxlint", "oxformat"]
			}
		];
	}
	async queryInstallNpmPackages(npmPackages) {
		const T = this.p.textBright;
		const r = this.console.getResetSequence();
		console.log(`${T}  The following npm packages will be installed:\n\n  ${this.p.primary}${npmPackages.join("\n  ")}\n${r}`);
		if ((await node_readline_promises.createInterface({
			input: process.stdin,
			output: process.stdout
		}).question(`${T}  Are you sure? (y/N) ${r}`)).match(/^y(es)?$/i)) return true;
		console.log(`\n  ${T}Installation cancelled. Exiting.${r}\n`);
		return false;
	}
	prepareTasks(npmPackages, selectedTasks) {
		const npmTask = new NpmTask();
		npmTask.npmPackages = npmPackages;
		for (const task of selectedTasks);
		return [npmTask];
	}
	getSpinnerFrame() {
		const frame = this.spinnerFrames[this.currentSpinnerStep];
		this.currentSpinnerStep = (this.currentSpinnerStep + 1) % this.spinnerFrames.length;
		return frame;
	}
	printTaskStatuses(tasks) {
		const T = this.p.textBright;
		const P = this.p.primary;
		const r = this.console.getResetSequence();
		for (const task of tasks) {
			console.log(`  ${T}[${this.printTaskStatusSymbol(task.status)}${T}] ${P}${task.name}${r}\n`);
			if (task.status === "pending") break;
		}
	}
	printTaskStatusSymbol(status) {
		const P = this.p.primary;
		const S = this.p.secondary;
		const E = this.p.danger;
		const r = this.console.getResetSequence();
		switch (status) {
			case "pending": return " ";
			case "running": return `${P}${this.getSpinnerFrame()}${r}`;
			case "completed": return `${S}✓${r}`;
			case "failed": return `${E}✗${r}`;
			default: return " ";
		}
	}
	async updateTaskStatuses(tasks) {
		const tasksLength = tasks.filter((task) => task.status !== "pending").length;
		node_readline.moveCursor(process.stdout, 0, -(tasksLength + 1));
		this.printTaskStatuses(tasks);
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
		this.tasks = new TaskService();
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
			const isSelectedIndex = this.selectedIndex === index;
			console.log(`${T}  [${isSelectedIndex ? bg : ""}${option.selected ? (isSelectedIndex ? T : t) + "■" + T : " "}${r}${T}] ${p}${option.name}`);
		});
		console.log("");
	}
	updateOptions() {
		node_readline.moveCursor(process.stdout, 0, -(this.options.length + 1));
		this.printOptions();
	}
	startInputLoop() {
		node_readline.emitKeypressEvents(process.stdin);
		if (process.stdin.isTTY) process.stdin.setRawMode(true);
		process.stdin.on("keypress", async (str, key) => {
			if (key.name === "up") {
				this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
				this.updateOptions();
			} else if (key.name === "down") {
				this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
				this.updateOptions();
			} else if (key.name === "space") {
				this.options[this.selectedIndex].selected = !this.options[this.selectedIndex].selected;
				this.updateOptions();
			} else if (key.name === "escape") {
				process.stdin.setRawMode(false);
				process.stdin.removeAllListeners("keypress");
				process.exit(0);
			} else if (key.name === "return") {
				process.stdin.setRawMode(false);
				process.stdin.removeAllListeners("keypress");
				if (!this.options.some((option) => option.selected)) this.noOptionsExit();
				process.stdin.setRawMode(false);
				process.stdin.removeAllListeners("keypress");
				this.showContinueMessage();
				await this.runTasks();
				process.exit(0);
			}
		});
	}
	noOptionsExit() {
		const T = this.p.textBright;
		const r = this.console.getResetSequence();
		console.log(`\n  ${T}You've selected no options. Exiting.${r}\n`);
		process.exit(0);
	}
	showContinueMessage() {
		const T = this.p.textBright;
		const r = this.console.getResetSequence();
		console.log(`  ${T}Installing client...${r}\n`);
	}
	async runTasks() {
		const taskData = this.tasks.getTasks();
		const selectedTasks = this.options.filter((option) => option.selected).map((option) => taskData.find((task) => task.name === option.taskId));
		let npmPackages = [];
		selectedTasks.forEach((task) => {
			if (task) npmPackages.push(...task.npmPackages);
		});
		npmPackages = npmPackages.filter((pkg, index) => npmPackages.indexOf(pkg) === index);
		if (!await this.tasks.queryInstallNpmPackages(npmPackages)) process.exit(0);
		const preparedTasks = this.tasks.prepareTasks(npmPackages, selectedTasks);
		console.log("\n");
		this.tasks.printTaskStatuses(preparedTasks);
		let currentTaskIndex = 0;
		while (preparedTasks.some((task) => task.status !== "completed" && task.status !== "failed")) {
			if (preparedTasks[currentTaskIndex].status === "pending") preparedTasks[currentTaskIndex].run();
			if (preparedTasks[currentTaskIndex].status === "completed") currentTaskIndex++;
			this.tasks.updateTaskStatuses(preparedTasks);
			await new Promise((resolve) => setTimeout(resolve, 100));
		}
		this.tasks.updateTaskStatuses(preparedTasks);
		if (preparedTasks.some((task) => task.status === "failed")) {
			const E = this.p.danger;
			const r = this.console.getResetSequence();
			const errorMessage = preparedTasks.find((task) => task.status === "failed")?.errorMessage || "An error occurred";
			console.log(`\n  ${E}Error: ${errorMessage}${r}\n\n`);
		} else {
			const S = this.p.secondary;
			const r = this.console.getResetSequence();
			console.log(`\n  ${S}All tasks completed successfully!${r}\n\n`);
		}
	}
	getDefaultOptions() {
		return [
			{
				name: "TypeScript StimulusJS Controlleres",
				taskId: "typescript-stimulus-controllers",
				selected: true
			},
			{
				name: "TypeScript React Components",
				taskId: "typescript-react-components",
				selected: false
			},
			{
				name: "TailwindCSS",
				taskId: "tailwindcss",
				selected: false
			},
			{
				name: "OxLint / OxFormat",
				taskId: "oxlint-oxformat",
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
app.startInputLoop();
//#endregion
