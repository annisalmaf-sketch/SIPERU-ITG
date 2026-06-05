const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rooms = await prisma.room.findMany({
    where: { type: { in: ['CLASSROOM', 'LABORATORY'] } }
  });

  if (rooms.length === 0) {
    console.log("No rooms found");
    return;
  }

  const r1 = rooms[0].id;
  const r2 = rooms.length > 1 ? rooms[1].id : r1;
  const r3 = rooms.length > 2 ? rooms[2].id : r1;

  await prisma.classSchedule.createMany({
    data: [
      {
        roomId: r1,
        dayOfWeek: 1, // Senin
        startTime: "08:00",
        endTime: "10:30",
        courseName: "Algoritma Pemrograman",
        lecturerName: "Dr. Ir. Budi Santoso, M.Kom"
      },
      {
        roomId: r1,
        dayOfWeek: 1, // Senin
        startTime: "13:00",
        endTime: "15:00",
        courseName: "Kalkulus I",
        lecturerName: "Dra. Siti Aminah, M.Si"
      },
      {
        roomId: r2,
        dayOfWeek: 2, // Selasa
        startTime: "09:00",
        endTime: "11:30",
        courseName: "Sistem Operasi",
        lecturerName: "Agus Riyanto, S.T., M.T."
      },
      {
        roomId: r3,
        dayOfWeek: 3, // Rabu
        startTime: "08:00",
        endTime: "12:00",
        courseName: "Praktikum Pemrograman Web",
        lecturerName: "Ridwan Kamil, M.Kom"
      },
      {
        roomId: r2,
        dayOfWeek: 4, // Kamis
        startTime: "14:00",
        endTime: "16:00",
        courseName: "Kecerdasan Buatan",
        lecturerName: "Prof. Hendra Wijaya"
      }
    ]
  });

  console.log("Sample schedules added successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
