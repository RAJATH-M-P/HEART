import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { resolveRegionId } from './heartRegions';

const MUSCLE_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: '#7f1d2e',
  roughness: 0.5,
  metalness: 0.05,
  clearcoat: 0.2,
  sheen: 0.25,
  sheenColor: new THREE.Color('#fda4af'),
});

const HIGHLIGHT_MATERIAL = new THREE.MeshPhysicalMaterial({
  color: '#fb7185',
  emissive: '#f43f5e',
  emissiveIntensity: 1.5,
  roughness: 0.15,
  transparent: true,
  opacity: 0.9,
});

function applyMaterials(scene, highlightRegion) {
  scene.traverse((child) => {
    if (!child.isMesh) return;

    const regionId = resolveRegionId(child.name);
    const isHighlighted = regionId && regionId === highlightRegion;

    child.castShadow = true;
    child.receiveShadow = true;
    child.material = isHighlighted ? HIGHLIGHT_MATERIAL.clone() : MUSCLE_MATERIAL.clone();
  });
}

export default function LoadedHeartModel({ url, highlightRegion }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    applyMaterials(clonedScene, highlightRegion);
  }, [clonedScene, highlightRegion]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const highlighted = [];
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material?.emissiveIntensity > 0) {
        highlighted.push(child);
      }
    });

    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.06;
    highlighted.forEach((mesh) => {
      mesh.material.emissiveIntensity = 1.2 * pulse;
    });
  });

  return (
    <group ref={groupRef} scale={2.2} position={[0, -0.2, 0]}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload('/models/heart.glb');
