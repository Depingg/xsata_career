import { UserPlus, ClipboardCheck, Bot, TrendingUp } from "lucide-react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Masuk dengan NIS/NIP",
    desc: "Masuk menggunakan Nomor Induk Siswa (NIS) atau NIP Guru BK dari sekolahmu.",
  },
  {
    icon: ClipboardCheck,
    step: "02",
    title: "Ikuti Asesmen Minat",
    desc: "Kerjakan tes psikometri untuk mengungkap potensi dan kepribadianmu.",
  },
  {
    icon: Bot,
    step: "03",
    title: "Konsultasi dengan AI",
    desc: "Tanyakan karier yang kamu pertimbangkan dan terima rekomendasi personal.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Kelola Rencana Karier",
    desc: "Pantau progres bimbingan, apply lowongan, dan raih karier impianmu.",
  },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="bg-accent-soft py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Cara Kerja"
          title="Mulai dalam 4 Langkah Mudah"
          description="Proses sederhana yang memandu siswa menemukan dan mewujudkan arah karier."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, step, title, desc }, index) => (
            <div key={step} className="relative rounded-2xl border border-border-light bg-white p-6">
              <span className="absolute right-5 top-5 text-4xl font-extrabold text-accent">
                {step}
              </span>
              <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              {index < steps.length - 1 && (
                <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white lg:flex">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
