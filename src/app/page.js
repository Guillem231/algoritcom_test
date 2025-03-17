'use client';

import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('../modules/world/Scene'), { ssr: false });

export default function Home() {
  return (
    <main className="w-full h-screen">
      <Scene />
    </main>
  );
}
