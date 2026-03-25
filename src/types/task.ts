export interface Task {
    name: string;
    npmPackages: string[];
    composerPackages: string[];
}

export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
