import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import StatsCard from '../components/StatsCard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FileText, Activity, AlertTriangle, Plus, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalReports: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          reportService.getStats(),
          reportService.getReports()
        ]);
        setStats(statsData);
        setRecentReports(reportsData.slice(0, 3)); // Get top 3
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
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
            className="mb-8 flex justify-between items-end"
          >
            <div>
              <h1 className="section-title">Welcome, Dr. {user?.fullName?.split(' ')[1] || user?.fullName}</h1>
              <p className="section-subtitle mb-0">Here is your medical analysis overview for today.</p>
            </div>
            
            <Link to="/upload" className="btn-primary">
              <Plus size={18} />
              New Analysis
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatsCard 
              title="Total Analyses" 
              value={stats.totalReports} 
              icon={FileText} 
              colorClass="bg-blue-500" 
              trend="12%"
            />
            <StatsCard 
              title="Conditions Detected" 
              value={recentReports.filter(r => r.conditionCode !== 'NORMAL').length} 
              icon={AlertTriangle} 
              colorClass="bg-rose-500" 
            />
            <StatsCard 
              title="System Status" 
              value="Optimal" 
              icon={Activity} 
              colorClass="bg-emerald-500" 
            />
          </div>

          {/* Recent Reports */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Analyses</h2>
              <Link to="/history" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report, index) => (
                  <motion.div 
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link 
                      to={`/reports/${report.id}`}
                      className="glass-card p-5 flex items-center justify-between hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                          <FileText size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-200">{report.fileName}</h4>
                          <p className="text-sm text-slate-400">
                            {new Date(report.uploadDate).toLocaleDateString()} • {report.organ || 'Heart'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                          <p className={`font-medium ${report.conditionCode === 'NORMAL' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {report.condition || 'Analyzing...'}
                          </p>
                          <p className="text-xs text-slate-500">Result</p>
                        </div>
                        <ChevronRight size={20} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="glass-card-static p-12 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 mb-4">
                  <FileText size={32} className="text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">No analyses yet</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  Upload a medical report to start using the AR Visualization System.
                </p>
                <Link to="/upload" className="btn-primary">
                  Upload First Report
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
