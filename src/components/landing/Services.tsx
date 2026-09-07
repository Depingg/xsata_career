import { Bot, ClipboardCheck, Briefcase, LineChart, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { LinkButton } from "../ui/Button";

const services = [
  {
    icon: Bot,
    title: "Konsultasi Karier AI",
    desc: "Tanyakan apa pun soal karier, jurusan, dan masa depanmu. Asisten AI menjawab dengan rekomendasi personal.",
    tag: "Populer",
    highlighted: true,
  },
  {
    icon: ClipboardCheck,
    title: "Asesmen Minat & Bakat",
    desc: "Tes psikometri terstandar untuk mengidentifikasi potensi dan merekomendasikan karier yang tepat.",
    tag: "Terstandar",
  },
  {
    icon: Briefcase,
    title: "Lowongan Magang & Kerja",
    desc: "Akses lowongan kerja, magang (PKL), dan beasiswa dari mitra industri yang sudah terverifikasi.",
    tag: "Terbaru",
  },
  {
    icon: LineChart,
    title: "Pemetaan Progres Karier",
    desc: "Pantau perkembangan bimbingan, konsultasi, dan rencana karier dalam satu dasbor.",
    tag: "Terintegrasi",
  },
  {
    icon: BookOpen,
    title: "Bank Materi & Panduan",
    desc: "Ribuan panduan, modul bimbingan karier, dan tips persiapan kerja untuk siswa dan guru BK.",
    tag: "Lengkap",
  },
  {
    icon: FileText,
    title: "Bank Soal & Latihan",
    desc: "Akses kumpulan soal latihan psikotes, tes kerja, dan persiapan asesmen karier yang dapat diakses langsung dari dasbor.",
    tag: "Lengkap",
    href: "/siswa/asesmen",
  },
];

export function Services() {
  return (
    <section id="layanan" className="bg-accent-soft py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Layanan Kami"
          title="Solusi Lengkap Perencanaan Karier"
          description="Satu platform untuk seluruh kebutuhan bimbingan karier siswa SMK — dari mengenali potensi hingga memasuki dunia kerja."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, desc, tag, highlighted, href }) => {
            const content = (
              <>
                {highlighted && (
                  <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                    {tag}
                  </span>
                )}
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </>
            );
            const classes = `group relative rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              highlighted
                ? "border-2 border-primary bg-white"
                : "border border-border-light bg-white"
            }`;
            return href ? (
              <Link key={title} href={href} className={classes}>
                {content}
              </Link>
            ) : (
              <div key={title} className={classes}>
                {content}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <LinkButton href="/login" size="lg">
            Mulai Gunakan Sekarang
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
