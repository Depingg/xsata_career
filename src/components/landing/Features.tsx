import { CheckCircle2, BrainCircuit, ShieldCheck, BarChart3, Bell, MapPin } from "lucide-react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Badge } from "../ui/Badge";

const features = [
  {
    icon: BrainCircuit,
    title: "Rekomendasi Berbasis Data",
    desc: "Algoritma AI menganalisis minat, nilai akademik, dan tren industri untuk memberi saran karier yang akurat.",
  },
  {
    icon: ShieldCheck,
    title: "Privasi & Keamanan Data",
    desc: "Data pribadi siswa dikelola dengan standar keamanan tinggi sesuai regulasi perlindungan data.",
  },
  {
    icon: BarChart3,
    title: "Analitik Real-Time",
    desc: "Guru BK memperoleh laporan dan analitik perkembangan bimbingan siswa secara real-time.",
  },
  {
    icon: Bell,
    title: "Notifikasi Cerdas",
    desc: "Pengingat jadwal konseling, lowongan baru, dan milestone karier tepat pada waktunya.",
  },
  {
    icon: MapPin,
    title: "Pencocokan dengan Industri",
    desc: "Sistem mencocokkan profil siswa dengan kebutuhan dan budaya kerja mitra industri.",
  },
  {
    icon: CheckCircle2,
    title: "Jejak Transparan",
    desc: "Seluruh konsultasi dan bimbingan terekam rapi untuk evaluasi karier yang berkelanjutan.",
  },
];

export function Features() {
  return (
    <section id="tentang" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Mengapa XSata"
          title="Platform Karier Cerdas & Terpercaya"
          description="Dirancang bersama pendidik dan tenaga bimbingan konseling agar relevan dengan kebutuhan siswa SMKN 1 Tengaran."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border-light bg-accent-soft p-6 transition-colors hover:border-primary/30"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Badge tone="accent" className="px-4 py-2 text-sm">
            Dikembangkan untuk SMKN 1 Tengaran
          </Badge>
        </div>
      </Container>
    </section>
  );
}
