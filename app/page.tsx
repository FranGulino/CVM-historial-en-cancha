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

      <main className="flex-1 space-y-16 pb-16">
        {/* Hero Section overlay con cabecera flotante */}
        <section className="relative h-[600px] flex items-center justify-start overflow-hidden">
          {/* Imagen de fondo de la hinchada */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hinchadaCVM.jpeg"
              alt="Hinchada Villa Mitre en El Fortín"
              fill
              className="object-cover object-center brightness-[0.35]"
              priority
            />
          </div>
          {/* Superposición de gradientes oscuros para fusionar y leer */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111412] via-[#111412]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-[#111412]/40 z-10" />

          {/* Contenido alineado a la izquierda */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="max-w-2xl space-y-8">

              {/* Título Principal */}
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
                {"Preservando la Identidad"} <br />
                {"Tricolor en la Era Digital"}
              </h1>

              {/* Subtítulo */}
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
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
                      {"Ir a mis Partidos"}
                    </Link>
                    <Link
                      href="/partidos"
                      className="inline-flex h-11 items-center justify-center rounded-[8px] border border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all text-sm font-bold text-zinc-300 px-6 active:scale-95"
                    >
                      {"Ver Fixture Completo"}
                    </Link>
                  </>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <button className="inline-flex h-11 items-center justify-center rounded-[8px] bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 active:bg-green-800 transition-all text-sm font-bold text-white px-6 active:scale-95 shadow-lg shadow-green-950/20">
                        {"Iniciar Registro de Partido"}
                      </button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <button className="inline-flex h-11 items-center justify-center rounded-[8px] border border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all text-sm font-bold text-zinc-300 px-6 active:scale-95">
                        {"Consultar Historial"}
                      </button>
                    </SignInButton>
                  </>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* Banner del Próximo Partido */}
        {nextMatch && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-[8px] border border-[#414942]/60 bg-[#1d211e]">
              <div className="absolute inset-0 z-0 opacity-15">
                <Image
                  src="/hinchadaCVM.jpeg"
                  alt="Hinchada de Villa Mitre"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/95 to-green-950/20 z-10" />

              <div className="relative z-20 flex flex-col md:flex-row justify-between items-center gap-6 p-6 sm:p-8">
                <div className="space-y-2 text-center md:text-left">
                  <span className="inline-flex items-center rounded-full bg-green-900/30 px-3 py-0.5 text-[9px] font-bold text-green-400 border border-green-800/30 uppercase tracking-wider">
                    {"Próximo Encuentro"}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                    {nextMatch.homeTeam} {"vs."} {nextMatch.awayTeam}
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-bold tracking-wider uppercase">
                    {"Fecha"} {nextMatch.fixtureRound} {"— Torneo Federal A"}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Countdown targetDate={nextMatch.date} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sección de Frases (Impacto) */}
        <section className="max-w-7xl mx-auto px-4 py-8 text-center space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
            {"El Club de la Ciudad"}
          </h2>
          <div className="w-24 h-1 bg-[#2d6a4f] mx-auto rounded-full" />
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest pt-2">
            {"Villa Mitre — El más grande del sur argentino"}
          </p>
        </section>

        {/* Sección de Características (Grid de 3 tarjetas) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-[8px] border border-zinc-800 bg-[#1d211e] space-y-3">
              <div className="text-2xl text-[#2d6a4f]">{"🏟️"}</div>
              <h3 className="text-base font-bold text-white">{"Tu Bitácora Digital"}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {"Llevá un registro exacto de cada partido de la campaña. Alentá de forma presencial en El Fortín o a la distancia por TV/Radio."}
              </p>
            </div>
            {/* Card 2 */}
            <div className="p-6 rounded-[8px] border border-zinc-800 bg-[#1d211e] space-y-3">
              <div className="text-2xl text-[#2d6a4f]">{"📊"}</div>
              <h3 className="text-base font-bold text-white">{"Amuleto de la Suerte"}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {"Calculá tus estadísticas de efectividad personales. Descubrí qué porcentaje de puntos obtuvo Villa Mitre cuando estuviste alentando."}
              </p>
            </div>
            {/* Card 3 */}
            <div className="p-6 rounded-[8px] border border-zinc-800 bg-[#1d211e] space-y-3">
              <div className="text-2xl text-[#2d6a4f]">{"⏳"}</div>
              <h3 className="text-base font-bold text-white">{"Próximo Encuentro"}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {"Visualizá un reloj interactivo con la cuenta regresiva en vivo para el próximo partido. No te pierdas ningún detalle de la fecha."}
              </p>
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
