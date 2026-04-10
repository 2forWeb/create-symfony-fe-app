import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Application } from './application';

const REAL_ARGV = [...process.argv];

function setArgv(...extra: string[]) {
    process.argv = ['node', 'create-symfony-fe-app', ...extra];
}

function selectionSnapshot(app: Application) {
    return app.options.map((o) => ({ taskId: o.taskId, selected: o.selected }));
}

describe('Application', () => {
    describe('parseParameters', () => {
        beforeEach(() => {
            vi.spyOn(process, 'exit').mockImplementation((code?: string | number | null) => {
                throw new Error(`process.exit(${code ?? 0})`);
            });
        });

        afterEach(() => {
            vi.restoreAllMocks();

            REAL_ARGV.forEach((v, i) => {
                process.argv[i] = v;
            });

            process.argv.length = REAL_ARGV.length;
        });

        it('leaves options unchanged from defaults when argv has no stack flags', () => {
            setArgv();
            const app = new Application();
            const before = selectionSnapshot(app);

            app.parseParameters();

            expect(selectionSnapshot(app)).toEqual(before);
            expect(selectionSnapshot(app)).toEqual([
                { taskId: 'typescript-stimulus-controllers', selected: true },
                { taskId: 'typescript-react-components', selected: false },
                { taskId: 'tailwindcss', selected: false },
                { taskId: 'oxlint-oxformat', selected: true },
            ]);
            expect(app.noInteractive).toBe(false);
        });

        it('sets noInteractive when --no-interactive is present without changing stack selection', () => {
            setArgv('--no-interactive');
            const app = new Application();

            app.parseParameters();

            expect(app.noInteractive).toBe(true);
            expect(selectionSnapshot(app)).toEqual([
                { taskId: 'typescript-stimulus-controllers', selected: true },
                { taskId: 'typescript-react-components', selected: false },
                { taskId: 'tailwindcss', selected: false },
                { taskId: 'oxlint-oxformat', selected: true },
            ]);
        });

        it('sets noInteractive when -y is present without changing stack selection', () => {
            setArgv('-y');
            const app = new Application();

            app.parseParameters();

            expect(app.noInteractive).toBe(true);
            expect(selectionSnapshot(app)).toEqual([
                { taskId: 'typescript-stimulus-controllers', selected: true },
                { taskId: 'typescript-react-components', selected: false },
                { taskId: 'tailwindcss', selected: false },
                { taskId: 'oxlint-oxformat', selected: true },
            ]);
        });

        it('clears defaults then enables only the stacks passed as a few flags', () => {
            setArgv('--react', '--tailwind');
            const app = new Application();

            app.parseParameters();

            expect(selectionSnapshot(app)).toEqual([
                { taskId: 'typescript-stimulus-controllers', selected: false },
                { taskId: 'typescript-react-components', selected: true },
                { taskId: 'tailwindcss', selected: true },
                { taskId: 'oxlint-oxformat', selected: false },
            ]);
        });

        it('enables every stack when all stack flags are passed', () => {
            setArgv('--stimulus', '--react', '--tailwind', '--oxlint');
            const app = new Application();

            app.parseParameters();

            expect(selectionSnapshot(app)).toEqual([
                { taskId: 'typescript-stimulus-controllers', selected: true },
                { taskId: 'typescript-react-components', selected: true },
                { taskId: 'tailwindcss', selected: true },
                { taskId: 'oxlint-oxformat', selected: true },
            ]);
        });
    
        it('logs an error, lists one unknown flag, and exits with code 1', () => {
            const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            setArgv('--not-a-real-flag');
            const app = new Application();

            expect(() => app.parseParameters()).toThrow(/process\.exit\(1\)/);
            expect(process.exit).toHaveBeenCalledWith(1);
            expect(logSpy).toHaveBeenCalledTimes(1);
            const message = logSpy.mock.calls[0][0] as string;
            expect(message).toMatch(/Error: Unrecognized argument\(s\)/);
            expect(message).toContain('--not-a-real-flag');
            logSpy.mockRestore();
        });

        it('lists every unknown flag when several are passed', () => {
            const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            setArgv('--foo', '--bar', '--baz');
            const app = new Application();

            expect(() => app.parseParameters()).toThrow(/process\.exit\(1\)/);
            expect(process.exit).toHaveBeenCalledWith(1);
            const message = logSpy.mock.calls[0][0] as string;
            expect(message).toContain('--foo');
            expect(message).toContain('--bar');
            expect(message).toContain('--baz');
            logSpy.mockRestore();
        });

        it('rejects argv when any token is invalid, even if other flags are valid', () => {
            const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            setArgv('--react', '--totally-unknown');
            const app = new Application();

            expect(() => app.parseParameters()).toThrow(/process\.exit\(1\)/);
            expect(process.exit).toHaveBeenCalledWith(1);
            const message = logSpy.mock.calls[0][0] as string;
            expect(message).toContain('--totally-unknown');
            expect(message).not.toContain('--react');
            logSpy.mockRestore();
        });
    });
});
