import type { RgbColor } from '../types/color';

export class ConsoleService {
    printRgbColor(fgColor: RgbColor, bgColor: RgbColor | null, message: string ) {
        const fgColorCode = `\x1b[38;2;${fgColor.r};${fgColor.g};${fgColor.b}m`;
        const bgColorCode = bgColor ? `\x1b[48;2;${bgColor.r};${bgColor.g};${bgColor.b}m` : '';
        const resetCode = '\x1b[0m';

        console.log(`${bgColorCode}${fgColorCode}${message}${resetCode}`);
    }
}
