import { PrismaClient, Role } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient({
  // @ts-ignore
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log("Seeding database...");

  // Create Users
  await prisma.user.upsert({
    where: { email: "admin@itg.ac.id" },
    update: {},
    create: {
      email: "admin@itg.ac.id",
      name: "Super Admin",
      password: "password123",
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "bkkh@itg.ac.id" },
    update: {},
    create: {
      email: "bkkh@itg.ac.id",
      name: "Biro Kemahasiswaan",
      password: "password123",
      role: Role.BKKH,
    },
  });

  await prisma.user.upsert({
    where: { email: "sarpas@itg.ac.id" },
    update: {},
    create: {
      email: "sarpas@itg.ac.id",
      name: "Bagian Sarpas",
      password: "password123",
      role: Role.SARPAS,
    },
  });

  await prisma.user.upsert({
    where: { email: "dosen@itg.ac.id" },
    update: {},
    create: {
      email: "dosen@itg.ac.id",
      name: "Dosen ITG",
      password: "itg@garut",
      role: Role.DOSEN,
    },
  });

  await prisma.user.upsert({
    where: { email: "baak@itg.ac.id" },
    update: {},
    create: {
      email: "baak@itg.ac.id",
      name: "Ir. Yanti Yulianti, M.M.",
      password: "password123",
      role: Role.KAJUR,
    },
  });


  const students = [
    { nim: "2407045", name: "Fitri Nur'aeni" },
    { nim: "2407018", name: "Aditya Ramadhan" },
    { nim: "2407051", name: "Hilman Sopian" },
    { nim: "2407039", name: "Ashfiya Awamirillah Alkhozroji" },
    { nim: "2407042", name: "Mugni Sendi Santoso" },
    { nim: "2407048", name: "Azki Zianur Ramadhan" },
    { nim: "2407012", name: "Nasywa Alifa Fricillla" },
    { nim: "2407044", name: "Vicky Andika Irwanto" },
    { nim: "2407016", name: "Refaldi" },
    { nim: "2407046", name: "Insan Siti Rahmawati" },
    { nim: "2407037", name: "Mohamad Maolana" },
    { nim: "2407052", name: "Annisa Salma Faujiah" },
    { nim: "2407041", name: "Syeikhan Juniar Risman" },
    { nim: "2407043", name: "M Nurhuda Awarul Rizal" },
    { nim: "2407010", name: "Asyifa Qolbi" },
    { nim: "2407047", name: "Muhammad Rifki Al Bukhori" },
    { nim: "2407050", name: "Sipa Silpiani" },
    { nim: "2407038", name: "Ripandi Gunawan" },
    { nim: "2407011", name: "Hafizh Surya Saputra" },
    { nim: "2407015", name: "Shabila Adelaila" },
    { nim: "2307054", name: "Mahasiswa 2307054" },
  ];

  for (const mhs of students) {
    const email = `${mhs.nim}@itg.ac.id`;
    await prisma.user.upsert({
      where: { email },
      update: { password: "itg@garut", name: mhs.name, role: Role.MAHASISWA },
      create: {
        id: `mhs-${mhs.nim}`,
        email,
        name: mhs.name,
        password: "itg@garut",
        role: Role.MAHASISWA,
      },
    });
  }

  // Create Rooms
  const rooms = [
    { name: "Auditorium Utama", capacity: 200, type: "AUDITORIUM", status: "AVAILABLE", location: "Gedung A" },
    { name: "Lab Komputer A", capacity: 40, type: "LABORATORY", status: "AVAILABLE", location: "Gedung B" },
    { name: "Ruang Rapat", capacity: 15, type: "MEETING", status: "AVAILABLE", location: "Gedung C" },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { id: `room-${room.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: room,
      create: {
        id: `room-${room.name.toLowerCase().replace(/\s+/g, '-')}`,
        ...room
      }
    }).catch((err) => {
        console.error(`Error creating room ${room.name}:`, err);
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
