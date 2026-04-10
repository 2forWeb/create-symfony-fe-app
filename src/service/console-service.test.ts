import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConsoleService } from './console-service';

describe('ConsoleService', () => {
    let service: ConsoleService;

    beforeEach(() => {
        service = new ConsoleService();
    });

    describe('hexToRgb', () => {
        it('parses hex with leading #', () => {
            expect(service.hexToRgb('#3289cb')).toEqual({ r: 50, g: 137, b: 203 });
        });

        it('parses hex without #', () => {
            expect(service.hexToRgb('0fd374')).toEqual({ r: 15, g: 211, b: 116 });
        });

        it('parses black and white', () => {
            expect(service.hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
            expect(service.hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
        });
    });

    describe('getRgbColor', () => {
        it('returns 24-bit foreground ANSI sequence', () => {
            expect(service.getRgbColor({ r: 1, g: 2, b: 3 })).toBe('\x1b[38;2;1;2;3m');
        });

        it('returns 24-bit background ANSI sequence when background is true', () => {
            expect(service.getRgbColor({ r: 10, g: 20, b: 30 }, true)).toBe('\x1b[48;2;10;20;30m');
        });
    });

    describe('getHexColor', () => {
        it('combines hexToRgb and getRgbColor for foreground', () => {
            expect(service.getHexColor('#3289cb')).toBe('\x1b[38;2;50;137;203m');
        });

        it('uses background mode when requested', () => {
            expect(service.getHexColor('#7f868b', true)).toBe('\x1b[48;2;127;134;139m');
        });
    });

    describe('getResetSequence', () => {
        it('returns ANSI reset', () => {
            expect(service.getResetSequence()).toBe('\x1b[0m');
        });
    });

    describe('getPalette', () => {
        it('returns all palette keys with non-empty ANSI strings', () => {
            const palette = service.getPalette();
            expect(palette).toMatchObject({
                primary: expect.any(String),
                secondary: expect.any(String),
                tertiary: expect.any(String),
                danger: expect.any(String),
                text: expect.any(String),
                textBright: expect.any(String),
                bgSelected: expect.any(String),
            });
            for (const value of Object.values(palette)) {
                expect(value.length).toBeGreaterThan(0);
                expect(value.startsWith('\x1b[')).toBe(true);
            }
        });

        it('uses background escape for bgSelected', () => {
            const { bgSelected } = service.getPalette();
            expect(bgSelected.startsWith('\x1b[48;2;')).toBe(true);
        });
    });

    describe('printRgbColor', () => {
        let logSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(() => {
            logSpy.mockRestore();
        });

        it('logs message wrapped with fg, optional bg, and reset', () => {
            service.printRgbColor({ r: 1, g: 2, b: 3 }, { r: 4, g: 5, b: 6 }, 'hello');
            expect(logSpy).toHaveBeenCalledTimes(1);
            expect(logSpy.mock.calls[0][0]).toBe(
                '\x1b[48;2;4;5;6m\x1b[38;2;1;2;3mhello\x1b[0m'
            );
        });

        it('omits background when bg is null', () => {
            service.printRgbColor({ r: 255, g: 0, b: 0 }, null, 'x');
            expect(logSpy.mock.calls[0][0]).toBe('\x1b[38;2;255;0;0mx\x1b[0m');
        });
    });

    describe('printFormattedRgbColor', () => {
        let logSpy: ReturnType<typeof vi.spyOn>;

        beforeEach(() => {
            logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        });

        afterEach(() => {
            logSpy.mockRestore();
        });

        it('concatenates optional bg, fg, message, and reset', () => {
            service.printFormattedRgbColor('\x1b[38;2;1;2;3m', '\x1b[48;2;9;9;9m', 'msg');
            expect(logSpy.mock.calls[0][0]).toBe('\x1b[48;2;9;9;9m\x1b[38;2;1;2;3mmsg\x1b[0m');
        });

        it('skips bg when null', () => {
            service.printFormattedRgbColor('\x1b[38;2;1;2;3m', null, 'msg');
            expect(logSpy.mock.calls[0][0]).toBe('\x1b[38;2;1;2;3mmsg\x1b[0m');
        });
    });
});
