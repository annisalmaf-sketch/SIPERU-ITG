const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'hima@itg.ac.id' },
    data: { role: 'MAHASISWA', name: 'Himpunan Mahasiswa (HIMA)' }
  });
  console.log('Fixed hima');
}

main().finally(() => prisma.$disconnect());
