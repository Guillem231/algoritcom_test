import './globals.css';

export const metadata = {
  title: 'Algoritcom Test',
  description: 'Algoritcom Test Guillem Pedret',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
