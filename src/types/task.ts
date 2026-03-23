export interface Task {
    name: string;
    npmPackages: string[];
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
