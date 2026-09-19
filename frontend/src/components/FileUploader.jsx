import { useState, useRef } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function FileUploader({ onUpload, isUploading }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'text/plain'];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF or TXT file.');
    }
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleUploadSubmit = () => {
    if (file && !isUploading) {
      onUpload(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!file ? (
        <div 
          className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all duration-300 ${
            dragActive 
              ? 'border-cyan-400 bg-cyan-900/10 shadow-[0_0_30px_rgba(6,182,212,0.15)]' 
              : 'border-slate-600 bg-slate-800/30 hover:border-blue-400/50 hover:bg-slate-800/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/80 mb-6 shadow-inner border border-slate-700">
            <UploadCloud size={36} className={dragActive ? 'text-cyan-400' : 'text-slate-400'} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Drag & Drop your Medical Report</h3>
          <p className="text-slate-400 text-sm mb-6 text-center max-w-md">
            Support for PDF echocardiography and catheterization reports, or plain text medical notes.
          </p>
          <button className="btn-secondary pointer-events-none">
            Browse Files
          </button>
        </div>
      ) : (
        <div className="glass-card p-6 flex flex-col items-center">
          <div className="flex items-center gap-4 w-full p-4 bg-slate-800/50 rounded-xl border border-slate-700 mb-6">
            <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400">
              <FileText size={24} />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="font-medium text-slate-200 truncate">{file.name}</h4>
              <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button 
              onClick={clearFile}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-full transition-colors"
              disabled={isUploading}
            >
              <X size={20} />
            </button>
          </div>
          
          <button 
            onClick={handleUploadSubmit} 
            className="btn-primary w-full justify-center"
            disabled={isUploading}
          >
            {isUploading ? 'Analyzing Report with AI...' : 'Analyze Report'}
          </button>
        </div>
      )}
    </div>
  );
}
