import { AttendanceType } from "@prisma/client";
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
    ? match.attendances.find(att => att.userId === currentUserId)
    : null;
  
  const activeAttendanceType = userAttendance ? userAttendance.type : null;

  // Formateamos la fecha en español (ej. "Dom 12 de Jul")
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    });
  };

  // Estilos de borde y fondo según el resultado de Villa Mitre (colores del sistema de diseño)
  const cardClasses = () => {
    let base = "relative flex flex-col justify-between p-4 rounded-lg border transition-all duration-200 hover:scale-[1.01] ";
    
    switch (resultType) {
      case "VICTORIA":
        return base + "border-green-900/40 bg-zinc-950/40 hover:border-green-700/50 shadow-sm shadow-green-950/5";
      case "DERROTA":
        return base + "border-red-950/50 bg-zinc-950/30 hover:border-red-900/30";
      case "EMPATE":
        return base + "border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700/60";
      case "FUTURO":
      default:
        return base + "border-dashed border-zinc-800 bg-zinc-950/10 hover:border-zinc-700/40";
    }
  };

  const badgeClasses = () => {
    switch (resultType) {
      case "VICTORIA":
        return "bg-green-950/60 text-green-400 border border-green-800/30";
      case "DERROTA":
        return "bg-red-950/40 text-red-400 border border-red-900/20";
      case "EMPATE":
        return "bg-zinc-800/60 text-zinc-400 border border-zinc-700/40";
      case "FUTURO":
      default:
        return "bg-zinc-900 text-zinc-500 border border-zinc-800";
    }
  };

  const resultLabel = () => {
    switch (resultType) {
      case "VICTORIA": return "Ganó";
      case "DERROTA": return "Perdió";
      case "EMPATE": return "Empató";
      case "FUTURO": return "Próximo";
    }
  };

  return (
    <div className={cardClasses()}>
      <div>
        {/* Cabecera de la Tarjeta */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">
            Fecha {match.fixtureRound} — {match.phase.replace("_", " ")}
          </span>
          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${badgeClasses()}`}>
            {resultLabel()}
          </span>
        </div>

        {/* Enfrentamiento */}
        <div className="flex flex-col gap-2">
          {/* Local */}
          <div className="flex justify-between items-center">
            <span className={`text-sm font-semibold ${match.homeTeam === "Villa Mitre" ? "text-white font-bold" : "text-zinc-400"}`}>
              {match.homeTeam}
            </span>
            {isPlayed && (
              <span className={`text-sm font-extrabold font-mono ${match.homeTeam === "Villa Mitre" ? "text-white" : "text-zinc-400"}`}>
                {match.homeTeam === "Villa Mitre" ? match.goalsVM : match.goalsOpponent}
              </span>
            )}
          </div>
          {/* Visitante */}
          <div className="flex justify-between items-center">
            <span className={`text-sm font-semibold ${match.awayTeam === "Villa Mitre" ? "text-white font-bold" : "text-zinc-400"}`}>
              {match.awayTeam}
            </span>
            {isPlayed && (
              <span className={`text-sm font-extrabold font-mono ${match.awayTeam === "Villa Mitre" ? "text-white" : "text-zinc-400"}`}>
                {match.awayTeam === "Villa Mitre" ? match.goalsVM : match.goalsOpponent}
              </span>
            )}
          </div>
        </div>

        {/* Info y Goleadores */}
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-zinc-500">
              📅 {formatDate(match.date)}
            </span>
          </div>
          {isPlayed && match.scorers.length > 0 && (
            <div className="text-[10px] text-zinc-500 italic mt-1.5 pt-1.5 border-t border-zinc-900">
              ⚽ {match.scorers.join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Botones de Asistencia */}
      <AttendanceButtons matchId={match.id} activeType={activeAttendanceType} />
    </div>
  );
}
