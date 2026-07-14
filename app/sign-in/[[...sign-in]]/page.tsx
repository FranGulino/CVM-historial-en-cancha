import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#111412] py-12 px-4">

      {/* Fondo: imagen de hinchada específica */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hinchadavm.jpeg"
          alt="Hinchada Villa Mitre"
          fill
          className="object-cover object-center brightness-[0.2] mix-blend-overlay"
          priority
        />
      </div>

      {/* Gradiente oscuro verde (tonos verde Villa Mitre esmeralda) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#082416]/90 via-[#111412]/85 to-[#0b291a]/90" />

      {/* Contenedor principal simétrico */}
      <div className="relative z-20 flex flex-col items-center gap-6 w-full max-w-sm">

        {/* Encabezado custom sin escudo */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-sans leading-tight">
            {"Historial en El Fortín"}
          </h1>
          <p className="text-[10px] font-bold text-[#2d6a4f] uppercase tracking-widest">
            {"Bitácora del Hincha"}
          </p>
        </div>

        {/* Formulario de Clerk — sin contenedor visual que pelee con la tarjeta de Clerk */}
        <div className="w-full flex justify-center">
          <SignIn
            path="/sign-in"
            appearance={{
              elements: {
                card: "bg-white shadow-2xl rounded-[8px] border border-zinc-200/50 w-full",
                logoBox: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-[8px] transition-all",
                socialButtonsBlockButtonText: "text-zinc-800 font-semibold",
                formButtonPrimary:
                  "bg-[#2d6a4f] hover:bg-[#2d6a4f]/90 text-white font-bold rounded-[8px] shadow-sm transition-all",
                footerActionLink: "text-[#2d6a4f] hover:text-green-700 font-bold",
                footerActionText: "text-zinc-500",
                formFieldLabel: "text-zinc-650 text-xs font-bold uppercase tracking-wider",
                formFieldInput:
                  "bg-white border border-zinc-300 text-zinc-900 rounded-[8px] focus:ring-1 focus:ring-[#2d6a4f] focus:border-[#2d6a4f] placeholder:text-zinc-400",
                dividerLine: "bg-zinc-200",
                dividerText: "text-zinc-500 text-xs",
                footer: "hidden",
              },
            }}
          />
        </div>

        {/* Frase del hincha al pie */}
        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest text-center mt-2">
          {"A Villa Mitre yo lo sigo siempre a todos lados..."}
        </p>
      </div>
    </div>
  );
}
