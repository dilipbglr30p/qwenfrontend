export type PlanType = 'Free' | 'Pro' | 'Agency';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  quotaUsed: number;
  quotaTotal: number;
}

export type JobStatus = 'processing' | 'completed';

export type ItemStatus = 'pending' | 'accept' | 'flag' | 'reject';

export interface ImageItem {
  id: string;
  url: string; // Placeholder URL
  name: string;
  status: ItemStatus;
  feedback?: {
    reason: string;
    notes?: string;
  };
}

export interface Job {
  id: string;
  createdAt: string; // ISO string
  preset: string;
  status: JobStatus;
  items: ImageItem[];
}

export interface Preset {
  id: string;
  name: string;
  description: string;
}

// Mock Data Interfaces
export interface AppState {
  user: User | null;
  jobs: Job[];
  presets: Preset[];
}
