"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

const faqs = [
  {
    q: "Apakah XSata Career AI Platform gratis?",
    a: "Ya, platform ini gratis untuk siswa SMK dan Guru BK se-Indonesia. Seluruh fitur dasar — asesmen, konsultasi AI, dan akses lowongan — dapat digunakan tanpa biaya.",
  },
  {
    q: "Bagaimana cara bergabung sebagai siswa?",
    a: "Klik tombol 'Masuk', lalu pilih tab Siswa dan masukkan Nomor Induk Siswa (NIS) sesuai data sekolah. Setelah masuk, Anda langsung dapat mengikuti asesmen dan berkonsultasi dengan AI.",
  },
  {
    q: "Apa yang bisa dilakukan Guru BK di platform ini?",
    a: "Guru BK dapat memantau perkembangan bimbingan siswa, menjadwalkan konseling, memberikan arahan karier, dan melihat laporan analitik secara terpusat.",
  },
  {
    q: "Apakah hasil asesmen minat bakat dapat dipercaya?",
    a: "Asesmen menggunakan instrumen psikometri terstandar yang dikembangkan bersama praktisi bimbingan konseling. Hasilnya menjadi referensi, bukan keputusan final.",
  },
  {
    q: "Apakah data pribadi saya aman?",
    a: "Kami menerapkan enkripsi data dan kepatuhan terhadap regulasi perlindungan data pribadi. Data siswa tidak pernah dibagikan tanpa izin.",
  },
  {
    q: "Bagaimana lowongan kerja di platform diverifikasi?",
    a: "Seluruh lowongan berasal dari mitra industri yang telah terdaftar dan diverifikasi tim XSata untuk mencegah penipuan.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-accent-soft py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Pertanyaan yang Sering Diajukan"
          description="Temukan jawaban atas pertanyaan umum seputar XSata Career AI Platform."
        />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className={`overflow-hidden rounded-xl border bg-white transition-colors ${
                  isOpen ? "border-primary" : "border-border-light"
                }`}
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="border-t border-border-light px-5 py-4 text-sm leading-relaxed text-slate-600">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
