import { PrismaClient, MatchPhase } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando semillado de partidos...");

  // Limpiamos los partidos existentes para evitar duplicados en el seed
  await prisma.match.deleteMany({});

  const matchesData = [
    {
      date: new Date("2026-03-22T16:00:00Z"),
      fixtureRound: 1,
      phase: MatchPhase.FASE_1,
      homeTeam: "Kimberley (MdP)",
      awayTeam: "Villa Mitre",
      goalsVM: 0,
      goalsOpponent: 1,
      scorers: [],
    },
    {
      date: new Date("2026-03-29T16:30:00Z"),
      fixtureRound: 2,
      phase: MatchPhase.FASE_1,
      homeTeam: "Villa Mitre",
      awayTeam: "Círculo Deportivo",
      goalsVM: 2,
      goalsOpponent: 0,
      scorers: ["Joaquín Vivani", "Sebastián Jeldres"],
    },
    // Fecha 3 fue Libre para Villa Mitre
    {
      date: new Date("2026-04-12T16:00:00Z"),
      fixtureRound: 4,
      phase: MatchPhase.FASE_1,
      homeTeam: "Germinal (Rawson)",
      awayTeam: "Villa Mitre",
      goalsVM: 0,
      goalsOpponent: 1,
      scorers: [],
    },
    {
      date: new Date("2026-04-19T16:30:00Z"),
      fixtureRound: 5,
      phase: MatchPhase.FASE_1,
      homeTeam: "Villa Mitre",
      awayTeam: "Ramón Santamarina",
      goalsVM: 0,
      goalsOpponent: 0,
      scorers: [],
    },
    {
      date: new Date("2026-04-26T16:00:00Z"),
      fixtureRound: 6,
      phase: MatchPhase.FASE_1,
      homeTeam: "Alvarado",
      awayTeam: "Villa Mitre",
      goalsVM: 1,
      goalsOpponent: 1,
      scorers: ["Joaquín Vivani"],
    },
    {
      date: new Date("2026-05-03T16:30:00Z"),
      fixtureRound: 7,
      phase: MatchPhase.FASE_1,
      homeTeam: "Villa Mitre",
      awayTeam: "Olimpo",
      goalsVM: 0,
      goalsOpponent: 0,
      scorers: [],
    },
    {
      date: new Date("2026-05-10T15:30:00Z"),
      fixtureRound: 8,
      phase: MatchPhase.FASE_1,
      homeTeam: "Guillermo Brown",
      awayTeam: "Villa Mitre",
      goalsVM: 1,
      goalsOpponent: 1,
      scorers: ["Fernando Pettineroli"],
    },
    {
      date: new Date("2026-05-17T16:30:00Z"),
      fixtureRound: 9,
      phase: MatchPhase.FASE_1,
      homeTeam: "Villa Mitre",
      awayTeam: "Sol de Mayo",
      goalsVM: 2,
      goalsOpponent: 1,
      scorers: ["Sebastián Jeldres", "Ezequiel Cérica"],
    },
    {
      date: new Date("2026-05-25T16:30:00Z"),
      fixtureRound: 10,
      phase: MatchPhase.FASE_1,
      homeTeam: "Villa Mitre",
      awayTeam: "Kimberley (MdP)",
      goalsVM: 0,
      goalsOpponent: 0,
      scorers: [],
    },
    {
      date: new Date("2026-05-31T15:30:00Z"),
      fixtureRound: 11,
      phase: MatchPhase.FASE_1,
      homeTeam: "Círculo Deportivo",
      awayTeam: "Villa Mitre",
      goalsVM: 0,
      goalsOpponent: 0,
      scorers: [],
    },
    // Fecha 12 fue Libre para Villa Mitre
    {
      date: new Date("2026-06-14T16:30:00Z"),
      fixtureRound: 13,
      phase: MatchPhase.FASE_1,
      homeTeam: "Villa Mitre",
      awayTeam: "Germinal (Rawson)",
      goalsVM: 0,
      goalsOpponent: 0,
      scorers: [],
    },
    {
      date: new Date("2026-06-20T19:00:00Z"),
      fixtureRound: 14,
      phase: MatchPhase.FASE_1,
      homeTeam: "Ramón Santamarina",
      awayTeam: "Villa Mitre",
      goalsVM: 0,
      goalsOpponent: 2,
      scorers: [],
    },
    {
      date: new Date("2026-06-28T16:30:00Z"),
      fixtureRound: 15,
      phase: MatchPhase.FASE_1,
      homeTeam: "Villa Mitre",
      awayTeam: "Alvarado",
      goalsVM: 1,
      goalsOpponent: 0,
      scorers: ["Gabriel Obredor"],
    },
    {
      date: new Date("2026-07-05T15:00:00Z"),
      fixtureRound: 16,
      phase: MatchPhase.FASE_1,
      homeTeam: "Olimpo",
      awayTeam: "Villa Mitre",
      goalsVM: 0,
      goalsOpponent: 0,
      scorers: [],
    },
    {
      date: new Date("2026-07-12T15:30:00Z"),
      fixtureRound: 17,
      phase: MatchPhase.FASE_1,
      homeTeam: "Villa Mitre",
      awayTeam: "Guillermo Brown",
      goalsVM: 3,
      goalsOpponent: 0,
      scorers: ["Tomás Ibarra", "Carlos Battigelli", "Leonel Monti"],
    },
    {
      date: new Date("2026-07-19T15:30:00Z"), // Próximo partido (aún no disputado)
      fixtureRound: 18,
      phase: MatchPhase.FASE_1,
      homeTeam: "Sol de Mayo",
      awayTeam: "Villa Mitre",
      goalsVM: null,
      goalsOpponent: null,
      scorers: [],
    },
  ];

  for (const match of matchesData) {
    await prisma.match.create({
      data: match,
    });
  }

  console.log(`Semillado finalizado. Se inyectaron ${matchesData.length} partidos de la Fase 1.`);
}

main()
  .catch((e) => {
    console.error("Error al ejecutar el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
