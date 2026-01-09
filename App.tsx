import React, { createContext, useContext, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CreateJob } from './pages/CreateJob';
import { JobDetail } from './pages/JobDetail';
import { User, Job, Preset, ImageItem } from './types';
import { MOCK_USER, MOCK_JOBS, MOCK_PRESETS } from './services/mockData';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// --- Data Context (Mock Backend) ---
interface DataContextType {
  jobs: Job[];
  presets: Preset[];
  addJob: (job: Job) => void;
  updateJobItem: (jobId: string, itemId: string, updates: Partial<ImageItem>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};

// --- Main App Component ---
const App = () => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);

  // Data State
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [presets] = useState<Preset[]>(MOCK_PRESETS);

  const login = () => setUser(MOCK_USER);
  const logout = () => setUser(null);

  const addJob = (job: Job) => {
    setJobs(prev => [job, ...prev]);
    // Simulate background processing for new job
    setTimeout(() => {
       setJobs(prev => prev.map(j => {
         if (j.id === job.id) {
           return {
             ...j,
             items: j.items.map(item => ({
               ...item,
               status: Math.random() > 0.7 ? 'flag' : 'accept'
             })),
             status: 'completed'
           }
         }
         return j;
       }))
    }, 5000); // 5 seconds processing time
  };

  const updateJobItem = (jobId: string, itemId: string, updates: Partial<ImageItem>) => {
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job;
      const newItems = job.items.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      );
      // Determine if job is fully complete based on items? (Logic optional for UI)
      return { ...job, items: newItems };
    }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <DataContext.Provider value={{ jobs, presets, addJob, updateJobItem }}>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/create" element={user ? <CreateJob /> : <Navigate to="/login" />} />
                    <Route path="/job/:id" element={user ? <JobDetail /> : <Navigate to="/login" />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </HashRouter>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;