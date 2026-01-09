import { Job, Preset, User } from '../types';

export const MOCK_USER: User = {
  id: 'u_123',
  email: 'demo@pixelflow.com',
  name: 'Demo User',
  plan: 'Pro',
  quotaUsed: 120,
  quotaTotal: 1000,
};

export const MOCK_PRESETS: Preset[] = [
  { id: 'p_1', name: 'White BG v2', description: 'Standard e-commerce white background' },
  { id: 'p_2', name: 'Lifestyle Soft Shadow', description: 'Natural lighting with soft floor shadows' },
  { id: 'p_3', name: 'Transparent PNG', description: 'Remove background completely' },
  { id: 'p_4', name: 'Retouch High-Key', description: 'Brighten and smooth surface imperfections' },
];

const generateItems = (count: number, startIndex: number): any[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `img_${startIndex + i}`,
    url: `https://picsum.photos/seed/${startIndex + i}/400/400`,
    name: `product_shot_${startIndex + i}.jpg`,
    status: Math.random() > 0.8 ? 'flag' : (Math.random() > 0.9 ? 'reject' : 'accept'),
  }));
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'job_8821',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    preset: 'White BG v2',
    status: 'completed',
    items: generateItems(12, 100),
  },
  {
    id: 'job_8820',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    preset: 'Transparent PNG',
    status: 'completed',
    items: generateItems(45, 200),
  },
  {
    id: 'job_8819',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    preset: 'Lifestyle Soft Shadow',
    status: 'processing',
    items: Array.from({ length: 8 }).map((_, i) => ({
       id: `img_proc_${i}`,
       url: `https://picsum.photos/seed/proc_${i}/400/400`,
       name: `raw_import_${i}.jpg`,
       status: 'pending'
    })),
  },
];