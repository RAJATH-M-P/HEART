import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three';
import * as THREE from 'three';

const MUSCLE = {
  color: '#8b2942',
  roughness: 0.48,
  metalness: 0.04,
  clearcoat: 0.25,
  clearcoatRoughness: 0.35,
  sheen: 0.35,
  sheenRoughness: 0.75,
  sheenColor: '#fda4af',
};

const VESSEL = {
  color: '#b91c3a',
  roughness: 0.32,
  metalness: 0.12,
  clearcoat: 0.45,
  clearcoatRoughness: 0.18,
};

const FAT = {
  color: '#fbbf24',
  roughness: 0.72,
  metalness: 0,
  transparent: true,
  opacity: 0.82,
};

function createMaterial(props, isHighlight) {
  if (isHighlight) {
    return new THREE.MeshPhysicalMaterial({
      color: '#fb7185',
      emissive: '#f43f5e',
      emissiveIntensity: 1.4,
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 0.6,
      transparent: true,
      opacity: 0.95,
    });
  }
  return new THREE.MeshPhysicalMaterial(props);
}

function RegionMesh({ regionId, highlightRegion, geometry, materialProps, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const isHighlighted = highlightRegion === regionId;
  const material = useMemo(
    () => createMaterial(materialProps, isHighlighted),
    [materialProps, isHighlighted]
  );

  useFrame((state) => {
    if (!meshRef.current || !isHighlighted) return;
    material.emissiveIntensity = 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.4;

    if (groupRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
      groupRef.current.scale.set(scale[0] * pulse, scale[1] * pulse, scale[2] * pulse);
    }
  });

  return (
    <group ref={groupRef} name={regionId} position={position} rotation={rotation} scale={scale}>
      <mesh
        ref={meshRef}
        name={`${regionId}_mesh`}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />
    </group>
  );
}

function VesselTube({ regionId, highlightRegion, curve, radius = 0.06 }) {
  const geometry = useMemo(() => new TubeGeometry(curve, 48, radius, 16, false), [curve, radius]);
  return (
    <RegionMesh
      regionId={regionId}
      highlightRegion={highlightRegion}
      geometry={geometry}
      materialProps={VESSEL}
    />
  );
}

export default function AnatomicalHeartModel({ highlightRegion }) {
  const groupRef = useRef();

  const heartBodyGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI * 2;
      const x = 0.58 + 0.4 * Math.pow(Math.sin(t), 3);
      const y =
        0.44 * Math.cos(t) -
        0.18 * Math.cos(2 * t) -
        0.09 * Math.cos(3 * t) -
        0.04 * Math.cos(4 * t);
      points.push(new Vector3(x, y, 0));
    }
    return new THREE.LatheGeometry(points, 72);
  }, []);

  const lvGeometry = useMemo(() => new THREE.SphereGeometry(0.58, 36, 36), []);
  const rvGeometry = useMemo(() => new THREE.SphereGeometry(0.52, 36, 36), []);
  const laGeometry = useMemo(() => new THREE.SphereGeometry(0.44, 32, 32), []);
  const raGeometry = useMemo(() => new THREE.SphereGeometry(0.46, 32, 32), []);
  const septumGeometry = useMemo(() => new THREE.BoxGeometry(0.12, 1.25, 0.58), []);
  const mitralGeometry = useMemo(() => new THREE.TorusGeometry(0.15, 0.028, 14, 36), []);
  const tricuspidGeometry = useMemo(() => new THREE.TorusGeometry(0.14, 0.025, 14, 36), []);
  const aorticValveGeometry = useMemo(() => new THREE.TorusGeometry(0.1, 0.022, 12, 32), []);
  const pulmonaryValveGeometry = useMemo(() => new THREE.TorusGeometry(0.09, 0.02, 12, 32), []);

  const curves = useMemo(
    () => ({
      aorta: new CatmullRomCurve3([
        new Vector3(0.06, 0.58, -0.06),
        new Vector3(0.1, 0.88, -0.1),
        new Vector3(0.14, 1.12, -0.14),
        new Vector3(0.06, 1.38, -0.2),
        new Vector3(-0.06, 1.55, -0.12),
      ]),
      pulmonary: new CatmullRomCurve3([
        new Vector3(-0.16, 0.52, 0.12),
        new Vector3(-0.3, 0.78, 0.14),
        new Vector3(-0.38, 1.02, 0.18),
        new Vector3(-0.28, 1.22, 0.22),
      ]),
      coronary: new CatmullRomCurve3([
        new Vector3(0.12, 0.22, 0.5),
        new Vector3(0.28, 0.38, 0.54),
        new Vector3(0.38, 0.18, 0.48),
        new Vector3(0.22, -0.02, 0.44),
      ]),
      venaCava: new CatmullRomCurve3([
        new Vector3(-0.22, 0.62, -0.16),
        new Vector3(-0.16, 0.98, -0.22),
        new Vector3(-0.1, 1.28, -0.24),
      ]),
    }),
    []
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
    }
  });

  return (
    <group ref={groupRef} scale={1.1}>
      {/* Base myocardium shell */}
      <mesh geometry={heartBodyGeometry} rotation={[0, 0, -0.08]} castShadow receiveShadow>
        <meshPhysicalMaterial {...MUSCLE} />
      </mesh>

      <RegionMesh
        regionId="heart_left_ventricle"
        highlightRegion={highlightRegion}
        geometry={lvGeometry}
        materialProps={MUSCLE}
        position={[0.24, -0.48, 0.1]}
        scale={[0.78, 1.05, 0.74]}
      />

      <RegionMesh
        regionId="heart_right_ventricle"
        highlightRegion={highlightRegion}
        geometry={rvGeometry}
        materialProps={MUSCLE}
        position={[-0.16, -0.32, 0.4]}
        scale={[0.64, 0.88, 0.6]}
      />

      <RegionMesh
        regionId="heart_left_atrium"
        highlightRegion={highlightRegion}
        geometry={laGeometry}
        materialProps={MUSCLE}
        position={[0.36, 0.54, -0.06]}
        scale={[0.44, 0.38, 0.4]}
      />

      <RegionMesh
        regionId="heart_right_atrium"
        highlightRegion={highlightRegion}
        geometry={raGeometry}
        materialProps={MUSCLE}
        position={[-0.34, 0.5, 0.14]}
        scale={[0.42, 0.36, 0.38]}
      />

      <RegionMesh
        regionId="heart_septum"
        highlightRegion={highlightRegion}
        geometry={septumGeometry}
        materialProps={{ ...MUSCLE, color: '#6b2035' }}
        position={[0.02, -0.08, 0.2]}
      />

      <VesselTube regionId="heart_aorta" highlightRegion={highlightRegion} curve={curves.aorta} radius={0.095} />
      <VesselTube regionId="heart_pulmonary_artery" highlightRegion={highlightRegion} curve={curves.pulmonary} radius={0.075} />
      <VesselTube regionId="heart_coronary_arteries" highlightRegion={highlightRegion} curve={curves.coronary} radius={0.038} />

      <RegionMesh
        regionId="heart_mitral_valve"
        highlightRegion={highlightRegion}
        geometry={mitralGeometry}
        materialProps={VESSEL}
        position={[0.2, 0.14, 0.06]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      <RegionMesh
        regionId="heart_tricuspid_valve"
        highlightRegion={highlightRegion}
        geometry={tricuspidGeometry}
        materialProps={VESSEL}
        position={[-0.1, 0.12, 0.3]}
        rotation={[Math.PI / 2, 0, 0.35]}
      />

      <RegionMesh
        regionId="heart_aortic_valve"
        highlightRegion={highlightRegion}
        geometry={aorticValveGeometry}
        materialProps={VESSEL}
        position={[0.1, 0.74, -0.02]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      <RegionMesh
        regionId="heart_pulmonary_valve"
        highlightRegion={highlightRegion}
        geometry={pulmonaryValveGeometry}
        materialProps={VESSEL}
        position={[-0.18, 0.7, 0.12]}
        rotation={[Math.PI / 2, 0, 0.2]}
      />

      {/* Epicardial fat */}
      <mesh position={[0.14, 0.06, 0.52]} scale={[0.38, 0.28, 0.16]} castShadow>
        <sphereGeometry args={[0.5, 20, 20]} />
        <meshStandardMaterial {...FAT} />
      </mesh>

      <VesselTube regionId="heart_vena_cava" highlightRegion={null} curve={curves.venaCava} radius={0.065} />

      {/* Pericardial sac */}
      <group name="heart_pericardium">
        <mesh scale={1.28} receiveShadow>
          <sphereGeometry args={[0.96, 48, 48]} />
          <meshPhysicalMaterial
            color="#1e293b"
            transparent
            opacity={0.07}
            roughness={0.08}
            transmission={0.65}
            thickness={0.25}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {highlightRegion === 'heart_pericardium' && (
          <mesh scale={1.3}>
            <sphereGeometry args={[0.96, 32, 32]} />
            <meshPhysicalMaterial
              color="#fb7185"
              emissive="#f43f5e"
              emissiveIntensity={0.8}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}
