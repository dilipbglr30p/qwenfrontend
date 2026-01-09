import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useData } from '../App';
import { Card, Badge, Button } from '../components/UI';
import { ChevronRight, PlusCircle, AlertTriangle } from '../components/Icons';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
  const { user } = useAuth();
  const { jobs } = useData();
  const navigate = useNavigate();

  // Sort jobs by date
  const sortedJobs = [...jobs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Pie Chart Data
  const data = [
    { name: 'Used', value: user?.quotaUsed || 0 },
    { name: 'Remaining', value: (user?.quotaTotal || 1000) - (user?.quotaUsed || 0) },
  ];
  const COLORS = ['#0ea5e9', '#e2e8f0'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900">Workspace Overview</h1>
        <Button onClick={() => navigate('/create')}>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Job
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quota Card */}
        <Card className="p-6 md:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Monthly Quota</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{user?.quotaUsed} / {user?.quotaTotal}</p>
              <p className="text-sm text-slate-400 mt-1">{user?.plan} Plan</p>
            </div>
            <div className="h-16 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    innerRadius={20}
                    outerRadius={30}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((user?.quotaUsed || 0) / (user?.quotaTotal || 1)) * 100}%` }}
            />
          </div>
        </Card>

        {/* Stats Summary */}
        <Card className="p-6 md:col-span-2 flex items-center justify-around">
           <div className="text-center">
             <p className="text-3xl font-bold text-slate-900">{jobs.length}</p>
             <p className="text-sm text-slate-500 mt-1">Total Jobs</p>
           </div>
           <div className="h-12 w-px bg-slate-100"></div>
           <div className="text-center">
             <p className="text-3xl font-bold text-slate-900">
               {jobs.reduce((acc, job) => acc + job.items.length, 0)}
             </p>
             <p className="text-sm text-slate-500 mt-1">Images Processed</p>
           </div>
           <div className="h-12 w-px bg-slate-100"></div>
           <div className="text-center">
             <p className="text-3xl font-bold text-amber-500">
                {jobs.reduce((acc, job) => acc + job.items.filter(i => i.status === 'flag').length, 0)}
             </p>
             <p className="text-sm text-slate-500 mt-1">Pending Flags</p>
           </div>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Recent Jobs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Job ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Preset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Flags</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedJobs.map((job) => {
                const flagCount = job.items.filter(i => i.status === 'flag').length;
                const completedCount = job.items.filter(i => i.status !== 'pending').length;
                const progress = Math.round((completedCount / job.items.length) * 100);

                return (
                  <tr
                    key={job.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{job.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.preset}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs">{completedCount}/{job.items.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={job.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {flagCount > 0 ? (
                        <span className="inline-flex items-center text-amber-600 font-medium">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {flagCount}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};