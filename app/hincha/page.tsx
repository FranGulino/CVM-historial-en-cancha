import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Image from "next/image";
import HinchaHistorial from "@/components/HinchaHistorial";

export const revalidate = 0; // Respuesta instantánea al registrar asistencia

export default async function HinchaPage() {
  const { userId } = await auth();
  const user = await currentUser();

  // 1. Obtenemos los partidos
  const matches = await prisma.match.findMany({
    orderBy: [
      { date: "asc" },
      { fixtureRound: "asc" }
    ],
    include: {
      attendances: true,
    },
  });

  const playedMatches = matches.filter((m) => m.goalsVM !== null && m.goalsOpponent !== null);
  
  // 2. Filtramos la asistencia del usuario actual
  const userAttendances = playedMatches.filter((match) =>
    match.attendances.some((att) => att.userId === userId)
  );

  // 3. Estadísticas de Localía (🏟️ Partidos en El Fortín)
  const localPlayedMatches = playedMatches.filter((m) => m.homeTeam === "Villa Mitre");
  const userLocalAttendances = localPlayedMatches.filter((match) =>
    match.attendances.some((att) => att.userId === userId && att.type === "PRESENCIAL")
  );

  let stats = {
    localPlayed: localPlayedMatches.length,
    localAttended: userLocalAttendances.length,
    localWins: 0,
    localDraws: 0,
    localLosses: 0,
    goalsScored: 0,
    cleanSheets: 0,
    winPercentage: 0,
    attendancePercentage: 0,
    rank: "Hincha a la Distancia",
  };

  userLocalAttendances.forEach((match) => {
    const goalsVM = match.goalsVM!;
    const goalsOpponent = match.goalsOpponent!;

    stats.goalsScored += goalsVM;

    if (goalsVM > goalsOpponent) {
      stats.localWins += 1;
    } else if (goalsVM === goalsOpponent) {
      stats.localDraws += 1;
    } else {
      stats.localLosses += 1;
    }

    if (goalsOpponent === 0) {
      stats.cleanSheets += 1;
    }
  });

  // Porcentaje de Victorias y Asistencia de Local
  if (stats.localAttended > 0) {
    stats.winPercentage = Math.round((stats.localWins / stats.localAttended) * 100);
  }
  if (stats.localPlayed > 0) {
    stats.attendancePercentage = Math.round((stats.localAttended / stats.localPlayed) * 100);
  }

  // Rango del Hincha en El Fortín
  if (stats.localAttended >= 8) {
    stats.rank = "Abonado de Corazón";
  } else if (stats.localAttended >= 4) {
    stats.rank = "Grito de Popular";
  } else if (stats.localAttended >= 1) {
    stats.rank = "Hincha de Tribuna";
  }

  // 4. Estadísticas comparativas a la distancia (Remoto o visitante)
  const userDistanciaAttendances = playedMatches.filter((match) => {
    const isLocal = match.homeTeam === "Villa Mitre";
    const userAtt = match.attendances.find((att) => att.userId === userId);
    return userAtt && (userAtt.type === "A_LA_DISTANCIA" || !isLocal);
  });

  let distanciaWins = 0;
  userDistanciaAttendances.forEach((match) => {
    if (match.goalsVM! > match.goalsOpponent!) {
      distanciaWins += 1;
    }
  });

  const distanciaWinPercentage = userDistanciaAttendances.length > 0
    ? Math.round((distanciaWins / userDistanciaAttendances.length) * 100)
    : 0;

  // 5. Mejor y Peor resultado presenciado en El Fortín
  // Mejor: victoria con mayor diferencia de goles
  const bestResult = userLocalAttendances
    .filter((m) => m.goalsVM! > m.goalsOpponent!)
    .sort((a, b) => (b.goalsVM! - b.goalsOpponent!) - (a.goalsVM! - a.goalsOpponent!))[0] ?? null;

  // Peor: primero buscamos la derrota con mayor diferencia en contra
  // Si no hay derrotas, mostramos cualquier empate
  const worstByLoss = userLocalAttendances
    .filter((m) => m.goalsVM! < m.goalsOpponent!)
    .sort((a, b) => (a.goalsVM! - a.goalsOpponent!) - (b.goalsVM! - b.goalsOpponent!))[0] ?? null;

  const anyDraw = userLocalAttendances
    .find((m) => m.goalsVM! === m.goalsOpponent!) ?? null;

  const worstResult = worstByLoss ?? anyDraw;

  // 6. Ranking General de Hinchas (Fidelidad en El Fortín)
  // Contamos la cantidad de partidos presenciales jugados en El Fortín de cada usuario
  const allLocalPresencialAttendances = await prisma.attendance.findMany({
    where: {
      type: "PRESENCIAL",
      match: {
        homeTeam: "Villa Mitre",
        goalsVM: { not: null },
        goalsOpponent: { not: null },
      },
    },
    select: {
      userId: true,
    },
  });

  const attendanceCounts: Record<string, number> = {};
  allLocalPresencialAttendances.forEach((att) => {
    attendanceCounts[att.userId] = (attendanceCounts[att.userId] || 0) + 1;
  });

  // Obtenemos los usuarios registrados de Clerk
  let ranking: Array<{ id: string; name: string; imageUrl: string; count: number; rankName: string }> = [];
  try {
    const clerk = await clerkClient();
    const clerkUsersResponse = await clerk.users.getUserList();
    const clerkUsers = clerkUsersResponse.data;

    ranking = clerkUsers
      .map((u) => {
        const count = attendanceCounts[u.id] || 0;
        const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username || "Hincha Anónimo";
        
        let rankName = "Hincha de Tribuna";
        if (count >= 8) {
          rankName = "Abonado de Corazón";
        } else if (count >= 4) {
          rankName = "Grito de Popular";
        }

        return {
          id: u.id,
          name,
          imageUrl: u.imageUrl,
          count,
          rankName,
        };
      })
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error al obtener usuarios de Clerk para el ranking:", error);
  }

  const fullName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "Hincha Tricolor"
    : "Hincha Tricolor";

  return (
    <div className="flex flex-col min-h-screen bg-[#111412] text-[#e1e3de] relative overflow-hidden">
      
      {/* Header envuelto de forma limpia */}
      <Header />

      <main className="relative z-10 flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8 font-sans">
        
        {/* Cabecera de Página */}
        <div className="border-b border-[#414942]/20 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans uppercase">
            {"Perfil del Hincha"}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
            {"Estadísticas de efectividad y asistencia en El Fortín"}
          </p>
        </div>

        {/* Layout en Grid de 2 columnas simétricas con alturas alineadas de 195px */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Fila 1 Izquierda: Credencial Digital */}
          <div className="relative overflow-hidden rounded-[8px] border border-[#2d6a4f]/50 bg-gradient-to-br from-[#1d211e] via-[#1d211e] to-[#105238]/30 p-6 shadow-xl flex flex-col justify-between min-h-[195px]">
            {/* Escudo marca de agua original */}
            <div className="absolute right-4 bottom-4 h-28 w-28 opacity-[0.03] pointer-events-none">
              <Image
                src="/club-escudo-villa-mitre-logo-png_seeklogo-461955.webp"
                alt="Villa Mitre Watermark"
                width={112}
                height={112}
              />
            </div>

            <div className="flex justify-between items-center gap-6 pb-4 border-b border-[#414942]/30">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-[#2d6a4f]/60 bg-zinc-900 shadow-inner">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-lg font-bold text-zinc-500">
                      {fullName[0]}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start gap-1.5">
                  <h2 className="text-base font-bold text-white tracking-tight leading-none font-sans">
                    {fullName}
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-green-950/60 px-2.5 py-0.5 text-[9px] font-bold text-green-400 border border-green-800/30 uppercase tracking-wider">
                    {stats.rank}
                  </span>
                </div>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-[8px] text-zinc-500 font-bold tracking-widest block uppercase">
                  {"Código de Hincha"}
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-350 block">
                  {userId?.slice(-12).toUpperCase() ?? "CVM-HINCHA-2026"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 text-zinc-400">
              <div>
                <span className="text-[8px] text-zinc-500 font-bold tracking-widest block uppercase font-sans">{"Partidos Local"}</span>
                <span className="text-sm font-extrabold text-white">{stats.localAttended}</span>
              </div>
              <div>
                <span className="text-[8px] text-zinc-500 font-bold tracking-widest block uppercase font-sans">{"Goles Gritados"}</span>
                <span className="text-sm font-extrabold text-white">{stats.goalsScored}</span>
              </div>
              <div>
                <span className="text-[8px] text-zinc-500 font-bold tracking-widest block uppercase font-sans">{"Vallas Invictas"}</span>
                <span className="text-sm font-extrabold text-white">{stats.cleanSheets}</span>
              </div>
            </div>
          </div>

          {/* Fila 1 Derecha: Historial en El Fortín (Desglose) */}
          <div className="p-6 rounded-[8px] bg-[#1d211e] border border-zinc-800 flex flex-col justify-between min-h-[195px]">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
              {"Historial en El Fortín"}
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center my-auto">
              {/* Bloque Verde (Victorias) */}
              <div className="p-3.5 rounded-[8px] bg-[#105238]/15 border border-[#2d6a4f]/30">
                <span className="text-[9px] text-green-400 font-bold uppercase tracking-wider block">{"Victorias"}</span>
                <span className="text-xl font-black text-green-400 mt-1 block">{stats.localWins}</span>
              </div>
              {/* Bloque Blanco (Empates) */}
              <div className="p-3.5 rounded-[8px] bg-white/5 border border-white/15">
                <span className="text-[9px] text-zinc-200 font-bold uppercase tracking-wider block">{"Empates"}</span>
                <span className="text-xl font-black text-white mt-1 block">{stats.localDraws}</span>
              </div>
              {/* Bloque Negro (Derrotas) */}
              <div className="p-3.5 rounded-[8px] bg-black/45 border border-zinc-900">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">{"Derrotas"}</span>
                <span className="text-xl font-black text-zinc-450 mt-1 block">{stats.localLosses}</span>
              </div>
            </div>
          </div>

          {/* Fila 2 Izquierda: Asistencia a El Fortín (Fidelidad con Números Gigantes Resaltados) */}
          <div className="p-6 rounded-[8px] bg-gradient-to-br from-[#1d211e] to-zinc-900/30 border border-zinc-800 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-3">
                {"Asistencia a El Fortín"}
              </h3>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">{"Partidos Asistidos"}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">{stats.localAttended}</span>
                  <span className="text-zinc-650 text-xl">{"/"}</span>
                  <span className="text-zinc-550 text-xl font-medium">{stats.localPlayed}</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">{"Fidelidad"}</span>
                <span className="text-4xl font-extrabold text-[#2d6a4f] tracking-tighter">{stats.attendancePercentage}%</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2d6a4f]" 
                  style={{ width: `${stats.attendancePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Fila 2 Derecha: Efectividad de Victorias de Local (Números Gigantes Resaltados) */}
          <div className="p-6 rounded-[8px] bg-gradient-to-br from-[#1d211e] to-zinc-900/30 border border-zinc-800 flex flex-col justify-between min-h-[200px]">
            <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2 mb-3">
                {"Rendimiento de Local"}
              </h3>
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="space-y-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">{"Puntos Obtenidos"}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    {stats.localWins * 3 + stats.localDraws}
                  </span>
                  <span className="text-zinc-650 text-xl">{"/"}</span>
                  <span className="text-zinc-550 text-xl font-medium">{stats.localAttended * 3}</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">{"Efectividad"}</span>
                <span className="text-4xl font-extrabold text-[#2d6a4f] tracking-tighter">{stats.winPercentage}%</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2d6a4f]" 
                  style={{ width: `${stats.winPercentage}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Fila 3: Mejor y Peor Resultado Presenciado en El Fortín */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Mejor Resultado */}
          <div className="p-6 rounded-[8px] bg-gradient-to-br from-[#0d3d28]/40 via-[#1d211e] to-[#111412] border border-[#2d6a4f]/40 space-y-3">
            <div className="flex items-center gap-2 border-b border-[#2d6a4f]/20 pb-2">
              <span className="text-base">{"🏆"}</span>
              <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">{"Mejor Resultado Presenciado"}</h3>
            </div>
            {bestResult ? (
              <div className="space-y-2 pt-1">
                <p className="text-2xl font-black text-white tracking-tight">
                  {`${bestResult.goalsVM} - ${bestResult.goalsOpponent}`}
                  <span className="text-sm font-semibold text-zinc-400 ml-2">{`vs. ${bestResult.awayTeam}`}</span>
                </p>
                <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  <span>{`Fecha ${bestResult.fixtureRound}`}</span>
                  <span>{"•"}</span>
                  <span className="text-green-500">
                    {`+${bestResult.goalsVM! - bestResult.goalsOpponent!} goles de diferencia`}
                  </span>
                </div>
                {bestResult.scorers.length > 0 && (
                  <p className="text-[10px] text-zinc-500 italic">{"⚽ "}{bestResult.scorers.join(", ")}</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic pt-2">{"Aún no presenciaste una victoria en El Fortín."}</p>
            )}
          </div>

          {/* Peor Resultado */}
          <div className="p-6 rounded-[8px] bg-gradient-to-br from-black via-[#141414] to-[#111412] border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-base">{worstResult && worstResult.goalsVM! < worstResult.goalsOpponent! ? "😞" : "🤝"}</span>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {worstResult && worstResult.goalsVM! < worstResult.goalsOpponent!
                  ? "Peor Derrota Presenciada"
                  : "Empate Presenciado"}
              </h3>
            </div>
            {worstResult ? (
              <div className="space-y-2 pt-1">
                <p className="text-2xl font-black tracking-tight" style={{ color: worstResult.goalsVM! < worstResult.goalsOpponent! ? '#6b7280' : '#ffffff' }}>
                  {`${worstResult.goalsVM} - ${worstResult.goalsOpponent}`}
                  <span className="text-sm font-semibold text-zinc-400 ml-2">{`vs. ${worstResult.awayTeam}`}</span>
                </p>
                <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                  <span>{`Fecha ${worstResult.fixtureRound}`}</span>
                  {worstResult.goalsVM! < worstResult.goalsOpponent! && (
                    <>
                      <span>{"•"}</span>
                      <span className="text-zinc-600">
                        {`-${worstResult.goalsOpponent! - worstResult.goalsVM!} goles de diferencia`}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic pt-2">{"Aún no registrás derrotas ni empates en El Fortín."}</p>
            )}
          </div>

        </div>

        {/* 4. Tabla de Posiciones / Ranking de Hinchas */}
        {ranking.length > 0 && (
          <div className="p-6 rounded-[8px] bg-[#1d211e] border border-zinc-850 space-y-4 w-full">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <span className="text-base">{"🏆"}</span>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {"Tabla de Posiciones de la Hinchada (Fidelidad en El Fortín)"}
              </h3>
            </div>
            
            <div className="divide-y divide-zinc-850/60 max-h-[350px] overflow-y-auto pr-2">
              {ranking.map((row, idx) => {
                const isMe = row.id === userId;
                const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}°`;
                return (
                  <div 
                    key={row.id} 
                    className={`flex items-center justify-between py-3 px-2 rounded-[6px] transition-colors ${
                      isMe ? "bg-[#2d6a4f]/10 border border-[#2d6a4f]/25" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 text-sm font-mono text-zinc-400 font-black">{medal}</span>
                      <div className="h-8 w-8 overflow-hidden rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center">
                        <img
                          src={row.imageUrl}
                          alt={row.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                          {row.name}
                          {isMe && (
                            <span className="bg-[#2d6a4f]/30 border border-[#2d6a4f]/50 text-[9px] text-green-400 font-extrabold px-1.5 py-0.5 rounded-[4px] uppercase tracking-wider scale-90">
                              {"Tú"}
                            </span>
                          )}
                        </span>
                        <span className="text-[9px] text-[#2d6a4f] font-bold uppercase tracking-wider block mt-0.5">
                          {row.rankName}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-lg font-black text-white font-sans">{row.count}</span>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">{"Partidos"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Tabla del Historial de Asistencia General con pestañas de Local y Visitante/TV */}
        <HinchaHistorial matches={matches as any} userId={userId} />

      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-center">
        <p className="text-[10px] text-zinc-600 font-bold tracking-wider uppercase">
          {"El Fortín Digital — Bitácora Personal de Villa Mitre © 2026"}
        </p>
      </footer>
    </div>
  );
}
