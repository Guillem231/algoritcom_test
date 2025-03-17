import React from 'react';


export function CameraModeIndicator({ isManualCameraMode }) {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 20, 
      right: 20, 
      color: 'white',
      background: 'rgba(0,0,0,0.7)',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '24px'
    }}>
      Cámara: {isManualCameraMode ? "Manual" : "Automática"}
    </div>
  );
}


export function GameInstructions() {
  return (
    <div style={{ 
      position: 'absolute', 
      bottom: 20, 
      left: 20, 
      color: 'white',
      background: 'rgba(0,0,0,0.7)',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace'
    }}>
      <strong>Controles:</strong><br />
      WASD / Flechas: Mover<br />
      Espacio: Saltar<br />
      Shift: Correr<br />
      C: Bailar<br />
      E: Montar/Desmontar Skate<br />
      <strong>Botón Derecho: Cambiar modo de cámara</strong><br />
      <strong>En modo manual:</strong><br />
      <strong>- Clic + Arrastrar: Orbitar</strong><br />
      <strong>- Rueda del ratón: Zoom</strong>
    </div>
  );
}

/**
 * Componente principal que contiene todos los elementos UI
 */
export function GameUI({ isManualCameraMode }) {
  
  return (
    <>
      <CameraModeIndicator isManualCameraMode={isManualCameraMode} />
      <GameInstructions />
    </>
  );
}
