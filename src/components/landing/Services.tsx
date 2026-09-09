import { Bot, Mic, ClipboardCheck, FileText, BookOpen, Briefcase } from "lucide-react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { LinkButton } from "../ui/Button";

const services = [
  {
    icon: Bot,
    title: "Konsultasi AI Karier",
    desc: "Tanyakan apa pun soal karier, jurusan, dan masa depanmu. Asisten AI menjawab dengan rekomendasi personal.",
    tag: "Populer",
    highlighted: true,
    href: "/siswa/konsultasi",
  },
  {
    icon: Mic,
    title: "Guru BK Virtual",
    desc: "Sesi percakapan suara langsung dengan AI — ucapkan pertanyaan bimbinganmu dan dapatkan respons lisan secara real-time.",
    tag: "Terbaru",
    href: "/siswa/voice",
  },
  {
    icon: ClipboardCheck,
    title: "Asesmen Minat",
    desc: "Tes psikometri terstandar untuk mengidentifikasi potensi dan merekomendasikan karier yang tepat.",
    tag: "Terstandar",
    href: "/siswa/asesmen",
  },
  {
    icon: FileText,
    title: "Rapor Kesiapan",
    desc: "Pantau kesiapan kariermu melalui rapor bimbingan, konsultasi, dan rencana kerja dalam satu dasbor.",
    tag: "Terintegrasi",
    href: "/siswa/rapor",
  },
  {
    icon: BookOpen,
    title: "Materi & Panduan",
    desc: "Modul bimbingan karier, panduan, dan tips persiapan kerja untuk siswa SMK.",
    tag: "Lengkap",
    href: "/siswa/materi",
  },
  {
    icon: Briefcase,
    title: "Lowongan",
    desc: "Akses lowongan kerja, magang (PKL), dan beasiswa dari mitra industri yang sudah terverifikasi.",
    tag: "Terbaru",
    href: "/siswa/lowongan",
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
