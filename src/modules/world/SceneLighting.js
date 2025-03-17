import React from 'react';
import { SCENE_CONFIG } from '@/modules/world/config/sceneConfig';

export function SceneLighting({ startPosition }) {
  const { LIGHTING } = SCENE_CONFIG;
  const [startX, startY, startZ] = startPosition;

  return (
    <>
      <ambientLight intensity={LIGHTING.AMBIENT.INTENSITY} color={LIGHTING.AMBIENT.COLOR} />

      <directionalLight
        position={LIGHTING.DIRECTIONAL.POSITION}
        intensity={LIGHTING.DIRECTIONAL.INTENSITY}
        castShadow
        shadow-mapSize-width={SCENE_CONFIG.RENDER.SHADOW_MAP_SIZE}
        shadow-mapSize-height={SCENE_CONFIG.RENDER.SHADOW_MAP_SIZE}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
        shadow-radius={4}
        shadow-normalBias={0.05}
        color={LIGHTING.DIRECTIONAL.COLOR}
      />

      <spotLight
        position={[
          startX + LIGHTING.SPOT_LIGHT_1.POSITION[0],
          LIGHTING.SPOT_LIGHT_1.POSITION[1],
          startZ + LIGHTING.SPOT_LIGHT_1.POSITION[2],
        ]}
        angle={LIGHTING.SPOT_LIGHT_1.ANGLE}
        penumbra={LIGHTING.SPOT_LIGHT_1.PENUMBRA}
        intensity={LIGHTING.SPOT_LIGHT_1.INTENSITY}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        color={LIGHTING.SPOT_LIGHT_1.COLOR}
      />

      <spotLight
        position={[
          startX + LIGHTING.SPOT_LIGHT_2.POSITION[0],
          LIGHTING.SPOT_LIGHT_2.POSITION[1],
          startZ + LIGHTING.SPOT_LIGHT_2.POSITION[2],
        ]}
        angle={LIGHTING.SPOT_LIGHT_2.ANGLE}
        penumbra={LIGHTING.SPOT_LIGHT_2.PENUMBRA}
        intensity={LIGHTING.SPOT_LIGHT_2.INTENSITY}
        castShadow={false}
        color={LIGHTING.SPOT_LIGHT_2.COLOR}
      />

      <hemisphereLight
        skyColor={LIGHTING.HEMISPHERE.SKY_COLOR}
        groundColor={LIGHTING.HEMISPHERE.GROUND_COLOR}
        intensity={LIGHTING.HEMISPHERE.INTENSITY}
      />
    </>
  );
}
