import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter, Poppins, Outfit, Montserrat, DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["400", "700", "900"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BioLink Free",
  description: "Ton lien en 1 clic. Crée ta page pro comme Linktree. Gratuit, sans limite, forever.",
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${poppins.variable} ${outfit.variable} ${montserrat.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
