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
let node_child_process = require("node:child_process");
let node_readline_promises = require("node:readline/promises");
node_readline_promises = __toESM(node_readline_promises);
let path = require("path");
let node_fs = require("node:fs");
node_fs = __toESM(node_fs);
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
		await new Promise((resolve, reject) => {
			(0, node_child_process.exec)(`npm install -D ${this.npmPackages?.join(" ")}`, (error, _stdout, stderr) => {
				if (error) reject(/* @__PURE__ */ new Error(`Failed to install npm packages: ${stderr}`));
				else resolve(void 0);
			});
		});
	}
};
//#endregion
//#region src/tasks/npm-init-task.ts
var NpmInitTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Initializing NPM Project";
	}
	async doRun() {
		await new Promise((resolve, reject) => {
			(0, node_child_process.exec)(`npm init -y`, (error, _stdout, stderr) => {
				if (error) reject(/* @__PURE__ */ new Error(`Failed to initialize node project: ${stderr}`));
				else resolve(void 0);
			});
		});
	}
};
//#endregion
//#region src/tasks/composer-task.ts
var ComposerTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Installing Composer Packages";
	}
	async doRun() {
		await new Promise((resolve, reject) => {
			(0, node_child_process.exec)(`composer require ${this.composerPackages?.join(" ")}`, (error, _stdout, stderr) => {
				if (error) reject(/* @__PURE__ */ new Error(`Failed to install composer packages: ${stderr}`));
				else resolve(void 0);
			});
		});
	}
};
//#endregion
//#region src/tasks/tailwind-init-task.ts
var TailwindInitTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Initializing Tailwind";
	}
	async doRun() {
		await new Promise((resolve, reject) => {
			(0, node_child_process.exec)("symfony console tailwind:init", (error, _stdout, stderr) => {
				if (error) reject(/* @__PURE__ */ new Error(`Failed to initialize Tailwind: ${stderr}`));
				else {
					node_fs.default.writeFileSync("assets/styles/app.css", node_fs.default.readFileSync("assets/styles/app.css").toString().replace(/import "tailwindcss"/g, "import 'tailwindcss'"));
					resolve(void 0);
				}
			});
		});
	}
};
//#endregion
//#region src/service/file-asset-service.ts
var FileAssetService = class {
	async generateAssets(assets) {
		const promises = [];
		for (const asset of assets) promises.push(new Promise((r, reject) => {
			if (asset.relativePath !== "./" && !node_fs.default.existsSync((0, path.resolve)(process.cwd(), asset.relativePath))) node_fs.default.mkdirSync((0, path.resolve)(process.cwd(), asset.relativePath), { recursive: true });
			node_fs.default.writeFile((0, path.resolve)(process.cwd(), asset.getFilePath()), asset.getContents(), (error) => {
				if (error) reject(error);
				else r(void 0);
			});
		}));
		await Promise.all(promises);
	}
};
//#endregion
//#region src/skeleton/base-asset.ts
var BaseAsset = class {
	constructor() {
		this.name = "";
		this.relativePath = "";
	}
	getFilePath() {
		return `${this.relativePath}/${this.name}`;
	}
};
//#endregion
//#region src/skeleton/client/controllers/tsconfig_asset.ts
var TsconfigAsset$1 = class extends BaseAsset {
	constructor(..._args) {
		super(..._args);
		this.name = "tsconfig.json";
		this.relativePath = "client/controllers";
	}
	getContents() {
		return JSON.stringify(this.getJsonContents(), null, 2);
	}
	getJsonContents() {
		return {
			compilerOptions: {
				module: "ES2020",
				target: "ES2020",
				allowJs: false,
				noEmit: true,
				moduleResolution: "bundler",
				declaration: false,
				esModuleInterop: true,
				strict: true,
				skipLibCheck: true,
				forceConsistentCasingInFileNames: true,
				noImplicitAny: true,
				removeComments: false,
				preserveConstEnums: true,
				jsx: "react"
			},
			include: ["./**/*.ts"],
			exclude: ["node_modules", "**/*.spec.ts"]
		};
	}
};
//#endregion
//#region src/skeleton/client/controllers/hello_controller_asset.ts
var HelloControllerAsset = class extends BaseAsset {
	constructor(..._args) {
		super(..._args);
		this.name = "hello_controller.ts";
		this.relativePath = "client/controllers";
	}
	getContents() {
		return `import { Controller } from '@hotwired/stimulus';

/*
 * Delete this file once you add controllers here!
 */
export default class extends Controller {
    connect() {
        this.element.textContent = 'Hello Stimulus! Edit me in client/controllers/hello_controller.ts';
    }
}
`;
	}
};
//#endregion
//#region src/skeleton/vite-stimulus-config_asset.ts
var ViteStimulusConfigAsset = class extends BaseAsset {
	constructor(..._args) {
		super(..._args);
		this.name = "vite.stimulus.config.js";
		this.relativePath = "./";
	}
	getContents() {
		return `import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import fg from 'fast-glob';

const entries = fg.sync('client/controllers/**/*.ts');

/** @type {import('vite').UserConfig} */
export default defineConfig({
    root: '.',
    publicDir: false,

    build: {
        rolldownOptions: {
            input: entries,
            external: ['@hotwired/stimulus'],
            tsconfig: 'client/controllers/tsconfig.json',
            preserveEntrySignatures: 'allow-extension',
            output: {
                entryFileNames: '[name].js',
            },
        },
        outDir: 'assets/controllers',
    },

    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: 'client/original-controllers/**/*.js',
                    dest: '.',
                    rename: { stripBase: 2 },
                },
            ],
        }),
    ],
});
`;
	}
};
//#endregion
//#region src/tasks/stimulus-init-task.ts
var StimulusInitTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Creating the Stimulus TypeScript environment";
	}
	async copyOriginalControllers() {
		const sourceRoot = (0, path.resolve)(process.cwd(), "assets/controllers");
		const destinationRoot = (0, path.resolve)(process.cwd(), "client/original-controllers");
		node_fs.default.mkdirSync(destinationRoot, { recursive: true });
		if (!node_fs.default.existsSync(sourceRoot)) return;
		const walk = (sourceDir, relativeDir = "") => {
			const entries = node_fs.default.readdirSync(sourceDir, { withFileTypes: true });
			for (const entry of entries) {
				const sourcePath = (0, path.resolve)(sourceDir, entry.name);
				const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
				const destinationPath = (0, path.resolve)(destinationRoot, relativePath);
				if (entry.name === ".." || entry.name === ".") continue;
				if (entry.isDirectory()) {
					node_fs.default.mkdirSync(destinationPath);
					walk(sourcePath, relativePath);
					continue;
				}
				if (entry.isFile() && entry.name.endsWith(".js")) node_fs.default.copyFileSync(sourcePath, destinationPath);
			}
		};
		walk(sourceRoot);
	}
	async doRun() {
		try {
			const assetManager = new FileAssetService();
			const promises = [];
			promises.push(assetManager.generateAssets([
				new HelloControllerAsset(),
				new TsconfigAsset$1(),
				new ViteStimulusConfigAsset()
			]));
			promises.push(this.copyOriginalControllers());
			await Promise.all(promises);
		} catch (error) {
			this.errorMessage = error.message;
			throw error;
		}
	}
};
//#endregion
//#region src/tasks/npm-scripts-task.ts
var NpmScriptsTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Adding NPM scripts to package.json";
	}
	async doRun() {
		return new Promise((r, reject) => {
			if (!this.npmScripts) {
				r(void 0);
				return;
			}
			const packageJsonPath = (0, path.resolve)(process.cwd(), "package.json");
			if (!node_fs.default.existsSync(packageJsonPath)) throw new Error(`Could not find package.json in ${process.cwd()}`);
			node_fs.default.readFile(packageJsonPath, "utf-8", (err, data) => {
				if (err) reject(/* @__PURE__ */ new Error(`Failed to read package.json: ${err.message}`));
				else {
					const packageJson = JSON.parse(data);
					packageJson.scripts ??= {};
					for (const [scriptName, scriptValue] of Object.entries(this.npmScripts ?? {})) packageJson.scripts[scriptName] = scriptValue;
					const scriptNames = Object.keys(this.npmScripts ?? {});
					const buildStimulusScript = scriptNames.includes("build:stimulus") ? "npm run build:stimulus" : "";
					const buildReactScript = scriptNames.includes("build:react") ? "npm run build:react" : "";
					const connector = buildStimulusScript && buildReactScript ? " && " : "";
					packageJson.scripts["build"] = `${buildStimulusScript} ${connector} ${buildReactScript}`.trim();
					node_fs.default.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, (err) => {
						if (err) reject(/* @__PURE__ */ new Error(`Failed to write package.json: ${err.message}`));
						else r(void 0);
					});
				}
			});
		});
	}
};
//#endregion
//#region src/tasks/git-ignore-task.ts
var GitIgnoreTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Adding Git Ignore Statements";
	}
	async doRun() {
		await new Promise((r, reject) => {
			if (!this.gitIgnore) {
				r(void 0);
				return;
			}
			const gitIgnorePath = (0, path.resolve)(process.cwd(), ".gitignore");
			const fileExists = node_fs.default.existsSync(gitIgnorePath);
			const lines = this.gitIgnore.join("\n");
			const content = fileExists ? `\n${lines}\n` : `${lines}\n`;
			node_fs.default.writeFile(gitIgnorePath, content, fileExists ? { flag: "a" } : {}, (error) => {
				if (error) reject(/* @__PURE__ */ new Error(`Failed to add git ignore statements: ${error.message}`));
				else r(void 0);
			});
		});
	}
};
//#endregion
//#region src/tasks/symfony-local-commands-task.ts
var SymfonyLocalCommandsTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Adding Symfony Local Commands";
	}
	async doRun() {
		await new Promise((r, reject) => {
			if (!this.symfonyLocalCommands) {
				r(void 0);
				return;
			}
			const symfonyLocalCommandsPath = (0, path.resolve)(process.cwd(), ".symfony.local.yaml");
			const fileExists = node_fs.default.existsSync(symfonyLocalCommandsPath);
			const content = fileExists ? this.getSymfonyLocalCommandsContents() : `workers:\n${this.getSymfonyLocalCommandsContents()}`;
			node_fs.default.writeFile(symfonyLocalCommandsPath, content, fileExists ? { flag: "a" } : {}, (error) => {
				if (error) reject(/* @__PURE__ */ new Error(`Failed to add symfony local commands: ${error.message}`));
				else r(void 0);
			});
		});
	}
	getSymfonyLocalCommandsContents() {
		const contents = ["\n"];
		for (const [commandName, commandValue] of Object.entries(this.symfonyLocalCommands ?? {})) {
			contents.push(`    ${commandName}:\n`);
			for (const command of commandValue) contents.push(`        ${command}\n`);
			contents.push("\n");
		}
		return contents.join("");
	}
};
//#endregion
//#region src/skeleton/oxlintrc_asset.ts
var OxlintRcAsset = class extends BaseAsset {
	constructor(..._args) {
		super(..._args);
		this.name = ".oxlintrc.json";
		this.relativePath = "./";
	}
	getContents() {
		return JSON.stringify(this.getJsonContents(), null, 2);
	}
	getJsonContents() {
		return {
			$schema: "./node_modules/oxlint/configuration_schema.json",
			plugins: [
				"oxc",
				"typescript",
				"unicorn",
				"node"
			],
			env: {
				builtin: true,
				browser: true
			},
			ignorePatterns: [
				"**",
				"!client/",
				"!client/**/*.ts",
				"!client/**/*.tsx"
			]
		};
	}
};
//#endregion
//#region src/skeleton/oxfmtrc_asset.ts
var OxfmtRcAsset = class extends BaseAsset {
	constructor(..._args) {
		super(..._args);
		this.name = ".oxfmtrc.json";
		this.relativePath = "./";
	}
	getContents() {
		return JSON.stringify(this.getJsonContents(), null, 2);
	}
	getJsonContents() {
		return {
			$schema: "./node_modules/oxfmt/configuration_schema.json",
			printWidth: 130,
			tabWidth: 4,
			trailingComma: "es5",
			semi: true,
			singleQuote: true
		};
	}
};
//#endregion
//#region src/tasks/oxlint-init-task.ts
var OxLintInitTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Creating the Oxlint environment";
	}
	async doRun() {
		try {
			await new FileAssetService().generateAssets([new OxfmtRcAsset(), new OxlintRcAsset()]);
		} catch (error) {
			this.errorMessage = error.message;
			throw error;
		}
	}
};
//#endregion
//#region src/skeleton/client/react/tsconfig_asset.ts
var TsconfigAsset = class extends BaseAsset {
	constructor(..._args) {
		super(..._args);
		this.name = "tsconfig.json";
		this.relativePath = "client/react";
	}
	getContents() {
		return JSON.stringify(this.getJsonContents(), null, 2);
	}
	getJsonContents() {
		return {
			compilerOptions: {
				module: "ES2020",
				target: "ES2020",
				allowJs: false,
				moduleResolution: "bundler",
				declaration: false,
				jsx: "react-jsx",
				esModuleInterop: true,
				noEmit: true,
				strict: true,
				skipLibCheck: true,
				forceConsistentCasingInFileNames: true,
				noImplicitAny: true,
				removeComments: false,
				preserveConstEnums: true
			},
			include: ["./**/*.tsx"],
			exclude: ["node_modules", "**/*.spec.ts"]
		};
	}
};
//#endregion
//#region src/skeleton/client/react/hello_asset.ts
var HelloAsset = class extends BaseAsset {
	constructor(..._args) {
		super(..._args);
		this.name = "Hello.tsx";
		this.relativePath = "client/react";
	}
	getContents() {
		return `import React from 'react';

export default function Hello() {
    return <h1>Hello World!</h1>;
}
`;
	}
};
//#endregion
//#region src/skeleton/vite-react-config_asset.ts
var ViteReactConfigAsset = class extends BaseAsset {
	constructor(..._args) {
		super(..._args);
		this.name = "vite.react.config.js";
		this.relativePath = "./";
	}
	getContents() {
		return `import { defineConfig } from 'vite';
import fg from 'fast-glob';

const entries = fg.sync('client/react/**/*.tsx');

export default defineConfig({
    root: '.',
    publicDir: false,

    build: {
        rolldownOptions: {
            input: entries,
            external: ['react'],
            tsconfig: 'client/react/tsconfig.json',
            preserveEntrySignatures: 'allow-extension',
            output: {
                entryFileNames: '[name].js',
            },
            treeshake: false,
        },
        outDir: 'assets/react/controllers',
    },
});
`;
	}
};
//#endregion
//#region src/tasks/react-init-task.ts
var ReactInitTask = class extends BaseTask {
	constructor(..._args) {
		super(..._args);
		this.name = "Creating the React TypeScript environment";
	}
	async doRun() {
		try {
			await new FileAssetService().generateAssets([
				new HelloAsset(),
				new TsconfigAsset(),
				new ViteReactConfigAsset()
			]);
		} catch (error) {
			this.errorMessage = error.message;
			throw error;
		}
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
		this.tasksDisplayed = 0;
		this.console = new ConsoleService();
		this.p = this.console.getPalette();
	}
	getTasks() {
		return [
			{
				name: "tailwindcss",
				composerPackages: ["symfonycasts/tailwind-bundle"],
				npmPackages: [],
				tasks: [new TailwindInitTask()],
				symfonyLocalCommand: { "tailwind": ["cmd: ['symfony', 'console', 'tailwind:build', '--watch']"] }
			},
			{
				name: "typescript-stimulus-controllers",
				composerPackages: [],
				npmPackages: ["@hotwired/stimulus", "typescript"],
				tasks: [new StimulusInitTask()],
				npmScripts: {
					"build:stimulus": "node ./node_modules/.bin/vite build --config vite.stimulus.config.js",
					"build:stimulus:watch": "node ./node_modules/.bin/vite build --config vite.stimulus.config.js --watch",
					"typecheck:stimulus": "tsc --project client/controllers/tsconfig.json --noEmit"
				},
				gitIgnore: ["/assets/controllers/"],
				symfonyLocalCommand: { "vite-stimulus": ["cmd: ['npm', 'run', 'build:stimulus:watch']"] }
			},
			{
				name: "typescript-react-components",
				composerPackages: ["symfony/ux-react"],
				npmPackages: ["@types/react@18", "react@18"],
				tasks: [new ReactInitTask()],
				npmScripts: {
					"build:react": "node ./node_modules/.bin/vite build --config vite.react.config.js",
					"build:react:watch": "node ./node_modules/.bin/vite build --config vite.react.config.js --watch",
					"typecheck:react": "tsc --project client/react/tsconfig.json --noEmit"
				},
				gitIgnore: ["/assets/react/"],
				symfonyLocalCommand: { "vite-react": ["cmd: ['npm', 'run', 'build:react:watch']"] }
			},
			{
				name: "oxlint-oxformat",
				composerPackages: [],
				npmPackages: ["oxlint", "oxfmt"],
				tasks: [new OxLintInitTask()],
				npmScripts: {
					lint: "oxlint && npm run fmt",
					fmt: "oxfmt --check client/**/*.ts client/**/*.tsx assets/styles/**/*.css",
					"fmt:fix": "oxfmt client/**/*.ts client/**/*.tsx assets/styles/**/*.css"
				}
			}
		];
	}
	async queryInstallNpmPackages(options) {
		const T = this.p.textBright;
		const r = this.console.getResetSequence();
		const npmPackages = this.getNpmPackages(options);
		if (npmPackages.length === 0) return true;
		console.log(`${T}  The following npm packages will be installed:\n\n  ${this.p.primary}${npmPackages.join(", ")}\n${r}`);
		if ((await node_readline_promises.createInterface({
			input: process.stdin,
			output: process.stdout
		}).question(`${T}  Are you sure? (y/N) ${r}`)).match(/^y(es)?$/i)) return true;
		console.log(`\n  ${T}Installation cancelled. Exiting.${r}\n`);
		return false;
	}
	async queryInstallComposerPackages(options) {
		const T = this.p.textBright;
		const r = this.console.getResetSequence();
		const composerPackages = this.getComposerPackages(options);
		if (composerPackages.length === 0) return true;
		console.log(`\n${T}  The following composer packages will be installed:\n\n  ${this.p.primary}${composerPackages.join(", ")}\n${r}`);
		if ((await node_readline_promises.createInterface({
			input: process.stdin,
			output: process.stdout
		}).question(`${T}  Are you sure? (y/N) ${r}`)).match(/^y(es)?$/i)) return true;
		console.log(`\n  ${T}Installation cancelled. Exiting.${r}\n`);
		return false;
	}
	prepareTasks(options) {
		const composerPackages = this.getComposerPackages(options);
		const npmPackages = this.getNpmPackages(options);
		const npmScripts = this.getNpmScripts(options);
		const gitIgnoreStatements = this.getGitIgnoreStatements(options);
		const symfonyLocalCommands = this.getSymfonyLocalCommands(options);
		const installTasks = [];
		if (composerPackages.length > 0) {
			const composerTask = new ComposerTask();
			composerTask.composerPackages = composerPackages;
			installTasks.push(composerTask);
		}
		if (npmPackages.length > 0) {
			const npmTask = new NpmTask();
			npmTask.npmPackages = npmPackages;
			installTasks.push(npmTask);
		}
		const mutateTasks = [];
		for (const task of this.getSelectedTasks(options)) mutateTasks.push(...task.tasks);
		const npmScriptsTask = Object.keys(npmScripts).length > 0 ? new NpmScriptsTask() : null;
		if (npmScriptsTask) npmScriptsTask.npmScripts = npmScripts;
		const gitIgnoreTask = gitIgnoreStatements.length > 0 ? new GitIgnoreTask() : null;
		if (gitIgnoreTask) gitIgnoreTask.gitIgnore = gitIgnoreStatements;
		const symfonyLocalCommandsTask = Object.keys(symfonyLocalCommands).length > 0 ? new SymfonyLocalCommandsTask() : null;
		if (symfonyLocalCommandsTask) symfonyLocalCommandsTask.symfonyLocalCommands = symfonyLocalCommands;
		return [
			...this.shouldInitializeNpm() ? [new NpmInitTask()] : [],
			...installTasks,
			...mutateTasks,
			...npmScriptsTask ? [npmScriptsTask] : [],
			...gitIgnoreTask ? [gitIgnoreTask] : [],
			...symfonyLocalCommandsTask ? [symfonyLocalCommandsTask] : []
		];
	}
	shouldInitializeNpm() {
		return !(0, node_fs.existsSync)((0, path.resolve)(process.cwd(), "package.json"));
	}
	getComposerPackages(options) {
		const selectedTasks = this.getSelectedTasks(options);
		const composerPackages = [];
		selectedTasks.forEach((task) => {
			if (task) composerPackages.push(...task.composerPackages);
		});
		return composerPackages.filter((pkg, index) => composerPackages.indexOf(pkg) === index);
	}
	getNpmPackages(options) {
		const selectedTasks = this.getSelectedTasks(options);
		const npmPackages = [
			"vite",
			"vite-plugin-static-copy",
			"fast-glob"
		];
		selectedTasks.forEach((task) => {
			if (task) npmPackages.push(...task.npmPackages);
		});
		return npmPackages.filter((pkg, index) => npmPackages.indexOf(pkg) === index);
	}
	getNpmScripts(options) {
		const selectedTasks = this.getSelectedTasks(options);
		let npmScripts = {};
		selectedTasks.forEach((task) => {
			if (task.npmScripts) npmScripts = {
				...npmScripts,
				...task.npmScripts
			};
		});
		return npmScripts;
	}
	getGitIgnoreStatements(options) {
		const selectedTasks = this.getSelectedTasks(options);
		const gitIgnoreStatements = [];
		selectedTasks.forEach((task) => {
			if (task.gitIgnore) gitIgnoreStatements.push(...task.gitIgnore);
		});
		return gitIgnoreStatements;
	}
	getSymfonyLocalCommands(options) {
		const selectedTasks = this.getSelectedTasks(options);
		let symfonyLocalCommands = {};
		selectedTasks.forEach((task) => {
			if (task.symfonyLocalCommand) symfonyLocalCommands = {
				...symfonyLocalCommands,
				...task.symfonyLocalCommand
			};
		});
		return symfonyLocalCommands;
	}
	getSelectedTasks(options) {
		const taskData = this.getTasks();
		return options.filter((option) => option.selected).map((option) => taskData.find((task) => task.name === option.taskId));
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
		this.tasksDisplayed = 0;
		for (const task of tasks) {
			console.log(`  ${T}[${this.printTaskStatusSymbol(task.status)}${T}] ${P}${task.name}${r}`);
			this.tasksDisplayed++;
			if (task.status === "pending") break;
		}
		console.log("");
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
		node_readline.moveCursor(process.stdout, 0, -(this.tasksDisplayed + 1));
		this.printTaskStatuses(tasks);
	}
};
//#endregion
//#region src/application.ts
var Application = class {
	constructor() {
		this.selectedIndex = 0;
		this.noInteractive = false;
		this.version = new VersionService().getVersion();
		this.console = new ConsoleService();
		this.p = this.console.getPalette();
		this.options = this.getDefaultOptions();
		this.tasks = new TaskService();
	}
	parseParameters() {
		const d = this.p.danger;
		const r = this.console.getResetSequence();
		const args = process.argv.slice(2);
		const optionsArgs = this.options.map((option) => option.argName);
		const acceptedArgs = [
			"--no-interactive",
			"-y",
			...optionsArgs
		];
		const invalidArgs = args.filter((arg) => !acceptedArgs.includes(arg));
		if (invalidArgs.length > 0) {
			console.log(`\n  ${d}Error: Unrecognized argument(s) ${invalidArgs.join(", ")}${r}\n`);
			process.exit(1);
		}
		if (args.includes("--no-interactive") || args.includes("-y")) this.noInteractive = true;
		let cleanedUp = false;
		args.forEach((arg) => {
			if (optionsArgs.includes(arg)) {
				if (!cleanedUp) {
					cleanedUp = true;
					this.options.forEach((option) => {
						option.selected = false;
					});
				}
				const option = this.options.find((option) => option.argName === arg);
				if (option) option.selected = true;
			}
		});
	}
	printWelcomeMessage() {
		const r = this.console.getResetSequence();
		const p = this.p.primary;
		const T = this.p.textBright;
		console.log(`\n${T}  Create Symfony FE App - Version ${p}${this.version}${r}\n`);
	}
	printInstructions() {
		const t = this.p.text;
		const s = this.p.secondary;
		const r = this.console.getResetSequence();
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
		this.printOptions();
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
		if (!this.noInteractive && (!await this.tasks.queryInstallNpmPackages(this.options) || !await this.tasks.queryInstallComposerPackages(this.options))) process.exit(0);
		const preparedTasks = this.tasks.prepareTasks(this.options);
		console.log("\n");
		this.tasks.printTaskStatuses(preparedTasks);
		let currentTaskIndex = 0;
		while (preparedTasks.some((task) => task.status !== "completed" && task.status !== "failed") && !preparedTasks.find((task) => task.status === "failed")) {
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
				selected: true,
				argName: "--stimulus"
			},
			{
				name: "TypeScript React Components",
				taskId: "typescript-react-components",
				selected: false,
				argName: "--react"
			},
			{
				name: "TailwindCSS",
				taskId: "tailwindcss",
				selected: false,
				argName: "--tailwind"
			},
			{
				name: "OxLint / OxFormat",
				taskId: "oxlint-oxformat",
				selected: true,
				argName: "--oxlint"
			}
		];
	}
};
//#endregion
//#region src/index.ts
var app = new Application();
app.printWelcomeMessage();
app.parseParameters();
if (app.noInteractive) app.runTasks();
else {
	app.printInstructions();
	app.startInputLoop();
}
//#endregion
