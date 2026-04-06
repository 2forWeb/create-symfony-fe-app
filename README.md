# create-symfony-fe-app

`create-symfony-fe-app` is a Command-line tool that adds a `TypeScript` based frontend scaffolding based on **Vite** to an existing **Symfony** project. This command will create a `client` folder with the following optional elements:

- `TypeScript` `StimlusJS` controllers under `/client/controllers`
- `TypeScript` `React` controllers under `/client/react`
- `tailwindcss` using `symfonycasts/tailwind-bundle`
- `oxlint`/`oxfmt` for linting

Some folders under `assets` will be added to `.gitignore`, tieing it all together with build and typecheck commands based on `Vite` and `tsc`.

## Build command

You will be able to go from `/client` to `/assets` with a build command based on `Vite` to transpile `TypeScript` into files usable by `asset-mapper` in `symfony`. This means that the transpilation proccess is simplistic, and no hashing will be used for file names, so that `asset-mapper` can later `build` these into real `bundle` files in the `public` folder.

## Frontend elements

### TypeScript Stimulus controllers

`client/controllers` will contain your `TypeScript` `StimulusJS` controllers to be compiled into `assets/controllers`.

Since the `/assets/controllers` folder will be gitignored, the original controllers living there, like `csrf_controller.js`, will be copied back from `/asstes` into `/client/original-controllers` where the build process will copy them back into the now gitignored `/assets/controllers` without modification. You can of course manage the contents of this `/client/original-controllers` folder, for example deleting `hello_controller.js` since it's not needed.

### TypeScript React controllers

Using the `symfony/ux-react` package, you will be able to have typehinted `TypeScript` react components under `client/react` which will transpile into the now gitignored folder `/assets/react/controllres`.

### Tailwindcss

This will install the package `symfonycasts/tailwind-bundle` and make your system ready for use with `TailwindCSS`. In this case, no folder will be created in `/client`, as `SASS` or `LESS` are not recommended for use with `tailwind`.

### Oxlint Oxfmt

This option will install `oxlint` and `oxfmt` packages together with a simple setup to have a good `symfony` themed linting on the `TypeScript` files living under `/client`. You will also be able to type-check your client with `tsc` using `npm` commands (recommended for CI).

### Symfony local

The tool will add **`symfony local`** watcher commands where applicable so that your files get built instantly on every change should you use the `symfony serve` command for local development.

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

The application is meant to run from the root folder of your functioning `symfony` application. (best done with a fresh `symfony` install).

```bash
npx create-symfony-fe-app
```

## Interactive mode

Running the command without parameters will start interactive mode where you will see a short welcome message and instructions.

Use **↑** / **↓** to move, **Space** to toggle each stack option and **Enter** to confirm. You can hit **Esc** to quit without doing anything.

> Picking no options will also quit without action.

Once you pick your options, the app wil ask you to confirm installing both needed `npm` and `composer` packages. Type `y` or `yes` to agree and the tasks will start. Any other response will abort the operation.

It then runs the install and file tasks and reports success or failure if anything wrong happens.

## Non-interactive

Use **`--no-interactive`** or **`-y`** to skip the menu and the npm/Composer confirmation prompts. Tasks will run immediately with the default selection of tasks.

Running:

```bash
create-symfony-fe-app --no-interactive
create-symfony-fe-app -y
```

Will install `StimulusJS` controllers and `oxlint`/`oxfmt` setup.

You can change this by specifying in the command line which options you want to enable. This will switch to an "options only" mode where only the specified options will take place:

### Choosing stacks from the CLI

| Flag         | Enables                         |
| ------------ | ------------------------------- |
| `--stimulus` | TypeScript Stimulus controllers |
| `--react`    | TypeScript React components     |
| `--tailwind` | TailwindCSS                     |
| `--oxlint`   | OxLint / OxFormat               |

If you pass **any** of these flags, **only** those stacks will be selected (everything else will be turned off).

Examples:

```bash
# Defaults (Stimulus + OxLint), no prompts
create-symfony-fe-app -y

# Only Tailwind, no prompts
create-symfony-fe-app -y --tailwind

# Multiple stacks, no prompts
create-symfony-fe-app --no-interactive --stimulus --react --tailwind --oxlint
```
