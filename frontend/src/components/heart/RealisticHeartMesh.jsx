import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three';
import * as THREE from 'three';
import { REGION_HIGHLIGHTS } from './heartRegions';

const MUSCLE_COLOR = '#7f1d2e';
const VESSEL_COLOR = '#c41e3a';
const FAT_COLOR = '#fbbf24';

function createMuscleMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: MUSCLE_COLOR,
    roughness: 0.55,
    metalness: 0.05,
    clearcoat: 0.15,
    clearcoatRoughness: 0.4,
    sheen: 0.3,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color('#fda4af'),
  });
}

function createVesselMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: VESSEL_COLOR,
    roughness: 0.35,
    metalness: 0.1,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
  });
}

function createFatMaterial() {
  return new THREE.MeshStandardMaterial({
    color: FAT_COLOR,
    roughness: 0.7,
    metalness: 0,
    transparent: true,
    opacity: 0.85,
  });
}

function RegionHighlight({ regionId, highlightRegion }) {
  const meshRef = useRef();
  const config = REGION_HIGHLIGHTS[regionId];
  const isActive = highlightRegion === regionId;

  useFrame((state) => {
    if (!meshRef.current || !isActive) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
    meshRef.current.scale.set(
      config.scale[0] * pulse,
      config.scale[1] * pulse,
      config.scale[2] * pulse
    );
  });

  if (!config || !isActive) return null;

  return (
    <mesh ref={meshRef} position={config.position}>
      {config.shape === 'sphere' && <sphereGeometry args={[1, 24, 24]} />}
      {config.shape === 'box' && <boxGeometry args={[1, 1, 1]} />}
      {config.shape === 'cylinder' && <cylinderGeometry args={[1, 1, 1, 24]} />}
      <meshPhysicalMaterial
        color="#fb7185"
        emissive="#f43f5e"
        emissiveIntensity={1.2}
        transparent
        opacity={0.55}
        roughness={0.2}
        transmission={0.15}
        thickness={0.5}
      />
    </mesh>
  );
}

function VesselTube({ curve, radius = 0.06, material }) {
  const geometry = useMemo(() => new TubeGeometry(curve, 48, radius, 12, false), [curve, radius]);
  return <mesh geometry={geometry} material={material} />;
}

export default function RealisticHeartMesh({ highlightRegion }) {
  const groupRef = useRef();

  const muscleMaterial = useMemo(() => createMuscleMaterial(), []);
  const vesselMaterial = useMemo(() => createVesselMaterial(), []);
  const fatMaterial = useMemo(() => createFatMaterial(), []);

  const heartBodyGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 32; i++) {
      const t = (i / 32) * Math.PI * 2;
      const x = 0.55 + 0.38 * Math.pow(Math.sin(t), 3);
      const y = 0.42 * Math.cos(t) - 0.16 * Math.cos(2 * t) - 0.08 * Math.cos(3 * t) - 0.03 * Math.cos(4 * t);
      points.push(new Vector3(x, y, 0));
    }
    return new THREE.LatheGeometry(points, 64);
  }, []);

  const curves = useMemo(() => ({
    aorta: new CatmullRomCurve3([
      new Vector3(0.05, 0.55, -0.05),
      new Vector3(0.08, 0.85, -0.08),
      new Vector3(0.12, 1.1, -0.12),
      new Vector3(0.05, 1.35, -0.18),
      new Vector3(-0.05, 1.5, -0.1),
    ]),
    pulmonary: new CatmullRomCurve3([
      new Vector3(-0.15, 0.5, 0.1),
      new Vector3(-0.28, 0.75, 0.12),
      new Vector3(-0.35, 1.0, 0.15),
      new Vector3(-0.25, 1.2, 0.2),
    ]),
    coronary: new CatmullRomCurve3([
      new Vector3(0.1, 0.2, 0.48),
      new Vector3(0.25, 0.35, 0.52),
      new Vector3(0.35, 0.15, 0.45),
      new Vector3(0.2, -0.05, 0.42),
    ]),
    venaCava: new CatmullRomCurve3([
      new Vector3(-0.2, 0.6, -0.15),
      new Vector3(-0.15, 0.95, -0.2),
      new Vector3(-0.1, 1.25, -0.22),
    ]),
  }), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
    }
  });

  return (
    <group ref={groupRef} scale={1.15}>
      {/* Main myocardium */}
      <mesh geometry={heartBodyGeometry} material={muscleMaterial} rotation={[0, 0, -0.08]} />

      {/* Chamber bulges for anatomical depth */}
      <mesh position={[0.22, -0.45, 0.1]} scale={[0.75, 1.0, 0.72]} material={muscleMaterial}>
        <sphereGeometry args={[0.55, 32, 32]} />
      </mesh>
      <mesh position={[-0.15, -0.3, 0.38]} scale={[0.62, 0.85, 0.58]} material={muscleMaterial}>
        <sphereGeometry args={[0.5, 32, 32]} />
      </mesh>
      <mesh position={[0.35, 0.52, -0.05]} scale={[0.42, 0.36, 0.38]} material={muscleMaterial}>
        <sphereGeometry args={[0.45, 32, 32]} />
      </mesh>
      <mesh position={[-0.32, 0.48, 0.12]} scale={[0.4, 0.34, 0.36]} material={muscleMaterial}>
        <sphereGeometry args={[0.44, 32, 32]} />
      </mesh>

      {/* Epicardial fat pads */}
      <mesh position={[0.12, 0.05, 0.5]} scale={[0.35, 0.25, 0.15]} material={fatMaterial}>
        <sphereGeometry args={[0.5, 16, 16]} />
      </mesh>

      {/* Major vessels */}
      <VesselTube curve={curves.aorta} radius={0.09} material={vesselMaterial} />
      <VesselTube curve={curves.pulmonary} radius={0.07} material={vesselMaterial} />
      <VesselTube curve={curves.coronary} radius={0.035} material={vesselMaterial} />
      <VesselTube curve={curves.venaCava} radius={0.06} material={vesselMaterial} />

      {/* Valve ring hints */}
      <mesh position={[0.18, 0.12, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={vesselMaterial}>
        <torusGeometry args={[0.14, 0.025, 12, 32]} />
      </mesh>
      <mesh position={[-0.12, 0.1, 0.28]} rotation={[Math.PI / 2, 0, 0.4]} material={vesselMaterial}>
        <torusGeometry args={[0.13, 0.022, 12, 32]} />
      </mesh>

      {/* Pericardial sac (subtle outer membrane) */}
      <mesh scale={[1.22, 1.22, 1.22]}>
        <sphereGeometry args={[0.95, 48, 48]} />
        <meshPhysicalMaterial
          color="#1e293b"
          transparent
          opacity={0.08}
          roughness={0.1}
          transmission={0.6}
          thickness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Affected region glow overlays */}
      {Object.keys(REGION_HIGHLIGHTS).map((regionId) => (
        <RegionHighlight key={regionId} regionId={regionId} highlightRegion={highlightRegion} />
      ))}
    </group>
  );
}
