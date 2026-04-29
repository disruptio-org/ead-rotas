import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agents OS",
  description: "Plataforma de Agentes Customizados e Skills Estilo ChatGPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${inter.className} h-full antialiased dark`}>
      <body className="flex h-full min-h-screen bg-zinc-950 text-zinc-50 selection:bg-emerald-500/30">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-900/40 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
          {children}
        </main>
      </body>
    </html>
  );
}
