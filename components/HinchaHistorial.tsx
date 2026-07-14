"use client";

import { useState } from "react";

interface MatchType {
  id: string;
  date: Date;
  fixtureRound: number;
  phase: string;
  homeTeam: string;
  awayTeam: string;
  goalsVM: number | null;
  goalsOpponent: number | null;
  scorers: string[];
  attendances: {
    type: "PRESENCIAL" | "A_LA_DISTANCIA";
    userId: string;
  }[];
}

interface HinchaHistorialProps {
  matches: MatchType[];
  userId: string | null;
}

export default function HinchaHistorial({ matches, userId }: HinchaHistorialProps) {
  const [activeTab, setActiveTab] = useState<"LOCAL" | "DISTANCIA">("LOCAL");

  // Filtramos la asistencia del usuario actual y la ordenamos de más reciente a más antiguo (descendente)
  const userAttendances = matches
    .filter((match) => match.attendances.some((att) => att.userId === userId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Dividimos en Local (PRESENCIAL en El Fortín) y Visitante/Distancia
  const localMatches = userAttendances.filter((match) => {
    const isLocal = match.homeTeam === "Villa Mitre";
    const userAtt = match.attendances.find((att) => att.userId === userId);
    return isLocal && userAtt?.type === "PRESENCIAL";
  });

  const distanciaMatches = userAttendances.filter((match) => {
    const isLocal = match.homeTeam === "Villa Mitre";
    const userAtt = match.attendances.find((att) => att.userId === userId);
    // Es a la distancia si el tipo es A_LA_DISTANCIA o si es de visitante
    return userAtt?.type === "A_LA_DISTANCIA" || !isLocal;
  });

  const currentList = activeTab === "LOCAL" ? localMatches : distanciaMatches;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
  };

  return (
    <div className="p-6 rounded-[8px] bg-[#1d211e] border border-zinc-850 space-y-6">
      
      {/* Cabecera y Pestañas del Historial */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-3">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          {"Mi Historial de Asistencia"}
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("LOCAL")}
            className={`h-7 px-3.5 text-[9px] font-black tracking-wider uppercase rounded-[8px] border transition-all ${
              activeTab === "LOCAL"
                ? "bg-[#2d6a4f] border-[#2d6a4f] text-white shadow-sm shadow-green-950/20"
                : "bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {"🏟️ En El Fortín"}
          </button>
          <button
            onClick={() => setActiveTab("DISTANCIA")}
            className={`h-7 px-3.5 text-[9px] font-black tracking-wider uppercase rounded-[8px] border transition-all ${
              activeTab === "DISTANCIA"
                ? "bg-[#2d6a4f] border-[#2d6a4f] text-white shadow-sm shadow-green-950/20"
                : "bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {"📺 Visitante / TV"}
          </button>
        </div>
      </div>

      {/* Listado de partidos filtrados por pestaña */}
      {currentList.length === 0 ? (
        <p className="text-xs text-zinc-500 italic text-center py-6">
          {activeTab === "LOCAL" 
            ? "Aún no registraste asistencias presenciales de local en El Fortín."
            : "Aún no registraste partidos de visitante o a la distancia."}
        </p>
      ) : (
        <div className="divide-y divide-[#414942]/20 max-h-[350px] overflow-y-auto pr-2 space-y-1 scrollbar-thin">
          {currentList.map((match) => {
            const isLocal = match.homeTeam === "Villa Mitre";
            const userAtt = match.attendances.find((att) => att.userId === userId);
            
            // Deducimos el color del marcador en base a la paleta tricolor
            let scoreColor = "text-white";
            if (match.goalsVM !== null && match.goalsOpponent !== null) {
              if (match.goalsVM > match.goalsOpponent) scoreColor = "text-[#4ade80]"; // Verde brillante
              else if (match.goalsVM < match.goalsOpponent) scoreColor = "text-zinc-500"; // Gris/Negro para derrotas, sin rojo!
              else scoreColor = "text-white"; // Blanco para empates
            }

            return (
              <div key={match.id} className="py-3.5 flex justify-between items-center text-xs hover:bg-zinc-900/10 transition-colors rounded-sm px-1 gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="font-bold text-white tracking-tight truncate">
                    {match.homeTeam === "Villa Mitre" ? "VILLA MITRE" : match.homeTeam} {"vs."} {match.awayTeam === "Villa Mitre" ? "VILLA MITRE" : match.awayTeam}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                    <span>{"Fecha"} {match.fixtureRound}</span>
                    <span>{"•"}</span>
                    <span>{formatDate(match.date)}</span>
                    <span>{"•"}</span>
                    <span className="text-[8px] text-zinc-600">
                      {isLocal ? "Local" : "Visitante"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-mono font-black text-sm tabular-nums ${scoreColor}`}>
                    {match.goalsVM} {"-"} {match.goalsOpponent}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                    userAtt?.type === "PRESENCIAL"
                      ? "bg-[#2d6a4f]/20 text-[#2d6a4f] border border-[#2d6a4f]/30"
                      : "bg-zinc-800 text-zinc-450 border border-zinc-700/50"
                  }`}>
                    {userAtt?.type === "PRESENCIAL" ? "🏟️ Cancha" : "📺 TV"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
