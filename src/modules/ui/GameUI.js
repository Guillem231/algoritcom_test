import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import styles from "./GameUI.module.css";


export function CameraModeIndicator({ isManualCameraMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(styles.indicator, styles.cameraIndicator)}
    >
       Cámara: <span className="font-bold">{isManualCameraMode ? "Manual" : "Automática"}</span>
    </motion.div>
  );
}


export function GameInstructions() {
  return (
    <div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.instructions}
    >
      <strong>Controles:</strong>
      <ul>
        <li> WASD / Flechas: Mover</li>
        <li> Espacio: Saltar</li>
        <li> Shift: Correr</li>
        <li> C: Bailar</li>
        <li> E: Montar/Desmontar Skate</li>
        <li> <strong>Botón Derecho:</strong> Cambiar modo de cámara</li>
        <li> <strong>Clic + Arrastrar:</strong> Orbitar</li>
        <li><strong>Rueda del ratón:</strong> Zoom</li>
      </ul>
    </div>
  );
}


export function GameUI({ isManualCameraMode }) {

  return (
    <>
      <CameraModeIndicator isManualCameraMode={isManualCameraMode} />
      <GameInstructions />
    </>
  );
}
