export const SKATEBOARD_CONFIG = {
  PHYSICS: {
    HOVER_HEIGHT: 0.15,
    MIN_HEIGHT: -5,
    MASS: {
      RIDING: 5,
      DEFAULT: 2,
    },
    FRICTION: 0.1,
    RESTITUTION: 0,
    DAMPING: {
      LINEAR_RIDING: 3.0,
      LINEAR_DEFAULT: 0.8,
      ANGULAR_RIDING: 3.0,
      ANGULAR_DEFAULT: 0.8,
    },
  },

  VISUAL: {
    LIGHT_COLOR: '#FFFF00',
    BASE_INTENSITY: 0.5,
    PULSE_INTENSITY: 0.3,
    PULSE_SPEED: 3,
    FLOAT_AMPLITUDE: 0.05,
    FLOAT_SPEED: 2,
  },

  MODEL: {
    PATH: '/models/skateboard.glb',
    SCALE: [0.05, 0.05, 0.05],
    POSITION: [0, 0.05, 0],
    ROTATION: [0, Math.PI / 2, 0],
  },

  WORLD_BOUNDS: {
    CENTER_X: 4,
    CENTER_Z: 0,
    SIDE_DISTANCE: 3.5,
    FORWARD_DISTANCE: 20,
    BOUNDARY_MARGIN: 0.01,
  },

  COLLIDER: {
    SIZE: [0.4, 0.1, 0.4],
    DEBUG_SIZE: [0.8, 0.2, 0.3],
  },
};
