import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { reportService } from '../services/reportService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FileUploader from '../components/FileUploader';

export default function UploadPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    setIsUploading(true);
    setError('');
    
    try {
      const report = await reportService.uploadReport(file);
      // Navigate to results page after successful analysis
      navigate(`/reports/${report.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload and analyze report. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 page-container flex gap-8 pt-0">
        <Sidebar />
        
        <main className="flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="section-title">Upload Medical Report</h1>
            <p className="section-subtitle">
              Upload echocardiography or catheterization reports for NLP analysis and AR visualization.
            </p>
          </motion.div>

          {error && (
            <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl">
              {error}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <FileUploader onUpload={handleUpload} isUploading={isUploading} />
          </motion.div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card-static p-6">
              <div className="text-cyan-400 mb-3 font-bold text-xl">01</div>
              <h4 className="text-white font-medium mb-2">Upload Report</h4>
              <p className="text-sm text-slate-400">Securely upload patient medical records in PDF or TXT format.</p>
            </div>
            <div className="glass-card-static p-6">
              <div className="text-cyan-400 mb-3 font-bold text-xl">02</div>
              <h4 className="text-white font-medium mb-2">AI Analysis</h4>
              <p className="text-sm text-slate-400">Our NLP engine extracts conditions, severities, and anatomical regions.</p>
            </div>
            <div className="glass-card-static p-6">
              <div className="text-cyan-400 mb-3 font-bold text-xl">03</div>
              <h4 className="text-white font-medium mb-2">AR Visualization</h4>
              <p className="text-sm text-slate-400">Launch the 3D heart model in Augmented Reality to see the exact affected area.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
