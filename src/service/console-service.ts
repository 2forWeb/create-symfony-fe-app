import type { ColorPalette, RgbColor } from '../types/color';

export class ConsoleService {
    printRgbColor(fgColor: RgbColor, bgColor: RgbColor | null, message: string) {
        const fgColorCode = this.getRgbColor(fgColor);
        const bgColorCode = bgColor ? this.getRgbColor(bgColor, true) : '';
        const resetCode = this.getResetSequence();

        console.log(`${bgColorCode}${fgColorCode}${message}${resetCode}`);
    }

    printFormattedRgbColor(fgRgb: string, bgRgb: string | null, message: string) {
        const resetCode = this.getResetSequence();

        console.log(`${bgRgb || ''}${fgRgb}${message}${resetCode}`);
    }

    getRgbColor(color: RgbColor, background: boolean = false): string {
        return background ? `\x1b[48;2;${color.r};${color.g};${color.b}m` : `\x1b[38;2;${color.r};${color.g};${color.b}m`;
    }

    getHexColor(hex: string, background: boolean = false): string {
        const rgb = this.hexToRgb(hex);
        return this.getRgbColor(rgb, background);
    }

    hexToRgb(hex: string): RgbColor {
        const bigint = parseInt(hex.replace('#', ''), 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    }

    getResetSequence(): string {
        return '\x1b[0m';
    }

    getPalette(): ColorPalette {
        return {
            primary: this.getHexColor('#3289cb'),
            secondary: this.getHexColor('#0fd374'),
            tertiary: this.getHexColor('#e5ec6f'),
            danger: this.getHexColor('#871515'),
            text: this.getHexColor('#bababa'),
            textBright: this.getHexColor('#FFFFFF'),
            bgSelected: this.getHexColor('#7f868b', true),
        };
    }
}
