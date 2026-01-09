import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../App';
import { Button, Card, Label } from '../components/UI';
import { UploadCloud, FileArchive, XCircle } from '../components/Icons';

export const CreateJob = () => {
  const navigate = useNavigate();
  const { addJob, presets } = useData();
  const [selectedPreset, setSelectedPreset] = useState(presets[0]?.id || '');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFiles = (newFiles: FileList | null) => {
    if (newFiles) {
      setFiles((prev) => [...prev, ...Array.from(newFiles)]);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setIsSubmitting(true);
    
    // Simulate API upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const presetName = presets.find(p => p.id === selectedPreset)?.name || 'Unknown';
    const newJobId = `job_${Math.floor(Math.random() * 10000)}`;
    
    addJob({
      id: newJobId,
      createdAt: new Date().toISOString(),
      preset: presetName,
      status: 'processing',
      items: files.map((f, i) => ({
        id: `img_new_${newJobId}_${i}`,
        url: `https://picsum.photos/seed/${newJobId}_${i}/400/400`,
        name: f.name,
        status: 'pending' // Initially pending
      }))
    });

    setIsSubmitting(false);
    navigate(`/job/${newJobId}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create New Job</h1>
        <p className="text-slate-500 mt-1">Upload images to begin processing.</p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Preset Selector */}
        <div>
          <Label htmlFor="preset">Processing Preset</Label>
          <select
            id="preset"
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            {presets.find(p => p.id === selectedPreset)?.description}
          </p>
        </div>

        {/* Upload Area */}
        <div>
          <Label>Upload Images</Label>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${
              isDragging ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-4 max-h-60 overflow-y-auto custom-scrollbar">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Selected Files ({files.length})</h4>
            <ul className="space-y-2">
              {files.map((file, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm bg-white p-2 rounded border border-slate-200">
                  <div className="flex items-center truncate">
                    <FileArchive className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
                    <span className="truncate text-slate-700">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 ml-2">
                    <XCircle className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={files.length === 0}
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            Submit Job
          </Button>
        </div>
      </Card>
    </div>
  );
};