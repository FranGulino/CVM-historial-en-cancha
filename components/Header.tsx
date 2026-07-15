"use client";

import { SignInButton, SignUpButton, Show, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";

export default function Header() {
  const pathname = usePathname();
  const { user } = useUser();

  // Ocultar el header global por completo en el chat del asistente
  if (pathname === "/asistente") return null;

  const isHomeActive = pathname === "/";
  const isPartidosActive = pathname.startsWith("/partidos");
  const isHinchaActive = pathname.startsWith("/hincha");

  return (
    <header className="absolute top-0 left-0 z-40 w-full bg-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Marca */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/club-escudo-villa-mitre-logo-png_seeklogo-461955.webp"
              alt="Escudo Villa Mitre"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex items-baseline gap-1 font-sans">
            <span className="text-lg font-extrabold tracking-tight text-white">
              El Fortín
            </span>
            <span className="text-lg font-extrabold tracking-tight text-[#2d6a4f]">
              Digital
            </span>
          </div>
        </Link>

        {/* Enlaces de Navegación del Centro (Estilo original y unificado) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase">
          <Link
            href="/"
            className={`pb-1 transition-all ${
              isHomeActive
                ? "text-white border-b-2 border-[#2d6a4f] font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Institucional
          </Link>
          <Link
            href="/partidos"
            className={`pb-1 transition-all ${
              isPartidosActive
                ? "text-white border-b-2 border-[#2d6a4f] font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Partidos
          </Link>
          <Link
            href="/hincha"
            className={`pb-1 transition-all ${
              isHinchaActive
                ? "text-white border-b-2 border-[#2d6a4f] font-bold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Perfil
          </Link>
        </nav>

        {/* Acciones del Lado Derecho (Clerk integrado de forma personalizada) */}
        <div className="flex items-center gap-6">
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9 rounded-full border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500",
                },
              }}
            />
          </Show>
          
          <Show when="signed-out">
            <div className="flex items-center gap-5">
              <SignInButton mode="redirect" fallbackRedirectUrl="/">
                <button className="text-xs font-bold tracking-wider uppercase text-zinc-300 hover:text-white transition-colors">
                  Acceso
                </button>
              </SignInButton>
              <SignUpButton mode="redirect" fallbackRedirectUrl="/">
                <button className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#2d6a4f]/50 hover:border-[#2d6a4f] bg-transparent px-5 text-xs font-bold tracking-wider uppercase text-zinc-200 hover:text-white transition-all hover:bg-[#2d6a4f]/10 active:scale-95">
                  Registrarse
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      </div>

      {/* Botonera de Navegación Móvil Flotante (Pill-shaped app bar simplificada) */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-around w-[90%] max-w-[360px] h-14 rounded-full border border-[#2d6a4f]/25 bg-[#1d211e]/90 backdrop-blur-md px-6 shadow-2xl shadow-black/80">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold tracking-wider uppercase transition-colors ${
            isHomeActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span className="text-base leading-none">{"🏛️"}</span>
          <span>{"Club"}</span>
        </Link>
        <Link
          href="/partidos"
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold tracking-wider uppercase transition-colors ${
            isPartidosActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span className="text-base leading-none">{"⚽"}</span>
          <span>{"Partidos"}</span>
        </Link>
        <Link
          href="/hincha"
          className={`flex flex-col items-center gap-0.5 text-[9px] font-bold tracking-wider uppercase transition-colors ${
            isHinchaActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span className="text-base leading-none">{"👤"}</span>
          <span>{"Perfil"}</span>
        </Link>
      </nav>

      {/* Widget de Chat del DT Inteligente (Solo visible en la página Institucional / Home) */}
      {pathname === "/" && <ChatWidget />}
    </header>
  );
}
