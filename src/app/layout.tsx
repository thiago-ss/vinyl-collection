import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import AnimatedLayout from "@/components/animated-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GroovyStacks",
  description: "A modern vinyl collection app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
              <Navbar />
              <main className="container mx-auto py-6 px-4">
                <AnimatedLayout>{children}</AnimatedLayout>
              </main>
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
