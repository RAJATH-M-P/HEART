import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { reportService } from '../services/reportService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileText, ChevronRight, Calendar, Activity } from 'lucide-react';

export default function ReportsHistoryPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportService.getReports();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

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
            <h1 className="section-title">Analysis History</h1>
            <p className="section-subtitle">All your past medical report analyses.</p>
          </motion.div>

          <div className="glass-card overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700/50 bg-slate-800/30 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div className="col-span-4 pl-2">Report File</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-3">Detected Condition</div>
              <div className="col-span-2">Organ</div>
              <div className="col-span-1 text-right pr-4">Action</div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : reports.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {reports.map((report, index) => (
                  <motion.div 
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      to={`/reports/${report.id}`}
                      className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    >
                      <div className="col-span-4 flex items-center gap-3 pl-2">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                          <FileText size={16} className="text-blue-400" />
                        </div>
                        <span className="font-medium text-slate-200 truncate pr-4" title={report.fileName}>
                          {report.fileName}
                        </span>
                      </div>
                      
                      <div className="col-span-2 flex items-center gap-2 text-sm text-slate-400">
                        <Calendar size={14} />
                        {new Date(report.uploadDate).toLocaleDateString()}
                      </div>
                      
                      <div className="col-span-3 text-sm pr-4">
                        <span className={`inline-block truncate w-full ${report.conditionCode === 'NORMAL' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {report.condition || 'Pending'}
                        </span>
                      </div>
                      
                      <div className="col-span-2 flex items-center gap-2 text-sm text-slate-400">
                        <Activity size={14} className="text-cyan-400" />
                        {report.organ || 'Heart'}
                      </div>
                      
                      <div className="col-span-1 text-right pr-4">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 group-hover:bg-blue-500/20 group-hover:text-cyan-400 transition-colors">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                No reports found.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
