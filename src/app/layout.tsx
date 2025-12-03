'use client';

import "./globals.css";
import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { Cloud, GalleryHorizontal, UploadCloud } from "lucide-react";
import { ThemeProvider } from "next-themes";
import ThemeButton from "@/components/ThemeButton";

const queryClient = new QueryClient();
/* ------------------------- LAYOUT PRINCIPAL ------------------------- */

export default function RootLayout({ children }: { children: ReactNode }) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        <ThemeProvider attribute="class">
          <QueryClientProvider client={queryClient}>

            <header
              className={`backdrop-blur bg-white/70 dark:bg-black/20 shadow-sm sticky top-0 z-50
              border-b border-gray-200 dark:border-gray-700 transition-transform duration-300
              ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
            >
              <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

                <Link 
                  href="/" 
                  className="flex items-center gap-2 text-2xl font-semibold text-blue-700 dark:text-blue-300 tracking-tight"
                >
                  <Cloud className="size-10"/>
                  <span>CloudGallery</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                  <ThemeButton />

                  <Link
                    href="/"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition font-medium"
                  >
                    <GalleryHorizontal className="size-5"/>
                  </Link>

                  <Link
                    href="/upload"
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:shadow-lg hover:bg-blue-700 transition-all"
                  >
                    <UploadCloud className="size-5" />
                  </Link>
                </div>

                <button
                  className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  onClick={() => setOpenMenu(!openMenu)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={
                        openMenu
                          ? "M6 18L18 6M6 6l12 12"
                          : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      }
                    />
                  </svg>
                </button>
              </nav>

              {/* MENU MOBILE */}
              <div
                className={`
                  md:hidden bg-white dark:bg-gray-900 shadow-lg rounded-xl 
                  absolute right-4 top-16 
                  w-48 overflow-hidden transition-all duration-300 z-50
                  ${openMenu ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
                `}
              >
                <div className="flex flex-col p-4 gap-4 items-center text-center">
                  <ThemeButton />

                  <Link
                    href="/"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300"
                    onClick={() => setOpenMenu(false)}
                  >
                    <GalleryHorizontal className="size-5"/>
                  </Link>

                  <Link
                    href="/upload"
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    onClick={() => setOpenMenu(false)}
                  >
                    <UploadCloud className="size-5" />
                  </Link>
                </div>
              </div>
            </header>

            <main className="max-w-6xl mx-auto p-6">{children}</main>

          </QueryClientProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
