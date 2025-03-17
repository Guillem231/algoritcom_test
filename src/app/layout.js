import './globals.css';

export const metadata = {
  title: 'Avatar 3D Scene',
  description: 'Interactive 3D scene with avatar using Next.js and Three.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
