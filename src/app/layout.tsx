import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "XSata Career AI Platform",
    template: "%s | XSata Career",
  },
  description:
    "Portal layanan bimbingan konseling dan BKK XSata Career untuk siswa dan Guru BK SMKN 1 Tengaran. Konsultasi karier cerdas berbasis AI, asesmen minat bakat, dan rekomendasi pekerjaan.",
  keywords: [
    "SMK",
    "karier",
    "BK",
    "bimbingan konseling",
    "AI",
    "XSata",
    "lowongan kerja",
  ],
  authors: [{ name: "XSata" }],
  openGraph: {
    title: "XSata Career AI Platform",
    description:
      "Portal layanan bimbingan konseling dan BKK untuk siswa dan Guru BK SMKN 1 Tengaran. Konsultasi karier cerdas berbasis AI.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0052CC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <FloatingChatbot />
      </body>
    </html>
  );
}
