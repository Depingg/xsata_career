import { ArrowRight } from "lucide-react";
import { Container } from "../ui/Container";
import { LinkButton } from "../ui/Button";

export function CTA() {
  return (
    <section id="kontak" className="bg-white py-20 sm:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
              Siap Mewujudkan Masa Depanmu?
            </span>
            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Mulai Perjalanan Kariermu Hari Ini
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-accent">
              Gunakan XSata Career bersama layanan bimbingan konseling dan BKK
              SMKN 1 Tengaran untuk menemukan arah kariermu.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton
                href="/login"
                size="lg"
                className="bg-white text-primary hover:bg-accent"
              >
                Daftar Gratis Sekarang
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <a
                href="#kontak"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-accent/40 px-6 text-base font-semibold text-white transition-colors hover:bg-accent/10"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
