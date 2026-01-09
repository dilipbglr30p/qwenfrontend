import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../App';
import { Button, Card, Badge } from '../components/UI';
import { 
  ArrowLeft, Download, CheckCircle, XCircle, AlertTriangle, 
  RefreshCw, MessageSquare, Eye, FileArchive, Loader2 
} from '../components/Icons';
import { ImageItem } from '../types';

// Feedback Modal Component (internal to keep logic close)
const FeedbackModal = ({ 
  item, 
  onClose, 
  onSubmit 
}: { 
  item: ImageItem; 
  onClose: () => void; 
  onSubmit: (reason: string, notes: string) => void 
}) => {
  const [reason, setReason] = useState('artifact');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800)); // Mock network
    onSubmit(reason, notes);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Issue</h3>
        <div className="space-y-3 mb-4">
          {['Artifacts / Noise', 'Bad Crop', 'Changed Product Color', 'Blurry', 'Other'].map((r) => (
            <label key={r} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700">{r}</span>
            </label>
          ))}
        </div>
        <textarea
          className="w-full p-3 border rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          placeholder="Additional notes (optional)..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} isLoading={submitting}>Submit Feedback</Button>
        </div>
      </div>
    </div>
  );
};

// Preview Modal
const PreviewModal = ({ item, onClose }: { item: ImageItem; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
    <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
      <img src={item.url} alt={item.name} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl" />
      <div className="mt-4 flex gap-4">
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button onClick={() => alert(`Downloading ${item.name}`)}>
          <Download className="w-4 h-4 mr-2" />
          Download Original
        </Button>
      </div>
    </div>
  </div>
);

export const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJobItem } = useData();
  const [job, setJob] = useState(jobs.find(j => j.id === id));
  
  // Modal States
  const [feedbackItem, setFeedbackItem] = useState<ImageItem | null>(null);
  const [previewItem, setPreviewItem] = useState<ImageItem | null>(null);
  
  // Zip Export State
  const [zipState, setZipState] = useState<'idle' | 'preparing' | 'ready'>('idle');

  useEffect(() => {
    setJob(jobs.find(j => j.id === id));
  }, [jobs, id]);

  if (!job) return <div className="p-8 text-center text-slate-500">Job not found</div>;

  const handleAction = (itemId: string, status: 'accept' | 'reject') => {
    updateJobItem(job.id, itemId, { status });
  };

  const handleRerun = async (itemId: string) => {
    // Optimistic update to pending, mock "re-processing"
    updateJobItem(job.id, itemId, { status: 'pending' });
    setTimeout(() => {
        // Random outcome after re-run
        updateJobItem(job.id, itemId, { status: 'accept' });
    }, 2000);
  };

  const handleZipExport = () => {
    if (zipState === 'ready') {
      alert('Downloading ZIP...');
      setZipState('idle');
      return;
    }
    setZipState('preparing');
    setTimeout(() => {
      setZipState('ready');
    }, 2000);
  };

  const completedCount = job.items.filter(i => i.status !== 'pending').length;
  const progress = Math.round((completedCount / job.items.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="px-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">Job #{job.id}</h1>
              <Badge status={job.status} />
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Created {new Date(job.createdAt).toLocaleDateString()} • {job.preset}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant={zipState === 'ready' ? 'primary' : 'outline'}
            onClick={handleZipExport}
            disabled={zipState === 'preparing'}
          >
            {zipState === 'idle' && <><FileArchive className="w-4 h-4 mr-2" /> Export ZIP</>}
            {zipState === 'preparing' && <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Preparing...</>}
            {zipState === 'ready' && <><Download className="w-4 h-4 mr-2" /> Download Ready</>}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Card className="p-4 flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700 w-24">Progress</span>
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-slate-500 w-16 text-right">{progress}%</span>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {job.items.map((item) => (
          <Card key={item.id} className="group overflow-hidden flex flex-col">
            <div className="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setPreviewItem(item)}>
              <img 
                src={item.url} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute top-2 right-2">
                 <Badge status={item.status} />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Eye className="text-white drop-shadow-md w-8 h-8" />
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]" title={item.name}>
                  {item.name}
                </span>
                <button className="text-slate-400 hover:text-primary-500" title="Download single">
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-auto pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                {item.status === 'flag' ? (
                  <>
                    <Button variant="outline" className="text-xs px-2" onClick={() => handleRerun(item.id)}>
                      <RefreshCw className="w-3 h-3 mr-1" /> Re-run
                    </Button>
                    <Button variant="outline" className="text-xs px-2" onClick={() => setFeedbackItem(item)}>
                      <MessageSquare className="w-3 h-3 mr-1" /> Feedback
                    </Button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleAction(item.id, 'accept')}
                      className={`flex items-center justify-center py-2 rounded-md text-xs font-medium transition-colors ${
                        item.status === 'accept' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" /> Accept
                    </button>
                    <button 
                      onClick={() => handleAction(item.id, 'reject')}
                      className={`flex items-center justify-center py-2 rounded-md text-xs font-medium transition-colors ${
                        item.status === 'reject' ? 'bg-red-100 text-red-700' : 'bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-700'
                      }`}
                    >
                      <XCircle className="w-3 h-3 mr-1" /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modals */}
      {feedbackItem && (
        <FeedbackModal 
          item={feedbackItem} 
          onClose={() => setFeedbackItem(null)} 
          onSubmit={(reason, notes) => {
             updateJobItem(job.id, feedbackItem.id, { 
               status: 'flag', // Keep as flag but store feedback
               feedback: { reason, notes } 
             });
          }} 
        />
      )}

      {previewItem && (
        <PreviewModal 
          item={previewItem} 
          onClose={() => setPreviewItem(null)} 
        />
      )}
    </div>
  );
};