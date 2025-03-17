export const SCENE_CONFIG = {
  DEBUG: false,

  START_POSITION: [4, 0.2, 0],

  WORLD_BOUNDS: {
    FORWARD_DISTANCE: 20,
    SIDE_DISTANCE: 3.5,
  },

  GLB: {
    SCENE_PATH: 'models/city/source/untitled1.glb',
    SCALE: 1,
    POSITION: [9, 0.14, 0],
  },

  RENDER: {
    SHADOW_MAP_SIZE: 4096,
    BACKGROUND_COLOR: '#121212',
    FOG_NEAR: 10,
    FOG_FAR: 50,
  },

  PHYSICS: {
    GRAVITY: [0, -20, 0],
    TIME_STEP: 1 / 60,
  },

  LIGHTING: {
    AMBIENT: {
      INTENSITY: 0.3,
      COLOR: '#606070',
    },
    DIRECTIONAL: {
      POSITION: [0, 15, 0],
      INTENSITY: 2.5,
      COLOR: '#F0E5D0',
    },
    SPOT_LIGHT_1: {
      POSITION: [-5, 12, -5],
      ANGLE: 0.5,
      PENUMBRA: 0.8,
      INTENSITY: 1.0,
      COLOR: '#B0A5FF',
    },
    SPOT_LIGHT_2: {
      POSITION: [5, 12, 5],
      ANGLE: 0.6,
      PENUMBRA: 0.8,
      INTENSITY: 0.8,
      COLOR: '#FFD0A0',
    },
    HEMISPHERE: {
      SKY_COLOR: '#5050A0',
      GROUND_COLOR: '#483838',
      INTENSITY: 0.6,
    },
    DEFAULT_SCALE: 0.03,
    DEFAULT_POSITION: [0, -0.5, 0],
    COLLIDER_MIN_SIZE: 0.1,
    WORLD_BOUNDARY_HEIGHT: 10,
    WORLD_BOUNDARY_MARGIN: 2,
    WORLD_BOUNDARY_EXTENSION: 10,
  },
};
