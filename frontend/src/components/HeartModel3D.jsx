import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei';
import AnatomicalHeartModel from './heart/AnatomicalHeartModel';

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-slate-400 text-sm animate-pulse">Loading 3D heart...</div>
    </Html>
  );
}

export default function HeartModel3D({ highlightRegion }) {
  return (
    <div className="w-full h-full min-h-[400px] bg-gradient-to-b from-slate-900/80 to-slate-950/90 rounded-xl overflow-hidden border border-slate-700 relative shadow-inner">
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0b1120']} />
        <fog attach="fog" args={['#0b1120', 8, 18]} />

        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#60a5fa" />
        <pointLight position={[0, -2, 4]} intensity={0.3} color="#f43f5e" />

        <Environment preset="city" environmentIntensity={0.4} />

        <OrbitControls
          enablePan={false}
          minDistance={3.2}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.8}
        />

        <Suspense fallback={<LoadingFallback />}>
          <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.35}>
            <AnatomicalHeartModel highlightRegion={highlightRegion} />
          </Float>
        </Suspense>

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.45}
          scale={8}
          blur={2.5}
          far={4}
        />
      </Canvas>

      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <span className="bg-black/50 text-slate-300 text-xs px-3 py-1 rounded-full backdrop-blur-md border border-slate-700/50">
          Drag to rotate • Scroll to zoom
        </span>
      </div>
    </div>
  );
}
