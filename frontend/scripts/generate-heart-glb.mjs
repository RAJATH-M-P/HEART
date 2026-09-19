/**
 * Generates a multi-mesh anatomical heart GLB for web + Unity.
 * Run: node scripts/generate-heart-glb.mjs
 */
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, '../public/models/heart.glb');

const MUSCLE = new THREE.MeshPhysicalMaterial({
  color: 0x8b2942,
  roughness: 0.48,
  metalness: 0.04,
});

const VESSEL = new THREE.MeshPhysicalMaterial({
  color: 0xb91c3a,
  roughness: 0.32,
  metalness: 0.12,
});

function createHeartBody() {
  const points = [];
  for (let i = 0; i <= 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const x = 0.58 + 0.4 * Math.pow(Math.sin(t), 3);
    const y = 0.44 * Math.cos(t) - 0.18 * Math.cos(2 * t) - 0.09 * Math.cos(3 * t);
    points.push(new THREE.Vector3(x, y, 0));
  }
  const geo = new THREE.LatheGeometry(points, 64);
  const mesh = new THREE.Mesh(geo, MUSCLE.clone());
  mesh.name = 'heart_myocardium';
  mesh.rotation.z = -0.08;
  return mesh;
}

function createRegion(name, geometry, material, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material.clone());
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  return mesh;
}

function createVessel(name, points, radius) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve, 32, radius, 12, false);
  const mesh = new THREE.Mesh(geo, VESSEL.clone());
  mesh.name = name;
  return mesh;
}

const scene = new THREE.Group();
scene.name = 'heart';

scene.add(createHeartBody());
scene.add(createRegion('heart_left_ventricle', new THREE.SphereGeometry(0.58, 24, 24), MUSCLE, [0.24, -0.48, 0.1], [0.78, 1.05, 0.74]));
scene.add(createRegion('heart_right_ventricle', new THREE.SphereGeometry(0.52, 24, 24), MUSCLE, [-0.16, -0.32, 0.4], [0.64, 0.88, 0.6]));
scene.add(createRegion('heart_left_atrium', new THREE.SphereGeometry(0.44, 24, 24), MUSCLE, [0.36, 0.54, -0.06], [0.44, 0.38, 0.4]));
scene.add(createRegion('heart_right_atrium', new THREE.SphereGeometry(0.46, 24, 24), MUSCLE, [-0.34, 0.5, 0.14], [0.42, 0.36, 0.38]));
scene.add(createRegion('heart_septum', new THREE.BoxGeometry(0.12, 1.25, 0.58), MUSCLE, [0.02, -0.08, 0.2]));
scene.add(createVessel('heart_aorta', [[0.06, 0.58, -0.06], [0.1, 0.88, -0.1], [0.14, 1.12, -0.14], [0.06, 1.38, -0.2]], 0.095));
scene.add(createVessel('heart_pulmonary_artery', [[-0.16, 0.52, 0.12], [-0.3, 0.78, 0.14], [-0.38, 1.02, 0.18]], 0.075));
scene.add(createVessel('heart_coronary_arteries', [[0.12, 0.22, 0.5], [0.28, 0.38, 0.54], [0.38, 0.18, 0.48]], 0.038));
scene.add(createRegion('heart_mitral_valve', new THREE.TorusGeometry(0.15, 0.028, 12, 24), VESSEL, [0.2, 0.14, 0.06], [1, 1, 1], [Math.PI / 2, 0, 0]));
scene.add(createRegion('heart_tricuspid_valve', new THREE.TorusGeometry(0.14, 0.025, 12, 24), VESSEL, [-0.1, 0.12, 0.3], [1, 1, 1], [Math.PI / 2, 0, 0.35]));
scene.add(createRegion('heart_aortic_valve', new THREE.TorusGeometry(0.1, 0.022, 12, 24), VESSEL, [0.1, 0.74, -0.02], [1, 1, 1], [Math.PI / 2, 0, 0]));
scene.add(createRegion('heart_pulmonary_valve', new THREE.TorusGeometry(0.09, 0.02, 12, 24), VESSEL, [-0.18, 0.7, 0.12], [1, 1, 1], [Math.PI / 2, 0, 0.2]));
scene.add(createRegion('heart_pericardium', new THREE.SphereGeometry(0.96, 32, 32), MUSCLE, [0, 0, 0], [1.28, 1.28, 1.28]));

const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    writeFileSync(outputPath, Buffer.from(result));
    console.log(`Generated ${outputPath} (${Buffer.from(result).length} bytes)`);
  },
  (error) => {
    console.error('Export failed:', error);
    process.exit(1);
  },
  { binary: true }
);
