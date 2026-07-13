import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 flex flex-col items-center">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
            Mi Historial de Cancha
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Villa Mitre — Bitácora del Hincha
          </p>
        </div>
        
        <div className="mt-8 bg-zinc-900/50 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 shadow-2xl">
          <SignIn 
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-white text-xl font-bold",
                headerSubtitle: "text-zinc-400 text-sm",
                socialButtonsBlockButton: "bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700",
                socialButtonsBlockButtonText: "text-white font-medium",
                formButtonPrimary: "bg-green-600 hover:bg-green-500 text-white font-semibold shadow-md",
                footerActionLink: "text-green-400 hover:text-green-300",
                formFieldLabel: "text-zinc-300",
                formFieldInput: "bg-zinc-800 border-zinc-700 text-white focus:ring-green-500 focus:border-green-500",
                identityPreviewText: "text-zinc-300",
                identityPreviewEditButton: "text-green-400 hover:text-green-300",
                dividerLine: "bg-zinc-800",
                dividerText: "text-zinc-500"
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
