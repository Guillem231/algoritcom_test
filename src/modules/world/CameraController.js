import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';


export function CameraController({ avatarRef, isManualMode, setIsManualMode }) {
  const { camera, gl } = useThree();
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const orbitDistance = useRef(7); 
  
  const thetaRef = useRef(0);
  const phiRef = useRef(Math.PI / 4); 
  
  useFrame(() => {
    if (!isManualMode || !avatarRef.current) return;
    
    const translation = avatarRef.current.translation();
    const avatarPosition = new THREE.Vector3(
      translation.x,
      translation.y + 1.5, 
      translation.z
    );
    
    const x = orbitDistance.current * Math.sin(phiRef.current) * Math.sin(thetaRef.current);
    const y = orbitDistance.current * Math.cos(phiRef.current);
    const z = orbitDistance.current * Math.sin(phiRef.current) * Math.cos(thetaRef.current);
    
    camera.position.set(
      avatarPosition.x + x,
      avatarPosition.y + y,
      avatarPosition.z + z
    );
    
    camera.lookAt(avatarPosition);
  });
  
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleRightClick = (e) => {
      if (e.button === 2) { 
        e.preventDefault();
        
        if (!isManualMode) {
          const translation = avatarRef.current.translation();
          const avatarPosition = new THREE.Vector3(
            translation.x,
            translation.y + 1.5,
            translation.z
          );
          
          const offset = new THREE.Vector3().subVectors(camera.position, avatarPosition);
          
          orbitDistance.current = offset.length();
          thetaRef.current = Math.atan2(offset.x, offset.z);
          phiRef.current = Math.acos(Math.min(Math.max(offset.y / orbitDistance.current, -0.99), 0.99));
        }
        
        setIsManualMode(!isManualMode); 
      }
    };
    
    const handleMouseDown = (e) => {
      if (e.button === 0 && isManualMode) { 
        isDragging.current = true;
        previousMousePosition.current.x = e.clientX;
        previousMousePosition.current.y = e.clientY;
      }
    };
    
    const handleMouseUp = (e) => {
      if (e.button === 0) {
        isDragging.current = false;
      }
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging.current || !isManualMode) return;
      
      const deltaX = (e.clientX - previousMousePosition.current.x) * 0.01;
      const deltaY = (e.clientY - previousMousePosition.current.y) * 0.01;
      
      thetaRef.current -= deltaX;
      
      phiRef.current = Math.max(0.2, Math.min(Math.PI/2 - 0.1, phiRef.current + deltaY));
      
      previousMousePosition.current.x = e.clientX;
      previousMousePosition.current.y = e.clientY;
    };
    
    const handleWheel = (e) => {
      if (!isManualMode) return;
      
      const zoomSpeed = 0.5;
      orbitDistance.current += Math.sign(e.deltaY) * zoomSpeed;
      
      orbitDistance.current = Math.max(3, Math.min(15, orbitDistance.current));
    };
    
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('contextmenu', handleRightClick);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('contextmenu', handleRightClick);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isManualMode, setIsManualMode, camera, gl, avatarRef]);
  
  return null;
}
