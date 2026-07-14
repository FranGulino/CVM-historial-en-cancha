"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logueamos el error para monitoreo en consola
    console.error("Error capturado en El Fortín:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#111412] text-[#e1e3de] px-4 text-center">
      {/* Glow verde sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-md space-y-6 flex flex-col items-center">
        {/* Escudo del club */}
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[#2d6a4f]/35 bg-[#1d211e] p-1.5 shadow-lg">
          <Image
            src="/club-villa-mitre-bahia-580x580.webp"
            alt="Escudo Villa Mitre"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
            {"¡Hubo un problema en el campo!"}
          </h2>
          <p className="text-sm text-zinc-400">
            {"No pudimos cargar la información en este momento. Puede ser un problema temporal de conexión con la base de datos."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 active:bg-green-800 transition-all text-xs font-bold uppercase tracking-wider text-white px-6 active:scale-95 shadow-md shadow-green-950/20"
          >
            {"🔄 Intentar de nuevo"}
          </button>
          <a
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-[8px] border border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all text-xs font-bold uppercase tracking-wider text-zinc-350 px-6 active:scale-95"
          >
            {"🏠 Volver al Inicio"}
          </a>
        </div>

        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest pt-4">
          {"El Fortín de Maipú y Necochea — Villa Mitre"}
        </p>
      </div>
    </div>
  );
}
