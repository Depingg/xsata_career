"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  QrCode,
  MessageSquare,
  GraduationCap,
  Target,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

const student = {
  name: "Nanda",
  kelas: "XII TKJ 1",
  jurusan: "Teknik Komputer dan Jaringan (TKJ)",
  nis: "12345678",
};

const communicationScore = 82;

const communication = [
  { label: "Kejelasan & Struktur Bicara", value: 85 },
  { label: "Bahasa Tubuh & Gestur", value: 78 },
  { label: "Mendengarkan Aktif", value: 80 },
  { label: "Kepercayaan Diri", value: 76 },
];

const skillGaps = [
  { skill: "Komunikasi & Wawancara", current: 82, target: 90 },
  { skill: "Public Speaking", current: 68, target: 85 },
  { skill: "CV, Surat Lamaran, Portofolio", current: 85, target: 90 },
  { skill: "Teknis (Figma, HTML/CSS, Dasar IT)", current: 72, target: 85 },
  { skill: "Kerja Sama Tim & Profesionalisme", current: 84, target: 90 },
];

const aiRecommendations = [
  "Latih wawancara dengan metode STAR (Situation, Task, Action, Result) minimal 2 kali per minggu.",
  "Perkuat public speaking: biasakan presentasi di depan kelas dan rekam latihan untuk evaluasi.",
  "Perbarui CV dan portofolio agar menonjolkan proyek TKJ, sertakan tautan karya nyata.",
  "Naikkan kemampuan teknis dengan kursus singkat Figma, HTML/CSS, dan dasar JavaScript.",
  "Perluas jaringan profesional: ikuti webinar industri dan bangun profil LinkedIn sejak dulu.",
];

const verificationToken = `XSATA-RAPOR|v1|${student.nis}|${student.name.toUpperCase()}|KOM-${communicationScore}|SKK-82|2026-09-06`;

export default function InterviewRaporPage() {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrReady, setQrReady] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(verificationToken, { margin: 1, width: 320 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("");
      })
      .finally(() => {
        if (!cancelled) setQrReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function drawBar(doc: jsPDF, x: number, y: number, w: number, value: number, max = 100) {
    doc.setFillColor(226, 232, 240);
    doc.rect(x, y, w, 3.2, "F");
    doc.setFillColor(0, 82, 204);
    doc.rect(x, y, (Math.min(100, value) / max) * w, 3.2, "F");
  }

  async function downloadPdf() {
    setDownloading(true);
    try {
      const doc = new jsPDF();

      // Header
      doc.setFillColor(0, 82, 204);
      doc.roundedRect(14, 14, 182, 26, 2.5, 2.5, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("XSata Career AI Platform", 18, 21);
      doc.text("Diterbitkan: 06 September 2026", 192, 21, { align: "right" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      doc.text("Rapor Kesiapan Kerja", 18, 34);

      // Identitas siswa
      doc.setFillColor(242, 247, 255);
      doc.roundedRect(14, 46, 182, 22, 1.5, 1.5, "F");
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Nama:", 18, 52.5);
      doc.text("Kelas:", 18, 58);
      doc.setFont("helvetica", "normal");
      doc.text(student.name, 42, 52.5);
      doc.text(`${student.kelas}  |  ${student.jurusan} (NIS: ${student.nis})`, 42, 58);
      doc.setFont("helvetica", "bold");
      doc.text("Skor Komunikasi:", 18, 64);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(0, 82, 204);
      doc.text(`${communicationScore}/100`, 62, 64);
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);

      // 1. Skor komunikasi
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("1. Skor Komunikasi", 14, 78);
      let y = 84;
      for (const item of communication) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.text(doc.splitTextToSize(item.label, 88), 14, y);
        doc.text(`${item.value}`, 190, y, { align: "right" });
        drawBar(doc, 108, y - 2.4, 80, item.value);
        y += 8;
      }

      // 2. Analisis kesenjangan skill
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("2. Analisis Kesenjangan Skill", 14, y + 6);
      y += 14;
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Skill", 14, y);
      doc.text("Saat Ini", 108, y);
      doc.text("Target", 145, y);
      doc.text("Kesenjangan", 175, y);
      y += 4;
      for (const gap of skillGaps) {
        doc.roundedRect(14, y, 182, 9.5, 1, 1, "S");
        doc.setTextColor(15, 23, 42);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(doc.splitTextToSize(gap.skill, 85), 17, y + 6);
        doc.text(`${gap.current}`, 108, y + 6);
        doc.text(`${gap.target}`, 145, y + 6);
        const diff = gap.target - gap.current;
        doc.setTextColor(239, 68, 68);
        doc.setFont("helvetica", "bold");
        doc.text(`-${diff}`, 179, y + 6, { align: "right" });
        y += 10.5;
      }

      // 3. Rekomendasi AI
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("3. Rekomendasi Perbaikan dari AI", 14, y + 6);
      y += 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      aiRecommendations.forEach((rec, index) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 172);
        doc.text(lines, 17, y);
        y += lines.length * 4.6 + 1.5;
      });

      // 4. Verifikasi QR
      if (y > 214) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("4. Verifikasi Keaslian Rapor", 14, y + 8);
      y += 14;
      if (qrDataUrl) {
        doc.addImage(qrDataUrl, "PNG", 17, y, 36, 36);
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const verifyLines = doc.splitTextToSize(
        "Scan QR Code ini dengan kamera ponsel untuk memverifikasi keaslian rapor kesiapan kerja siswa. Rapor yang valid harus menampilkan skor komunikasi dan token verifikasi yang sama.",
        120
      );
      doc.text(verifyLines, 58, y + 6);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 82, 204);
      doc.setFontSize(9);
      doc.text(`Token Verifikasi: ${verificationToken}`, 58, y + 24);
      y += 44;
      doc.setTextColor(15, 23, 42);

      // Footer
      doc.setDrawColor(226, 232, 240);
      doc.line(14, y, 196, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        "Dokumen ini dihasilkan secara otomatis oleh XSata Career AI Platform dan hanya berlaku untuk keperluan bimbingan karier siswa.",
        14,
        y + 6
      );
      doc.text("XSata Career - Layanan Bimbingan Karier Siswa SMKN 1 Tengaran", 14, y + 10.5);

      doc.save(`Rapor-Kesiapan-Kerja-${student.name.replace(/\s+/g, "-")}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <DashboardShell role="siswa" username="Nanda" userRole="Siswa SMK • TKJ">
      <PageHeader
        title="Rapor Kesiapan Kerja"
        description="Ringkasan hasil simulasi interview, skor komunikasi, analisis kesenjangan skill, dan rekomendasi perbaikan dari AI."
        actions={
          <Button variant="primary" onClick={downloadPdf} disabled={downloading || !qrReady}>
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Unduh Rapor Kesiapan Kerja (PDF)
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Ringkasan siswa */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Data Siswa</h3>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-xl bg-accent p-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                {student.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
              <div>
                <p className="font-semibold text-slate-900">{student.name}</p>
                <p className="text-xs text-muted">{student.kelas}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Jurusan</p>
              <p className="mt-0.5 font-medium text-slate-800">{student.jurusan}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">NIS</p>
              <p className="mt-0.5 font-medium text-slate-800">{student.nis}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Status</p>
              <Badge tone="success" dot>Siap untuk pendampingan</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Skor komunikasi */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">Skor Komunikasi</h3>
            </div>
            <span className="rounded-xl bg-accent px-3 py-1.5 text-lg font-extrabold text-primary">
              {communicationScore}
              <span className="text-xs font-medium text-muted">/100</span>
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            {communication.map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-primary">{item.value}</span>
                </div>
                <ProgressBar value={item.value} tone={item.value >= 80 ? "success" : "primary"} />
              </div>
            ))}
            <div className="rounded-xl bg-accent p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-primary">Penilaian AI</p>
              </div>
              <p className="mt-1 text-sm text-slate-700">
                Komunikasi cukup baik. Fokus tingkatkan kepercayaan diri dan bahasa tubuh saat
                menjawab pertanyaan wawancara.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Verifikasi QR */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">QR Code Verifikasi</h3>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <div className="rounded-2xl border border-border-light bg-white p-4">
              {qrReady && qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrDataUrl}
                  alt="QR Code verifikasi rapor kesiapan kerja"
                  className="h-40 w-40"
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <ShieldCheck className="h-4 w-4 text-success" />
              Keaslian dapat diverifikasi
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Pindai QR Code untuk memverifikasi keaslian rapor kesiapan kerja. Token ditautkan ke
              profil siswa secara unik.
            </p>
            <p className="mt-3 w-full break-all rounded-lg bg-slate-50 px-3 py-2 text-[11px] text-muted">
              {verificationToken}
            </p>
            <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={downloadPdf} disabled={downloading || !qrReady}>
              <Download className="h-4 w-4" />
              Unduh PDF
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Skill gap */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Analisis Kesenjangan Skill</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillGaps.map((gap) => {
              const diff = gap.target - gap.current;
              return (
                <div key={gap.skill}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{gap.skill}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-muted">
                        Saat ini <b className="text-slate-900">{gap.current}</b> / Target{" "}
                        <b className="text-slate-900">{gap.target}</b>
                      </span>
                      {diff > 0 ? (
                        <Badge tone="danger">{diff} poin lagi</Badge>
                      ) : (
                        <Badge tone="success">Tercapai</Badge>
                      )}
                    </span>
                  </div>
                  <div className="relative">
                    <ProgressBar value={gap.current} tone={diff > 0 ? "warning" : "success"} />
                    <span
                      className="absolute top-0 h-full w-0.5 rounded-full bg-slate-900"
                      style={{ left: `${Math.min(100, gap.target)}%` }}
                      title={`Target ${gap.target}`}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-muted">
                    <span>Level saat ini</span>
                    <span>Target {gap.target}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Rekomendasi AI */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            <h3 className="font-semibold text-slate-900">Rekomendasi Perbaikan dari AI</h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {aiRecommendations.map((rec) => (
                <li key={rec} className="flex items-start gap-3 rounded-xl bg-accent-soft p-3.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-sm leading-relaxed text-slate-700">{rec}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-xl border border-border-light bg-white p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-slate-900">Unduh Rapor Lengkap</p>
              </div>
              <p className="mt-1 text-xs text-muted">
                Rapor PDF berisi seluruh ringkasan di atas beserta QR Code verifikasi dan token
                keaslian dokumen.
              </p>
              <Button onClick={downloadPdf} size="sm" className="mt-3 w-full" disabled={downloading || !qrReady}>
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Unduh Rapor Kesiapan Kerja (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}