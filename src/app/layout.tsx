import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { MenuProvider } from "@/contexts/MenuContext";

export const metadata: Metadata = {
  title: "KhonKhong Farm - ระบบฟาร์มอัตโนมัติ",
  description:
    "ระบบจัดการฟาร์มอัจฉริยะพร้อม AI ช่วยวิเคราะห์และแนะนำการเพาะปลูก",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased bg-gray-50">
        <MenuProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </MenuProvider>
      </body>
    </html>
  );
}
