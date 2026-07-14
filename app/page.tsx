import { auth } from "@clerk/nextjs/server";
import Header from "@/components/Header";
import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Countdown from "@/components/Countdown";

export default async function HomePage() {
  const { userId } = await auth();

  // Obtenemos los partidos para buscar el próximo encuentro
  const matches = await prisma.match.findMany({
    orderBy: [
      { date: "asc" },
      { fixtureRound: "asc" }
    ],
  });

  const nextMatch = matches.find((m) => m.goalsVM === null && m.goalsOpponent === null);

  return (
    <div className="flex flex-col min-h-screen bg-[#111412] text-[#e1e3de]">
      <Header />

      <main className="flex-1 space-y-6 pb-12">
        {/* Hero Section overlay con cabecera flotante y cuenta regresiva al costado */}
        <section className="relative min-h-[700px] lg:h-[700px] flex items-center justify-start overflow-hidden py-20 lg:py-0">
          {/* Imagen de fondo de la hinchada */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hinchadaCVM.jpeg"
              alt="Hinchada Villa Mitre en El Fortín"
              fill
              className="object-cover object-center brightness-[0.3]"
              priority
            />
          </div>
          {/* Superposición de gradientes oscuros para fusionar y leer */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111412] via-[#111412]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-[#111412]/50 z-10" />

          {/* Contenido en Grid de 2 columnas en Desktop */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Columna Izquierda: Textos y Botones de Acceso */}
              <div className="lg:col-span-7 space-y-8 text-left">
                {/* Título Principal bicolor (blanco + verde Villa Mitre) */}
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1] font-sans">
                  <span className="text-white">{"A Villa Mitre yo lo sigo"}</span><br />
                  <span className="text-[#2d6a4f]">{"siempre a todos lados..."}</span>
                </h1>

                {/* Subtítulo */}
                <p className="text-sm sm:text-base text-zinc-350 leading-relaxed max-w-xl">
                  {"El Fortín Digital es la bitácora oficial de los simpatizantes del Club Villa Mitre. Un registro histórico, formal y exhaustivo de nuestra presencia en cada jornada deportiva."}
                </p>

                {/* Botones de acción del Hero */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {userId ? (
                    <>
                      <Link
                        href="/partidos"
                        className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 active:bg-green-800 transition-all text-sm font-bold text-white px-6 active:scale-95 shadow-lg shadow-green-950/20"
                      >
                        {"Ir a partidos"}
                      </Link>
                      <Link
                        href="/hincha"
                        className="inline-flex h-11 items-center justify-center rounded-[8px] border border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all text-sm font-bold text-zinc-350 px-6 active:scale-95"
                      >
                        {"Ver mi Perfil"}
                      </Link>
                    </>
                  ) : (
                    <>
                      <SignInButton mode="redirect" fallbackRedirectUrl="/">
                        <button className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 active:bg-green-800 transition-all text-sm font-bold text-white px-6 active:scale-95 shadow-lg shadow-green-950/20">
                          {"Ingresar a la Bitácora"}
                        </button>
                      </SignInButton>
                      <a
                        href="#features"
                        className="inline-flex h-11 items-center justify-center rounded-[8px] border border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all text-sm font-bold text-zinc-350 px-6 active:scale-95"
                      >
                        {"Conocer Características"}
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Columna Derecha: Reloj de Cuenta Regresiva al Próximo Partido (solo logueados) */}
              <div className="lg:col-span-5 w-full">
                {userId && nextMatch && (
                  <div className="relative overflow-hidden rounded-[8px] border border-[#414942]/60 bg-[#1d211e]/90 backdrop-blur-md p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/80">
                    {/* Efecto resplandor sutil verde */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-950/15 via-transparent to-transparent pointer-events-none animate-pulse" />
                    
                    <div className="space-y-2 text-center">
                      <span className="inline-flex items-center rounded-full bg-green-900/30 px-3 py-0.5 text-[9px] font-bold text-green-400 border border-green-800/30 uppercase tracking-wider">
                        {"Próximo Encuentro"}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                        {nextMatch.homeTeam === "Villa Mitre" ? "VILLA MITRE" : nextMatch.homeTeam} {"vs."} {nextMatch.awayTeam === "Villa Mitre" ? "VILLA MITRE" : nextMatch.awayTeam}
                      </h3>
                      <p className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase">
                        {"Fecha"} {nextMatch.fixtureRound} {"— Torneo Federal A"}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <Countdown targetDate={nextMatch.date} />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Sección de Frases (Impacto) — ahora directamente debajo del Hero */}
        <section id="features" className="max-w-7xl mx-auto px-4 pt-4 pb-2 text-center space-y-3 scroll-mt-24">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
            {"El Club de la Ciudad"}
          </h2>
          <div className="w-24 h-1 bg-[#2d6a4f] mx-auto rounded-full" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest pt-2">
            {"Villa Mitre — El más grande del sur argentino"}
          </p>
        </section>

        {/* Sección del Mapa: Nuestra Casa */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 space-y-5">
          {/* Encabezado de Sección */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase font-sans">
              {"Nuestra Casa"}
            </h2>
            <div className="w-20 h-1 bg-[#2d6a4f] mx-auto rounded-full" />
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest pt-1">
              {"El Fortín — Maipú y Necochea, Bahía Blanca"}
            </p>
          </div>

          {/* Grid: Info + Mapa */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            
            {/* Panel de Info del Estadio */}
            <div className="p-6 rounded-[8px] border border-[#2d6a4f]/30 bg-[#1d211e] space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{"🏟️"}</span>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{"Estadio"}</p>
                    <p className="text-sm font-extrabold text-white">{"El Fortín de Maipú y Necochea"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{"📍"}</span>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{"Dirección"}</p>
                    <p className="text-sm font-bold text-zinc-300">{"Necochea 200, Bahía Blanca"}</p>
                    <p className="text-xs text-zinc-500">{"Buenos Aires, Argentina"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{"👕"}</span>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{"Club"}</p>
                    <p className="text-sm font-bold text-zinc-300">{"Club Villa Mitre"}</p>
                    <p className="text-xs text-zinc-500">{"Fundado en 1924"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{"🏆"}</span>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{"Competición Actual"}</p>
                    <p className="text-sm font-bold text-zinc-300">{"Torneo Federal A 2026"}</p>
                    <p className="text-xs text-[#2d6a4f] font-bold">{"Zona A — Nonagonal"}</p>
                  </div>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/3DnNS8diyCSAiRbL8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-9 rounded-[8px] border border-[#2d6a4f]/50 text-[10px] font-bold uppercase tracking-wider text-[#2d6a4f] hover:bg-[#2d6a4f]/10 transition-all"
              >
                {"🗺️ Abrir en Google Maps"}
              </a>
            </div>

            {/* Mapa Embed de Google Maps — Villa Mitre en El Fortín */}
            <div className="lg:col-span-2 overflow-hidden rounded-[8px] border border-zinc-800" style={{ height: "340px", position: "relative" }}>
              <iframe
                src="https://maps.google.com/maps?q=-38.737451,-62.239458&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                width="100%"
                height="380"
                style={{ border: 0, marginTop: "-4px", filter: "invert(90%) hue-rotate(180deg) saturate(0.7) brightness(0.85)" }}
                allowFullScreen
                loading="lazy"
                title="Ubicación El Fortín de Villa Mitre — Bahía Blanca"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-center">
        <p className="text-[10px] text-zinc-600 font-bold tracking-wider uppercase">
          {"El Fortín Digital — Bitácora Personal de Villa Mitre © 2026"}
        </p>
      </footer>
    </div>
  );
}
