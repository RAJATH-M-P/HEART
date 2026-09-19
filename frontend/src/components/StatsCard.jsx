export default function StatsCard({ title, value, icon: Icon, colorClass, trend }) {
  return (
    <div className="glass-card p-6 flex items-start justify-between relative overflow-hidden group">
      <div>
        <h3 className="text-slate-400 font-medium text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
        
        {trend && (
          <p className="text-xs mt-2 text-emerald-400 flex items-center gap-1">
            <span>↑ {trend}</span> this week
          </p>
        )}
      </div>
      
      <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      
      {/* Decorative gradient blob */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full filter blur-3xl opacity-20 ${colorClass}`}></div>
    </div>
  );
}
