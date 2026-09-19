import React, { useState } from 'react';
import { Upload, Activity, AlertCircle, Heart } from 'lucide-react';

const ReportUpload = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [result, setResult] = useState(null);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    setFile(uploadedFile);
    setStatus('uploading');

    // Simulate API call to the Spring Boot backend
    try {
      // In a real scenario, we'd use FormData to upload to /api/reports/upload
      setTimeout(() => {
        setResult({
          condition: "Left Ventricular Hypertrophy",
          severity: "Mild",
          region: "Left Ventricle",
          summary: "Thickening of the muscular wall of the left ventricle."
        });
        setStatus('success');
      }, 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-red-500 rounded-xl text-white">
            <Heart size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CardioAR Analysis</h1>
            <p className="text-slate-500">Medical Report Anatomical Mapping System</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Upload size={20} /> Upload Medical Report
            </h2>
            
            <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              status === 'uploading' ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
            }`}>
              <input 
                type="file" 
                id="fileInput" 
                className="hidden" 
                onChange={handleFileUpload}
                accept=".pdf,.txt,.jpg,.png"
              />
              <label htmlFor="fileInput" className="cursor-pointer block">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} />
                </div>
                <p className="font-medium">Click to upload report</p>
                <p className="text-sm text-slate-400 mt-1">PDF, TXT, or Scanned Images</p>
              </label>
            </div>

            {status === 'uploading' && (
              <div className="mt-6 flex items-center justify-center gap-2 text-blue-600 animate-pulse">
                <Activity size={18} />
                <span>Analyzing medical terminology...</span>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Activity size={20} /> Analysis Results
            </h2>

            {status === 'idle' && (
              <div className="text-center py-12 text-slate-400">
                <p>Upload a report to see the anatomical mapping</p>
              </div>
            )}

            {status === 'success' && result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Detected Condition</p>
                  <p className="text-lg font-bold text-slate-800">{result.condition}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-500 uppercase">Severity</p>
                    <p className="font-bold text-slate-800">{result.severity}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs font-medium text-slate-500 uppercase">Affected Region</p>
                    <p className="font-bold text-slate-800">{result.region}</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs font-medium text-blue-600 uppercase mb-1">Medical Summary</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-700">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p className="text-xs italic">This visualization is for educational purposes and does not replace professional medical diagnosis.</p>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-12 text-red-500">
                <p>Failed to analyze report. Please try again.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportUpload;
