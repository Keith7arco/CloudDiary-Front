'use client';

import "./globals.css";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100">
        <QueryClientProvider client={queryClient}>
          <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
              <Link href="/" className="text-xl font-bold text-blue-600">
                CloudGallery
              </Link>

              <div className="space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Galería
                </Link>

                <Link
                  href="/upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Subir
                </Link>
              </div>
            </nav>
          </header>

          <main className="max-w-6xl mx-auto p-6">{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}

