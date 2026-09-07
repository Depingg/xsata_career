import { ShieldCheck } from "lucide-react";
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
      <Container className="relative flex flex-col items-center pt-8 pb-12 text-center sm:pt-12 sm:pb-16">
        <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          Rancang <span className="text-blue-600">Masa Depan Karirmu</span>{" "}
          Bersama <span className="font-extrabold">XSata AI</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:max-w-3xl md:text-lg lg:text-xl">
          Platform bimbingan karir cerdas berbasis AI untuk siswa SMKN 1
          Tengaran. Temukan minat bakat, rekomendasi jurusan, dan peluang kerja
          impian dalam satu langkah mudah.
        </p>

        <div className="mt-9 flex justify-center">
          <LinkButton href="/#layanan" variant="outline" size="lg" className="w-full sm:w-auto">
            Lihat Layanan
          </LinkButton>
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="h-4 w-4 text-success" />
          Layanan Bimbingan Konseling &amp; BKK SMKN 1 Tengaran
        </p>
      </Container>
    </section>
  );
}
