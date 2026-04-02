export abstract class BaseAsset {
    name = '';
    relativePath = '';

    abstract getContents(): string;

    getFilePath(): string {
        return `${this.relativePath}/${this.name}`;
    }
}
