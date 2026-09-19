import { motion } from 'framer-motion';

export default function HeartDiagram({ _affectedRegionCode, unityObjectName }) {
  // Simplified SVG representations of heart regions
  const regions = [
    { id: 'heart_left_ventricle', name: 'Left Ventricle', path: 'M 100 150 Q 80 250 150 280 Q 180 250 160 150 Z' },
    { id: 'heart_right_ventricle', name: 'Right Ventricle', path: 'M 160 150 Q 180 250 220 230 Q 240 180 210 130 Z' },
    { id: 'heart_left_atrium', name: 'Left Atrium', path: 'M 100 150 Q 70 120 100 80 Q 130 90 130 130 Z' },
    { id: 'heart_right_atrium', name: 'Right Atrium', path: 'M 160 130 Q 160 70 210 80 Q 240 110 210 130 Z' },
    { id: 'heart_aorta', name: 'Aorta', path: 'M 130 90 Q 130 20 180 20 Q 200 20 200 40 Q 180 40 160 80 Z' },
    { id: 'heart_pulmonary_artery', name: 'Pulmonary Artery', path: 'M 160 80 Q 180 50 220 50 Q 240 70 210 90 Z' },
    { id: 'heart_septum', name: 'Septum', path: 'M 150 140 L 155 260 L 165 250 L 160 140 Z' },
    { id: 'heart_mitral_valve', name: 'Mitral Valve', path: 'M 110 145 L 140 155' },
    { id: 'heart_tricuspid_valve', name: 'Tricuspid Valve', path: 'M 170 140 L 200 135' },
    { id: 'heart_aortic_valve', name: 'Aortic Valve', path: 'M 140 100 L 160 90' },
    { id: 'heart_pulmonary_valve', name: 'Pulmonary Valve', path: 'M 180 90 L 195 85' },
  ];

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
          {/* Base Heart Silhouette */}
          <path 
            d="M 150 280 C 50 250 50 100 150 50 C 250 100 250 250 150 280 Z" 
            fill="#0f172a" 
            stroke="#1e293b" 
            strokeWidth="4" 
          />
          
          {/* Regions */}
          {regions.map((region) => {
            const isAffected = region.id === unityObjectName;
            const isValve = region.name.includes('Valve');
            
            return (
              <motion.path
                key={region.id}
                d={region.path}
                fill={isValve ? 'none' : (isAffected ? 'rgba(244, 63, 94, 0.4)' : 'rgba(51, 65, 85, 0.4)')}
                stroke={isAffected ? '#fb7185' : (isValve ? '#94a3b8' : '#334155')}
                strokeWidth={isValve ? (isAffected ? '6' : '4') : '2'}
                strokeLinecap="round"
                className={isAffected ? 'pulse-effect' : ''}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ opacity: 0.8 }}
              />
            );
          })}
        </svg>
      </div>
      
      {/* Glow Effect behind */}
      <div className="absolute inset-0 bg-blue-500/5 rounded-full filter blur-3xl -z-10"></div>
    </div>
  );
}
