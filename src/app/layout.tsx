import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentHubNavbar } from "@/components/agenthub/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "AgentHub | Discover, test, and integrate AI agents",
  description:
    "Browse production-ready AI agents, validate them in a live sandbox, and ship integrations with generated SDKs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-white text-[#1a1a2e] min-h-screen flex flex-col font-sans selection:bg-[#c0392b]/40 selection:text-white`}>
        <Providers>
          <TooltipProvider>
            <AgentHubNavbar />
            <main className="flex-1">
              {children}
            </main>
            <Toaster theme="light" position="bottom-right" />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
