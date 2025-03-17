import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, Stats } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';

import { SCENE_CONFIG } from '@/modules/world/config/sceneConfig';

import Avatar from '../avatar/Avatar';
import Skateboard from '../skateboard/Skateboard';
import GLBScene from './GLBScene';
import { CameraController } from './CameraController';
import { SceneLighting } from './SceneLighting';
import { WorldBoundaries } from './WorldBoundaries';
import { GameUI } from '../ui/GameUI';

import { useWorldBounds } from './hooks/useWorldBounds';

export default function Scene() {
  const { DEBUG, PHYSICS, RENDER, GLB } = SCENE_CONFIG;

  const { createWorldBoundaries, startPosition } = useWorldBounds();

  const skateboardRef = useRef();
  const avatarRef = useRef();

  const [isManualCameraMode, setIsManualCameraMode] = useState(false);

  const [currentAnimation, setCurrentAnimation] = useState('idle');

  const lastSentPosition = useRef(null);
  const lastSentRotation = useRef(null);
  const lastSentAnimation = useRef('idle');

  const worldBoundaries = useMemo(() => createWorldBoundaries(), [createWorldBoundaries]);

  const sceneProps = useMemo(
    () => ({
      scenePath: GLB.SCENE_PATH,
      scale: GLB.SCALE,
      position: GLB.POSITION,
    }),
    [GLB]
  );

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap,
          },
        }}
        style={{ height: '100vh', width: '100%' }}
      >
        <CameraController
          avatarRef={avatarRef}
          isManualMode={isManualCameraMode}
          setIsManualMode={setIsManualCameraMode}
        />

        <color attach="background" args={[RENDER.BACKGROUND_COLOR]} />
        <fog attach="fog" args={[RENDER.BACKGROUND_COLOR, RENDER.FOG_NEAR, RENDER.FOG_FAR]} />

        <SceneLighting startPosition={startPosition} />

        <Physics gravity={PHYSICS.GRAVITY} timeStep={PHYSICS.TIME_STEP} interpolate={true}>
          <Environment preset="night" intensity={0.3} background={false} />

          <GLBScene
            scenePath={sceneProps.scenePath}
            scale={sceneProps.scale}
            position={sceneProps.position}
          />

          <Avatar
            ref={avatarRef}
            startPosition={startPosition}
            skateboardRef={skateboardRef}
            isManualCameraMode={isManualCameraMode}
            onAnimationChange={setCurrentAnimation}
          />

          <Skateboard
            ref={skateboardRef}
            position={[startPosition[0] + 1.5, startPosition[1], startPosition[2]]}
          />

          <WorldBoundaries boundaries={worldBoundaries} />

          {/* <RemotePlayers players={players} socket={socket} /> */}
        </Physics>

        {DEBUG && (
          <>
            <Stats />
            <axesHelper args={[5]} />
            <gridHelper args={[20, 20, 0x888888, 0x444444]} />
          </>
        )}
      </Canvas>

      <GameUI isManualCameraMode={isManualCameraMode} />
      <Loader />
    </>
  );
}
