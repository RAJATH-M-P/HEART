// Anatomical region positions calibrated for the procedural heart model.
// Also used as mesh-name aliases when loading a multi-part GLB model.
export const HEART_REGION_ALIASES = {
  heart_left_ventricle: ['left ventricle', 'left_ventricle', 'lv', 'ventricle_left'],
  heart_right_ventricle: ['right ventricle', 'right_ventricle', 'rv', 'ventricle_right'],
  heart_left_atrium: ['left atrium', 'left_atrium', 'la', 'atrium_left'],
  heart_right_atrium: ['right atrium', 'right_atrium', 'ra', 'atrium_right'],
  heart_aorta: ['aorta', 'aortic'],
  heart_pulmonary_artery: ['pulmonary artery', 'pulmonary_artery', 'pulmonary'],
  heart_mitral_valve: ['mitral valve', 'mitral_valve', 'mitral'],
  heart_tricuspid_valve: ['tricuspid valve', 'tricuspid_valve', 'tricuspid'],
  heart_aortic_valve: ['aortic valve', 'aortic_valve'],
  heart_pulmonary_valve: ['pulmonary valve', 'pulmonary_valve', 'pulmonic'],
  heart_septum: ['septum', 'interventricular', 'interatrial'],
  heart_coronary_arteries: ['coronary', 'coronary artery', 'coronary_arteries', 'coronary arteries'],
  heart_pericardium: ['pericardium', 'pericardial'],
};

export const REGION_HIGHLIGHTS = {
  heart_left_ventricle: { position: [0.22, -0.55, 0.08], scale: [0.75, 1.05, 0.7], shape: 'box' },
  heart_right_ventricle: { position: [-0.18, -0.35, 0.42], scale: [0.6, 0.85, 0.55], shape: 'box' },
  heart_left_atrium: { position: [0.35, 0.55, -0.05], scale: [0.45, 0.4, 0.4], shape: 'sphere' },
  heart_right_atrium: { position: [-0.32, 0.5, 0.12], scale: [0.42, 0.38, 0.38], shape: 'sphere' },
  heart_aorta: { position: [0.05, 1.05, -0.05], scale: [0.22, 0.55, 0.22], shape: 'cylinder' },
  heart_pulmonary_artery: { position: [-0.28, 0.95, 0.08], scale: [0.18, 0.4, 0.18], shape: 'cylinder' },
  heart_mitral_valve: { position: [0.18, 0.12, 0.05], scale: [0.28, 0.08, 0.28], shape: 'cylinder' },
  heart_tricuspid_valve: { position: [-0.12, 0.1, 0.28], scale: [0.26, 0.08, 0.26], shape: 'cylinder' },
  heart_aortic_valve: { position: [0.08, 0.72, -0.02], scale: [0.18, 0.06, 0.18], shape: 'cylinder' },
  heart_pulmonary_valve: { position: [-0.2, 0.68, 0.1], scale: [0.16, 0.06, 0.16], shape: 'cylinder' },
  heart_septum: { position: [0.02, -0.1, 0.18], scale: [0.12, 1.2, 0.55], shape: 'box' },
  heart_coronary_arteries: { position: [0.15, 0.15, 0.52], scale: [0.55, 0.35, 0.12], shape: 'box' },
  heart_pericardium: { position: [0, 0, 0], scale: [1.35, 1.35, 1.35], shape: 'sphere' },
};

export function resolveRegionId(meshName = '') {
  const normalized = meshName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

  for (const [regionId, aliases] of Object.entries(HEART_REGION_ALIASES)) {
    if (normalized === regionId || normalized.includes(regionId.replace('heart_', ''))) {
      return regionId;
    }
    if (aliases.some((alias) => normalized.includes(alias.replace(/ /g, '_')))) {
      return regionId;
    }
  }

  return null;
}
