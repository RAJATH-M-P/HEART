import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { reportService } from '../services/reportService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import AnalysisCard from '../components/AnalysisCard';
import HeartDiagram from '../components/HeartDiagram';
import { ArrowLeft, Smartphone, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import HeartModel3D from '../components/HeartModel3D';

export default function ReportResultPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [viewMode, setViewMode] = useState('3d');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await reportService.getReport(id);
        setReport(data);
      } catch {
        setError('Failed to load report details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  const handleLaunchAR = () => {
    if (!report) return;
    
    // Construct deep link URI for Unity app
    const deepLinkUrl = `armedviz://ar?condition=${encodeURIComponent(report.conditionCode || '')}&region=${encodeURIComponent(report.unityObjectName || '')}`;
    
    // Simple mobile device check
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Attempt to launch deep link directly on mobile devices
      window.location.href = deepLinkUrl;
      
      // Show alert if it fails
      setTimeout(() => {
        alert("If the AR app didn't open, please ensure the AR Medical Visualization Unity App is installed on your device.");
      }, 1000);
    } else {
      // Show QR code for desktop users to scan with their mobile device
      setQrUrl(deepLinkUrl);
      setShowQR(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-rose-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 page-container flex gap-8 pt-0">
        <Sidebar />
        
        <main className="flex-1">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between"
          >
            <div>
              <Link to="/" className="text-slate-400 hover:text-cyan-400 text-sm flex items-center gap-1 mb-2 transition-colors">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                Analysis Results
                <span className="badge badge-success text-xs">Completed</span>
              </h1>
              <p className="text-slate-400 text-sm">File: {report.fileName}</p>
            </div>
            
            <button onClick={handleLaunchAR} className="btn-primary shadow-lg shadow-blue-500/30">
              <Smartphone size={18} />
              Launch AR View
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: NLP Analysis Data */}
            <motion.div 
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AnalysisCard report={report} />
            </motion.div>

            {/* Right Column: 2D Heart Visualization */}
            <motion.div 
              className="lg:col-span-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-6 h-full flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-full flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
                  <h3 className="font-medium text-slate-300">
                    Affected Region
                  </h3>
                  <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <button 
                      onClick={() => setViewMode('2d')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${viewMode === '2d' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      2D Map
                    </button>
                    <button 
                      onClick={() => setViewMode('3d')}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${viewMode === '3d' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      3D Viewer
                    </button>
                  </div>
                </div>
                
                <div className="w-full flex-1 flex items-center justify-center relative min-h-[300px]">
                  {viewMode === '2d' ? (
                    <HeartDiagram 
                      affectedRegionCode={report.conditionCode} 
                      unityObjectName={report.unityObjectName} 
                    />
                  ) : (
                    <HeartModel3D highlightRegion={report.unityObjectName} />
                  )}
                </div>
                
                {report.affectedRegion ? (
                  <p className="mt-8 text-center text-sm text-slate-400 max-w-xs">
                    The highlighted <span className="text-rose-400 font-semibold">{report.affectedRegion}</span> is the primary region associated with {report.condition}.
                  </p>
                ) : (
                  <p className="mt-8 text-center text-sm text-emerald-400 max-w-xs">
                    No structural abnormalities mapped to specific regions.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
      
      {/* QR Code Modal for Desktop-to-Mobile Handoff */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 max-w-sm w-full relative flex flex-col items-center border border-slate-700 bg-slate-900/90 shadow-2xl"
          >
            <button 
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
            
            <div className="bg-cyan-500/20 p-4 rounded-full mb-4">
              <Smartphone size={32} className="text-cyan-400" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 text-center">Scan to View in AR</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              Scan this QR code with your mobile device's camera to instantly launch the 3D heart visualization.
            </p>
            
            <div className="bg-white p-4 rounded-xl shadow-inner shadow-slate-300">
              <QRCodeSVG value={qrUrl} size={200} level="H" />
            </div>
            
            <p className="text-xs text-slate-500 mt-6 text-center max-w-[250px]">
              Requires the AR Medical Visualization app installed on your Android or iOS device.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
