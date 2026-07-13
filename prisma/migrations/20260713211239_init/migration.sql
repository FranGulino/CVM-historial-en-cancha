-- CreateEnum
CREATE TYPE "MatchPhase" AS ENUM ('FASE_1', 'NONAGONAL', 'ETAPA_ELIMINATORIA');

-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('PRESENCIAL', 'A_LA_DISTANCIA');

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fixtureRound" INTEGER NOT NULL,
    "phase" "MatchPhase" NOT NULL DEFAULT 'FASE_1',
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "goalsVM" INTEGER,
    "goalsOpponent" INTEGER,
    "scorers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "type" "AttendanceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_matchId_key" ON "Attendance"("userId", "matchId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
