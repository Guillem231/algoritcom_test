import { useEffect } from 'react';


export function useSkateboardCollisions(rigidBodyRef, setIsRiding) {
  useEffect(() => {
    if (!rigidBodyRef.current) return;
    
    const handleCollision = (event) => {
      if (event.totalForceMagnitude > 20 && setIsRiding) {
        setIsRiding(false);
      }
    };
    
    const unsubscribe = rigidBodyRef.current.onContactForce(handleCollision);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [rigidBodyRef, setIsRiding]);
}
