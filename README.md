# create-symfony-fe-app

Command-line tool that adds **Vite-based frontend scaffolding** to an existing **Symfony** project: optional **TypeScript Stimulus** controllers, **TypeScript React** (via Symfony UX React), **Tailwind** (SymfonyCasts bundle), and **OxLint / OxFormat**. It can install the needed **npm** and **Composer** packages, wire **npm** scripts, **`.gitignore`** entries, and **`symfony local`** watcher commands where applicable.

Run it from the **root of your Symfony app** (where `composer.json` lives).

## Installation

Install the application by running:

```bash
npm i --save-dev create-symfony-fe-app
```

or globally by running:

```bash
npm i -g create-symfony-fe-app
```

## How to run

```bash
npx create-symfony-fe-app
```

## Interactive (default)

1. The CLI prints a short welcome and instructions.
2. Use **↑** / **↓** to move, **Space** to toggle each stack option, **Enter** to confirm (**Esc** quits without doing anything).
3. You must pick at least one option; otherwise the tool exits.
4. Before installing packages, it asks **Are you sure? (y/N)** for **npm** and, if needed, **Composer**—answer **`y`** or **`yes`** to proceed.
5. It then runs the install and file tasks and reports success or failure.

## Non-interactive

Use **`--no-interactive`** or **`-y`** to skip the menu and the npm/Composer confirmation prompts. Tasks run immediately with the effective selection (see below).

```bash
create-symfony-fe-app --no-interactive
create-symfony-fe-app -y
```

### Choosing stacks from the CLI

| Flag         | Enables                         |
| ------------ | ------------------------------- |
| `--stimulus` | TypeScript Stimulus controllers |
| `--react`    | TypeScript React components     |
| `--tailwind` | TailwindCSS                     |
| `--oxlint`   | OxLint / OxFormat               |

If you pass **any** of these flags, **only** those flags are selected (everything else is turned off). If you use **`-y` / `--no-interactive`** and pass **no** stack flags, the **defaults** apply: **Stimulus** and **OxLint** on; **React** and **Tailwind** off.

Examples:

```bash
# Defaults (Stimulus + OxLint), no prompts
create-symfony-fe-app -y

# Only Tailwind, no prompts
create-symfony-fe-app -y --tailwind

# Multiple stacks, no prompts
create-symfony-fe-app --no-interactive --stimulus --react --tailwind --oxlint
```
