"use client";

import { useState, useTransition } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { toggleAttendance } from "@/app/actions/attendance";

interface AttendanceButtonsProps {
  matchId: string;
  activeType: "PRESENCIAL" | "A_LA_DISTANCIA" | null;
  isHome: boolean;
}

export default function AttendanceButtons({ matchId, activeType, isHome }: AttendanceButtonsProps) {
  const { isSignedIn } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [optimisticType, setOptimisticType] = useState<"PRESENCIAL" | "A_LA_DISTANCIA" | null>(activeType);

  const handleToggle = (type: "PRESENCIAL" | "A_LA_DISTANCIA") => {
    if (!isSignedIn) return; // Si no está firmado, el SignInButton maneja el click

    // Estado optimista inmediato para una interfaz ultra fluida (Wow UX)
    const newType = optimisticType === type ? null : type;
    setOptimisticType(newType);

    startTransition(async () => {
      try {
        await toggleAttendance(matchId, type);
      } catch (error) {
        // En caso de error, revertimos al estado anterior
        setOptimisticType(activeType);
        console.error("Error al registrar asistencia:", error);
      }
    });
  };

  const buttonClasses = (type: "PRESENCIAL" | "A_LA_DISTANCIA") => {
    const isActive = optimisticType === type;
    const isOtherActive = optimisticType !== null && !isActive;

    let base = "flex-1 py-2 px-3 text-xs font-bold rounded-md transition-all active:scale-95 flex items-center justify-center gap-1.5 border border-zinc-800 ";

    if (isPending) {
      base += "opacity-60 cursor-not-allowed ";
    }

    if (isActive) {
      base += type === "PRESENCIAL"
        ? "bg-green-700 hover:bg-green-600 text-white border-green-600 shadow-md shadow-green-950/20"
        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700 shadow-md";
    } else {
      base += "bg-zinc-950/40 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 ";
      if (isOtherActive) {
        base += "opacity-40 "; // Atenúa el botón no seleccionado
      }
    }

    return base;
  };

  const renderButton = (type: "PRESENCIAL" | "A_LA_DISTANCIA", label: string, icon: string) => {
    const btn = (
      <button
        onClick={() => handleToggle(type)}
        disabled={isPending}
        className={buttonClasses(type)}
      >
        <span>{icon}</span>
        <span>{label}</span>
      </button>
    );

    if (!isSignedIn) {
      return (
        <SignInButton mode="modal">
          {btn}
        </SignInButton>
      );
    }

    return btn;
  };

  return (
    <div className="flex gap-2 w-full mt-3 pt-3 border-t border-zinc-900">
      {renderButton("PRESENCIAL", isHome ? "Fui a la cancha" : "De visitante", isHome ? "🏟️" : "✈️")}
      {renderButton("A_LA_DISTANCIA", "A la distancia", "📺")}
    </div>
  );
}
