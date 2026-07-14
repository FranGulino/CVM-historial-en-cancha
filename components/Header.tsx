"use client";

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const isPartidosActive = pathname.startsWith("/partidos");
  const isHinchaActive = pathname.startsWith("/hincha");

  return (
    <header className="absolute top-0 left-0 z-40 w-full bg-transparent">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Marca */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-[#1d211e] p-1 border border-zinc-800 transition-colors group-hover:border-[#2d6a4f]/50">
            <Image
              src="/club-villa-mitre-bahia-580x580.webp"
              alt="Escudo Villa Mitre"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight font-sans">
            <span className="text-base font-extrabold tracking-tight text-white leading-none">
              El Fortín
            </span>
            <span className="text-[10px] font-bold tracking-widest text-[#2d6a4f] uppercase">
              de Maipú y Necochea
            </span>
          </div>
        </Link>

        {/* Enlaces de Navegación del Centro (Estilo Captura con estado activo dinámico) */}
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

        {/* Acciones del Lado Derecho (Clerk integrado con estética de captura) */}
        <div className="flex items-center gap-6">
          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs font-bold text-zinc-400 tracking-wider uppercase">
                Panel
              </span>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-9 w-9 rounded-full border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500",
                  },
                }}
              />
            </div>
          </Show>
          
          <Show when="signed-out">
            <div className="flex items-center gap-5">
              <SignInButton mode="modal">
                <button className="text-xs font-bold tracking-wider uppercase text-zinc-300 hover:text-white transition-colors">
                  Acceso
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#2d6a4f]/50 hover:border-[#2d6a4f] bg-transparent px-5 text-xs font-bold tracking-wider uppercase text-zinc-200 hover:text-white transition-all hover:bg-[#2d6a4f]/10 active:scale-95">
                  Registrarse
                </button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}
