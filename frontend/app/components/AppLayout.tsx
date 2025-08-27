
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Estas son las rutas que NO tendrán la barra de navegación ni el contenedor principal
  const noLayoutRoutes = ['/', '/register'];

  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  // Para todas las demás rutas, muestra la barra de navegación y el contenedor
  return (
    <>
      <Navbar />
      <main className="container py-4">
        {children}
      </main>
    </>
  );
}
