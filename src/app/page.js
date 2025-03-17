'use client';

import dynamic from 'next/dynamic';

// Carga dinámica del componente Scene para evitar errores de SSR con three.js
const Scene = dynamic(() => import('../modules/world/Scene'), { ssr: false });

export default function Home() {
  return (
    <main className="w-full h-screen">
      <Scene />
    </main>
  );
}
