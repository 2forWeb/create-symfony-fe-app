import { ConsoleService } from '../service/console-service';
import { ColorPalette } from '../types/color';

export abstract class BaseTask {
    name = 'Base Task';
    status = 'pending';
    errorMessage = '';

    c: ConsoleService;
    p: ColorPalette;

    constructor() {
        this.c = new ConsoleService();
        this.p = this.c.getPalette();
    }

    async run(): Promise<void> {
        try {
            this.status = 'running';
            await this.doRun();
            this.status = 'completed';
        } catch (error) {
            this.status = 'failed';
            this.errorMessage = (error as Error).message;
        }
    }

    abstract doRun(): Promise<void>;
}
