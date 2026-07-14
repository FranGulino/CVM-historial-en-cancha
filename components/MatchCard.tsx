import { AttendanceType } from "@prisma/client";
import Image from "next/image";
import AttendanceButtons from "./AttendanceButtons";

interface MatchCardProps {
  match: {
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
      type: AttendanceType;
      userId: string;
    }[];
  };
  currentUserId: string | null;
}

export default function MatchCard({ match, currentUserId }: MatchCardProps) {
  const isPlayed = match.goalsVM !== null && match.goalsOpponent !== null;

  // Deducimos el resultado del partido desde la perspectiva de Villa Mitre
  let resultType: "VICTORIA" | "EMPATE" | "DERROTA" | "FUTURO" = "FUTURO";

  if (isPlayed) {
    const goalsVM = match.goalsVM!;
    const goalsOpponent = match.goalsOpponent!;
    if (goalsVM > goalsOpponent) {
      resultType = "VICTORIA";
    } else if (goalsVM === goalsOpponent) {
      resultType = "EMPATE";
    } else {
      resultType = "DERROTA";
    }
  }

  // Buscamos si el usuario actual asistió y el tipo de asistencia
  const userAttendance = currentUserId
    ? match.attendances.find((att) => att.userId === currentUserId)
    : null;

  const activeAttendanceType = userAttendance ? userAttendance.type : null;

  // Formateamos la fecha en español (ej. "Dom, 12 de Jul")
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
  };

  // Badge de resultado (V/E/D) con colores tricolores de Villa Mitre
  const badgeClasses = () => {
    switch (resultType) {
      case "VICTORIA":
        return "bg-[#2d6a4f] text-white border border-[#2d6a4f]/50 font-black shadow-sm shadow-green-900/30";
      case "DERROTA":
        return "bg-zinc-950 text-zinc-400 border border-zinc-800 font-black";
      case "EMPATE":
        return "bg-white/10 text-white border border-white/20 font-black";
      case "FUTURO":
      default:
        return "bg-zinc-900 text-zinc-500 border border-zinc-800 font-bold";
    }
  };

  // Clases condicionales tricolores para el fondo y bordes de la tarjeta
  const cardClasses = () => {
    let base = "flex flex-col justify-between p-6 rounded-[8px] border transition-all duration-300 hover:scale-[1.01] group ";
    
    switch (resultType) {
      case "VICTORIA":
        // Verde Villa Mitre: borde y degradado verde hacia el fondo oscuro
        return base + "border-[#2d6a4f]/50 bg-gradient-to-br from-[#0d3d28]/40 via-[#1d211e] to-[#111412] hover:border-[#2d6a4f]/80 hover:shadow-lg hover:shadow-green-950/20";
      case "DERROTA":
        // Negro profundo: muy oscuro, casi puro negro, borde gris muy tenue
        return base + "border-zinc-900 bg-gradient-to-br from-black via-[#141414] to-[#111412] hover:border-zinc-800";
      case "EMPATE":
        // Blanco/Plata: sutil, fondo con toque blanco y borde plateado
        return base + "border-white/10 bg-gradient-to-br from-white/5 via-[#1d211e] to-[#111412] hover:border-white/20";
      case "FUTURO":
      default:
        return base + "border-dashed border-zinc-800 bg-zinc-950/10 hover:border-[#2d6a4f]/30";
    }
  };

  const resultLabel = () => {
    switch (resultType) {
      case "VICTORIA":
        return "V";
      case "DERROTA":
        return "D";
      case "EMPATE":
        return "E";
      case "FUTURO":
        return "PROX";
    }
  };

  // Componente interno para dibujar el escudo del club de forma premium
  const TeamShield = ({ teamName }: { teamName: string }) => {
    const isVM = teamName === "Villa Mitre";

    if (isVM) {
      return (
        <div className="relative h-12 w-12 flex-shrink-0 flex items-center justify-center">
          <Image
            src="/club-escudo-villa-mitre-logo-png_seeklogo-461955.webp"
            alt="Villa Mitre"
            fill
            className="object-contain"
          />
        </div>
      );
    }

    // Escudo genérico premium para los rivales utilizando sus siglas
    const cleanName = teamName
      .replace(/\(.*?\)/g, "") // Remueve todo lo que esté entre paréntesis, ej: (Rawson), (MdP)
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "") // Remueve símbolos
      .trim();
    
    const initials = cleanName
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-[#111412] border border-zinc-800 flex items-center justify-center shadow-inner group-hover:border-zinc-700 transition-colors">
        <span className="text-xs font-extrabold text-zinc-400 tracking-wider font-sans">
          {initials}
        </span>
      </div>
    );
  };

  return (
    <div className={cardClasses()}>
      <div>
        {/* Cabecera de la Tarjeta (Fecha e Indicador de resultado) */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-white tracking-wide uppercase">
            {"Fecha"} {match.fixtureRound}
          </span>
          <span className={`text-[10px] font-black tracking-wider px-3 py-0.5 rounded-full ${badgeClasses()}`}>
            {resultLabel()}
          </span>
        </div>

        {/* Sección de Escudos Enfrentados y Marcador Central */}
        <div className="flex items-center justify-between py-2 mb-4 gap-2">
          {/* Equipo Local */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0 text-center">
            <TeamShield teamName={match.homeTeam} />
            <span className={`text-xs font-bold tracking-tight truncate w-full ${match.homeTeam === "Villa Mitre" ? "text-white font-extrabold" : "text-zinc-400"}`}>
              {match.homeTeam === "Villa Mitre" ? "VILLA MITRE" : match.homeTeam}
            </span>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mt-0.5">
              {"Local"}
            </span>
          </div>

          {/* Marcador Central */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 min-w-[75px] text-center">
            {isPlayed ? (
              <div className={`text-2xl font-black tracking-tighter tabular-nums font-sans whitespace-nowrap ${
                resultType === "VICTORIA" ? "text-[#4ade80]" :
                resultType === "EMPATE" ? "text-white" :
                "text-zinc-500"
              }`}>
                {match.goalsVM !== null && match.goalsOpponent !== null ? (
                  match.homeTeam === "Villa Mitre" ? (
                    `${match.goalsVM} - ${match.goalsOpponent}`
                  ) : (
                    `${match.goalsOpponent} - ${match.goalsVM}`
                  )
                ) : (
                  "- - -"
                )}
              </div>
            ) : (
              <div className="text-sm font-bold text-zinc-650 uppercase tracking-widest whitespace-nowrap">
                {"VS"}
              </div>
            )}
            <span className="text-[9px] font-bold text-zinc-500 tracking-wider mt-1 whitespace-nowrap">
              {formatDate(match.date)}
            </span>
          </div>

          {/* Equipo Visitante */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0 text-center">
            <TeamShield teamName={match.awayTeam} />
            <span className={`text-xs font-bold tracking-tight truncate w-full ${match.awayTeam === "Villa Mitre" ? "text-white font-extrabold" : "text-zinc-400"}`}>
              {match.awayTeam === "Villa Mitre" ? "VILLA MITRE" : match.awayTeam}
            </span>
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mt-0.5">
              {"Visitante"}
            </span>
          </div>
        </div>

        {/* Detalle de Goleadores (si aplica) */}
        {isPlayed && match.scorers.length > 0 && (
          <div className="text-[10px] text-zinc-500 italic text-center mb-4 leading-relaxed">
            {"⚽"} {match.scorers.join(", ")}
          </div>
        )}
      </div>

      {/* Footer de Tarjeta (Sede, Competición y Botones de Asistencia) */}
      <div className="mt-2 space-y-3">
        {/* Metadato del Estadio y Competición */}
        <div className="pt-3 border-t border-[#414942]/30 flex items-center justify-between text-[9px] font-bold text-zinc-500 tracking-wider uppercase">
          <span>
            {match.homeTeam === "Villa Mitre" ? "🏟️ El Fortín" : "✈️ Visitante"}
          </span>
          <span>
            {match.phase.replace("_", " ")}
          </span>
        </div>

        {/* Botones Interactivos de Asistencia */}
        {isPlayed ? (
          <AttendanceButtons matchId={match.id} activeType={activeAttendanceType} isHome={match.homeTeam === "Villa Mitre"} />
        ) : (
          <div className="flex items-center justify-center h-10 w-full rounded-[8px] bg-zinc-950/30 border border-zinc-900 text-[9px] font-bold text-zinc-650 uppercase tracking-widest">
            {"⏳ Partido Pendiente"}
          </div>
        )}
      </div>
    </div>
  );
}
