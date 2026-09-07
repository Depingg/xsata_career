import { ArrowRight, ShieldCheck, Bot, Sparkles, Users } from "lucide-react";
import { Container } from "../ui/Container";
import { LinkButton } from "../ui/Button";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-accent via-accent-soft to-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #0052cc 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />
      <Container className="relative flex flex-col items-center pt-8 pb-20 text-center sm:pt-12 sm:pb-28">
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Temukan Arah Karier{" "}
          <span className="text-primary">Terbaikmu</span> dengan AI
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          XSata Career membantu siswa SMKN 1 Tengaran mengenali potensi,
          menentukan jurusan dan karier, serta terhubung langsung dengan
          peluang dunia kerja. Didukung bimbingan konseling Guru BK dan
          layanan BKK sekolah.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <LinkButton href="/siswa/konsultasi" size="lg" className="w-full sm:w-auto">
            Mulai Konsultasi Gratis
            <ArrowRight className="h-4 w-4" />
          </LinkButton>
          <LinkButton href="/#layanan" variant="outline" size="lg" className="w-full sm:w-auto">
            Lihat Layanan
          </LinkButton>
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="h-4 w-4 text-success" />
          Layanan Bimbingan Konseling &amp; BKK SMKN 1 Tengaran
        </p>

        <div className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Bot,
              title: "Konsultasi Karier AI",
              desc: "Asisten cerdas yang memahami minat, bakat, dan potensimu 24/7.",
            },
            {
              icon: Sparkles,
              title: "Asesmen Minat Bakat",
              desc: "Tes psikometri dan rekomendasi jurusan serta profesi yang sesuai.",
            },
            {
              icon: Users,
              title: "Kolaborasi Guru BK",
              desc: "Guru BK memantau perkembangan dan memberi bimbingan langsung.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-border-light bg-white p-5 text-left shadow-sm transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3.5 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
