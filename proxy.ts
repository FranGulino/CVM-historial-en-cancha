import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Ignorar las llamadas internas de Next.js y los archivos estáticos
    "/((?!_next|[^?]*\\.[\\w]+$|_next/image|_next/video|favicon\\.ico).*)",
    // Ejecutar siempre para las rutas de API
    "/(api|trpc)(.*)",
  ],
};
