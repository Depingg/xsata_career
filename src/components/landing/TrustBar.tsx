import { GraduationCap, BookOpen, Building2, Award } from "lucide-react";
import { Container } from "../ui/Container";

const items = [
  { icon: GraduationCap, label: "SMK Negeri & Swasta" },
  { icon: BookOpen, label: "9+ Kompetensi Keahlian" },
  { icon: Building2, label: "500+ Mitra Industri" },
  { icon: Award, label: "Terpercaya & Resmi" },
];

export function TrustBar() {
  return (
    <section className="border-b border-border-light bg-white">
      <Container className="grid grid-cols-2 items-center justify-items-center gap-6 py-8 md:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-slate-500">
            <Icon className="h-5 w-5 text-primary/60" />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </Container>
    </section>
  );
}
