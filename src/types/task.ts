import { BaseTask } from '../tasks/base-task';

export interface Task {
    name: string;
    npmPackages: string[];
    composerPackages: string[];
    tasks: BaseTask[];
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
