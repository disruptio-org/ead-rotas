import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rotas — by Papiro",
  description: "Plataforma de Agentes e Skills para automação inteligente de processos logísticos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${figtree.className} h-full`}>
      <body className="flex h-full min-h-screen" style={{ background: '#F4F2EE', color: '#1A1714', fontFamily: 'inherit' }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>
      </body>
    </html>
  );
}
