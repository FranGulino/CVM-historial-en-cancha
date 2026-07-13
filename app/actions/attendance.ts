"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleAttendance(matchId: string, type: "PRESENCIAL" | "A_LA_DISTANCIA") {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Deberías iniciar sesión para registrar tu asistencia.");
  }

  // Buscamos si ya existe la asistencia para el usuario y el partido
  const existingAttendance = await prisma.attendance.findUnique({
    where: {
      userId_matchId: {
        userId,
        matchId,
      },
    },
  });

  if (existingAttendance) {
    if (existingAttendance.type === type) {
      // Si hace clic en el botón del mismo tipo que ya tenía, removemos la asistencia
      await prisma.attendance.delete({
        where: {
          id: existingAttendance.id,
        },
      });
    } else {
      // Si cambia de tipo de asistencia, la actualizamos
      await prisma.attendance.update({
        where: {
          id: existingAttendance.id,
        },
        data: {
          type,
        },
      });
    }
  } else {
    // Si no existía asistencia previa, la creamos
    await prisma.attendance.create({
      data: {
        userId,
        matchId,
        type,
      },
    });
  }

  // Revalidamos la Home Page para refrescar contadores e interfaz en tiempo real
  revalidatePath("/");
  return { success: true };
}
