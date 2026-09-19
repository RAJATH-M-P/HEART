import { Activity, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalysisCard({ report }) {
  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'severe': return 'badge-danger';
      case 'moderate': return 'badge-warning';
      case 'mild': return 'badge-info';
      default: return 'badge-success';
    }
  };

  const isNormal = report.conditionCode === 'NORMAL';

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-slate-700/50 bg-slate-800/20">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wider">Detected Condition</h3>
            <h2 className={`text-2xl font-bold ${isNormal ? 'text-emerald-400' : 'text-rose-400'}`}>
              {report.condition}
            </h2>
          </div>
          {!isNormal && (
            <span className={`badge ${getSeverityBadge(report.severity)}`}>
              {report.severity || 'Unknown'} Severity
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <FileText size={16} className="text-blue-400" />
            AI Summary
          </h4>
          <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
            {report.summary}
          </p>
        </div>

        {!isNormal && report.keyFindings && (
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              Key Findings
            </h4>
            <ul className="space-y-2">
              {report.keyFindings.split(';').map((finding, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2 text-sm text-slate-400"
                >
                  <ChevronRight size={16} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span>{finding.trim()}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {report.affectedRegion && (
          <div className="pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-400" />
              Anatomical Focus
            </h4>
            <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-lg border border-slate-700">
              <span className="text-white font-medium">{report.affectedRegion}</span>
              <span className="text-xs text-slate-500 font-mono bg-black/50 px-2 py-1 rounded">
                Unity: {report.unityObjectName}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
