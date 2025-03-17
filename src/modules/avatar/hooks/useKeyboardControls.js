import { useState, useEffect } from 'react';

export const W = 'KeyW';
export const A = 'KeyA';
export const S = 'KeyS';
export const D = 'KeyD';
export const SHIFT = 'ShiftLeft';
export const SPACE = 'Space';
export const C = 'KeyC';
export const DIRECTIONS = [W, A, S, D];
export const E = 'KeyE'; 

export function useKeyboardControls() {
  const [controls, setControls] = useState({
    [W]: false,
    [A]: false,
    [S]: false,
    [D]: false,
    [SPACE]: false,
    [SHIFT]: false,
      [C]: false,
    [E]: false,
  });

  useEffect(() => {
    const keys = new Set();

    const updateControls = () => {
      setControls({
        [W]: keys.has(W) || keys.has('ArrowUp'),
        [A]: keys.has(A) || keys.has('ArrowLeft'),
        [S]: keys.has(S) || keys.has('ArrowDown'),
        [D]: keys.has(D) || keys.has('ArrowRight'),
        [SPACE]: keys.has(SPACE),
        [SHIFT]: keys.has(SHIFT) || keys.has('ShiftRight'),
          [C]: keys.has(C),
              [E]: keys.has(E),

      });
    };

    const handleKeyDown = (e) => {
      if (e.repeat) return; 
      keys.add(e.code);
      updateControls();
    };

    const handleKeyUp = (e) => {
      keys.delete(e.code);
      updateControls();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', () => {
      keys.clear();
      updateControls();
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', () => {});
    };
  }, []);

  return controls;
}
