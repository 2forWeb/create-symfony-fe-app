import { BaseTask } from '../tasks/base-task';

export interface Task {
    name: string;
    npmPackages: string[];
    composerPackages: string[];
    tasks: BaseTask[];
    npmScripts?: Record<string, string>;
    gitIgnore?: string[];
    symfonyLocalCommand?: Record<string, string[]>;
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
