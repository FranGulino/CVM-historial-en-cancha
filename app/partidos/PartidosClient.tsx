"use client";

import { useState } from "react";
import MatchCard from "@/components/MatchCard";
import { AttendanceType, MatchPhase } from "@prisma/client";

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
    type: AttendanceType;
    userId: string;
  }[];
}

interface PartidosClientProps {
  matches: MatchType[];
  userId: string | null;
}

export default function PartidosClient({ matches, userId }: PartidosClientProps) {
  // Pestaña de Fase activa (Fase 1 por defecto)
  const [activePhase, setActivePhase] = useState<MatchPhase>(MatchPhase.FASE_1);
  
  // Sub-filtro de Vuelta (solo aplicable para Fase 1)
  const [activeVuelta, setActiveVuelta] = useState<1 | 2>(1);

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResult, setFilterResult] = useState<"TODOS" | "VICTORIA" | "EMPATE" | "DERROTA">("TODOS");
  const [filterVenue, setFilterVenue] = useState<"TODOS" | "LOCAL" | "VISITANTE">("TODOS");

  // Paginación (solo se usará para fases que no sean Fase 1)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Filtrar los partidos por Fase, Búsqueda, Localía y Resultado
  const baseFiltered = matches.filter((match) => {
    // Filtro estricto por la pestaña de Fase seleccionada
    if (match.phase !== activePhase) return false;

    // Si es Fase 1, aplicamos la división por Vuelta
    if (activePhase === MatchPhase.FASE_1) {
      if (activeVuelta === 1 && match.fixtureRound > 9) return false;
      if (activeVuelta === 2 && match.fixtureRound < 10) return false;
    }

    // Filtro de búsqueda por rival
    const opponent = match.homeTeam === "Villa Mitre" ? match.awayTeam : match.homeTeam;
    const matchesSearch = opponent.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de localía
    const isLocal = match.homeTeam === "Villa Mitre";
    let matchesVenue = true;
    if (filterVenue === "LOCAL") matchesVenue = isLocal;
    if (filterVenue === "VISITANTE") matchesVenue = !isLocal;

    // Filtro de resultado
    const isPlayed = match.goalsVM !== null && match.goalsOpponent !== null;
    let matchesResult = true;

    if (filterResult !== "TODOS") {
      if (!isPlayed) {
        matchesResult = false;
      } else {
        const goalsVM = match.goalsVM!;
        const goalsOpponent = match.goalsOpponent!;
        const hasWon = goalsVM > goalsOpponent;
        const hasDrawn = goalsVM === goalsOpponent;

        if (filterResult === "VICTORIA") matchesResult = hasWon;
        if (filterResult === "EMPATE") matchesResult = hasDrawn;
        if (filterResult === "DERROTA") matchesResult = !hasWon && !hasDrawn;
      }
    }

    return matchesSearch && matchesVenue && matchesResult;
  });

  // 2. Inyectar Fecha Libre de forma ordenada (solo si es Fase 1)
  let itemsToRender: any[] = [...baseFiltered];

  if (activePhase === MatchPhase.FASE_1) {
    if (activeVuelta === 1) {
      const freeDay = {
        id: "free-3",
        isFreeDay: true,
        fixtureRound: 3,
      };
      // Solo agregamos la fecha libre si no hay filtros de búsqueda o resultado activos que la oculten
      if (!searchTerm && filterResult === "TODOS" && filterVenue === "TODOS") {
        itemsToRender.push(freeDay);
      }
    } else if (activeVuelta === 2) {
      const freeDay = {
        id: "free-12",
        isFreeDay: true,
        fixtureRound: 12,
      };
      if (!searchTerm && filterResult === "TODOS" && filterVenue === "TODOS") {
        itemsToRender.push(freeDay);
      }
    }
    // Ordenamos cronológicamente por número de fecha
    itemsToRender.sort((a, b) => a.fixtureRound - b.fixtureRound);
  }

  // 3. Paginación (solo para fases distintas de Fase 1 para no cortar las vueltas)
  const isFase1 = activePhase === MatchPhase.FASE_1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const paginatedItems = isFase1 
    ? itemsToRender 
    : itemsToRender.slice(indexOfFirstItem, indexOfLastItem);
    
  const totalPages = isFase1 ? 1 : Math.ceil(itemsToRender.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePhaseChange = (phase: MatchPhase) => {
    setActivePhase(phase);
    setSearchTerm("");
    setFilterResult("TODOS");
    setFilterVenue("TODOS");
    setCurrentPage(1);
  };

  const phaseTabs = [
    { value: MatchPhase.FASE_1, label: "Fase 1 (Zona A)" },
    { value: MatchPhase.NONAGONAL, label: "Nonagonal 2026" },
    { value: MatchPhase.ETAPA_ELIMINATORIA, label: "Etapa Eliminatoria" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8 bg-[#111412] font-sans">
      
      {/* Cabecera del Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#414942]/20 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans uppercase">
            {"Fixture Federal A 2026"}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
            {"Bitácora interactiva de asistencia y seguimiento de Villa Mitre"}
          </p>
        </div>
      </div>

      {/* Pestañas de Fases del Torneo */}
      <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto pb-px">
        {phaseTabs.map((tab) => {
          const isActive = activePhase === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => handlePhaseChange(tab.value)}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-[#2d6a4f] text-white font-extrabold"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Pestañas secundarias de Vueltas (solo si es Fase 1) */}
      {isFase1 && (
        <div className="flex gap-2">
          <button
            onClick={() => setActiveVuelta(1)}
            className={`h-8 px-4 text-[10px] font-extrabold tracking-wider uppercase rounded-[8px] border transition-all ${
              activeVuelta === 1
                ? "bg-[#2d6a4f] border-[#2d6a4f] text-white"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {"1ª Vuelta (Fechas 1-9)"}
          </button>
          <button
            onClick={() => setActiveVuelta(2)}
            className={`h-8 px-4 text-[10px] font-extrabold tracking-wider uppercase rounded-[8px] border transition-all ${
              activeVuelta === 2
                ? "bg-[#2d6a4f] border-[#2d6a4f] text-white"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {"2ª Vuelta (Fechas 10-18)"}
          </button>
        </div>
      )}

      {/* Componentes de Filtrado Horizontal */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Barra de Búsqueda */}
        <div className="relative w-full md:w-5/12 h-10">
          <span className="absolute inset-y-0 left-3 flex items-center text-zinc-650">
            {"🔍"}
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar rival..."
            className="w-full h-full pl-9 pr-4 rounded-[8px] bg-[#1d211e] border border-[#414942]/50 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#2d6a4f] transition-colors"
          />
        </div>

        {/* Filtros Dropdowns */}
        <div className="flex w-full md:w-auto gap-3 items-center justify-end">
          {/* Dropdown Localía */}
          <select
            value={filterVenue}
            onChange={(e) => {
              setFilterVenue(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-[8px] bg-[#1d211e] border border-[#414942]/50 text-xs font-bold text-zinc-400 focus:outline-none focus:border-[#2d6a4f] focus:text-white transition-colors cursor-pointer"
          >
            <option value="TODOS">{"Sede: Todos"}</option>
            <option value="LOCAL">{"Sede: El Fortín (Local)"}</option>
            <option value="VISITANTE">{"Sede: Visitante"}</option>
          </select>

          {/* Dropdown Resultado */}
          <select
            value={filterResult}
            onChange={(e) => {
              setFilterResult(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-[8px] bg-[#1d211e] border border-[#414942]/50 text-xs font-bold text-zinc-400 focus:outline-none focus:border-[#2d6a4f] focus:text-white transition-colors cursor-pointer"
          >
            <option value="TODOS">{"Resultado: Todos"}</option>
            <option value="VICTORIA">{"Resultado: Victoria"}</option>
            <option value="EMPATE">{"Resultado: Empate"}</option>
            <option value="DERROTA">{"Resultado: Derrota"}</option>
          </select>
        </div>
      </div>

      {/* Cartel explicativo de asistencia */}
      <div className="rounded-[8px] bg-[#1d211e]/45 border border-[#2d6a4f]/20 p-3 sm:p-4 flex flex-col md:flex-row justify-around items-start md:items-center gap-3 text-[10px] text-zinc-450 tracking-wide font-sans leading-relaxed">
        <div className="flex items-center gap-2">
          <span className="text-sm">{"🏟️"}</span>
          <p>
            <strong className="text-zinc-200">{"Cancha (Presencial):"}</strong>{" Estuve presente en el estadio (aplica local en El Fortín y viajes de visitante)."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{"📺"}</span>
          <p>
            <strong className="text-zinc-200">{"TV / Radio (Distancia):"}</strong>{" Alenté a la distancia por transmisión oficial (TV, Radio o Streaming)."}
          </p>
        </div>
      </div>

      {/* Grid de Partidos */}
      {paginatedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-[8px] border border-dashed border-zinc-800 bg-zinc-950/20 text-center">
          <span className="text-3xl mb-3">🏟️</span>
          <p className="text-sm font-bold text-white">
            {activePhase === MatchPhase.NONAGONAL 
              ? "El Nonagonal todavía no ha comenzado" 
              : activePhase === MatchPhase.ETAPA_ELIMINATORIA 
              ? "Etapa Eliminatoria no disputada"
              : "No se encontraron registros"}
          </p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm">
            {activePhase === MatchPhase.NONAGONAL 
              ? "Villa Mitre clasificó de forma directa. En cuanto se sortee el fixture, se inyectarán las fechas de esta fase." 
              : activePhase === MatchPhase.ETAPA_ELIMINATORIA
              ? "Etapa posterior a la Fase 1 y Nonagonal."
              : "Probá modificando la búsqueda o los filtros."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paginatedItems.map((item) => {
            // Renderizado especial si es Fecha Libre
            if (item.isFreeDay) {
              return (
                <div 
                  key={item.id} 
                  className="flex flex-col justify-center items-center p-6 rounded-[8px] border border-dashed border-[#2d6a4f]/40 bg-[#1d211e]/40 text-center min-h-[220px] space-y-3"
                >
                  <span className="text-2xl">☕</span>
                  <div>
                    <span className="text-xs font-bold text-white tracking-wide block uppercase">
                      {"Fecha"} {item.fixtureRound}
                    </span>
                    <span className="text-[9px] font-extrabold text-[#2d6a4f] tracking-widest uppercase block mt-1">
                      {"Fecha Libre"}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed">
                    {"Villa Mitre no disputó partido en esta jornada por fixture impar de la zona."}
                  </p>
                </div>
              );
            }

            return <MatchCard key={item.id} match={item} currentUserId={userId} />;
          })}

          {/* Tarjeta interactiva dashed de registro retroactivo al final */}
          {!isFase1 && currentPage === totalPages && (
            <div className="flex flex-col items-center justify-center p-6 rounded-[8px] border border-dashed border-[#414942]/65 bg-zinc-950/10 hover:border-zinc-700/40 transition-all text-center min-h-[260px]">
              <span className="text-2xl text-[#2d6a4f] mb-3">{"➕"}</span>
              <h4 className="text-xs font-bold text-white">{"Registrar Partido Retroactivo"}</h4>
              <p className="text-[10px] text-zinc-500 max-w-xs mt-1.5 leading-relaxed">
                {"¿Asististe a un partido clásico que no está cargado en el fixture? Registrá la fecha y guardalo en tu historial."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Controles de Paginación (solo para fases distintas de Fase 1) */}
      {!isFase1 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 border-t border-[#414942]/20 pt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex h-9 items-center justify-center rounded-[8px] bg-zinc-900 border border-zinc-850 px-4 text-xs font-bold text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {"Anterior"}
          </button>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono">
            {currentPage} {"/"} {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex h-9 items-center justify-center rounded-[8px] bg-zinc-900 border border-zinc-850 px-4 text-xs font-bold text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {"Siguiente"}
          </button>
        </div>
      )}

    </div>
  );
}
