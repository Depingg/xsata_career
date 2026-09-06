import { Container } from "../ui/Container";

const stats = [
  { value: "50.000+", label: "Siswa Terdaftar" },
  { value: "1.200+", label: "Guru BK Aktif" },
  { value: "8.500+", label: "Lowongan Tersedia" },
  { value: "95%", label: "Tingkat Kepuasan" },
];

export function Stats() {
  return (
    <section className="bg-primary">
      <Container className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-extrabold text-white sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1.5 text-sm text-accent">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
