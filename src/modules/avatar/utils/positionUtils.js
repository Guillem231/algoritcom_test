import * as THREE from 'three';


export const calculateDistance = (pos1, pos2) => {
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + 
    Math.pow(pos1.z - pos2.z, 2)
  );
};

export const getCameraDirectionVectors = (camera) => {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  direction.y = 0;
  direction.normalize();
  
  const right = new THREE.Vector3(-direction.z, 0, direction.x);
  
  return { direction, right };
};


export const createMoveVector = (controls, directionVectors, controlKeys) => {
  const { direction, right } = directionVectors;
  const moveVector = new THREE.Vector3(0, 0, 0);
  
  if (controls[controlKeys.FORWARD]) moveVector.add(direction);
  if (controls[controlKeys.BACKWARD]) moveVector.sub(direction);
  if (controls[controlKeys.LEFT]) moveVector.sub(right);
  if (controls[controlKeys.RIGHT]) moveVector.add(right);
  
  if (moveVector.length() > 0) {
    moveVector.normalize();
  }
  
  return moveVector;
};
