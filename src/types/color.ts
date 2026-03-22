export interface RgbColor {
    r: number;
    g: number;
    b: number;
}

export type HexColor = string;

export interface ColorPalette {
    primary: string;
    secondary: string;
    tertiary: string;
    text: string;
    textBright: string;
}
