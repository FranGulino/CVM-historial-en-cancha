import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/partidos(.*)", "/hincha(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Ignorar las llamadas internas de Next.js y los archivos estáticos
    "/((?!_next|[^?]*\\.[\\w]+$|_next/image|_next/video|favicon\\.ico).*)",
    // Ejecutar siempre para las rutas de API
    "/(api|trpc)(.*)",
  ],
};
