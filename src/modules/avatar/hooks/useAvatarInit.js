import { useEffect } from 'react';
import { CAMERA } from '../constants/camera';


export const useAvatarInit = (rigidBodyRef, isInit, setIsInit, startPosition, camera) => {
  useEffect(() => {
    if (rigidBodyRef.current && !isInit) {
      rigidBodyRef.current.setTranslation({ 
        x: startPosition[0], 
        y: startPosition[1], 
        z: startPosition[2] 
      }, true);
      
      camera.position.set(
        startPosition[0], 
        startPosition[1] + CAMERA.INITIAL_HEIGHT_OFFSET, 
        startPosition[2] + CAMERA.INITIAL_BACK_DISTANCE
      );
      camera.lookAt(startPosition[0], startPosition[1], startPosition[2]);
      
      setIsInit(true);
    }
  }, [rigidBodyRef, isInit, setIsInit, startPosition, camera]);
};
