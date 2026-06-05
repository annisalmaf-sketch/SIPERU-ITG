const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({
    where: { email: 'baak@itg.ac.id' },
    data: { name: 'Ir. Yanti Yulianti, M.M.' }
  });
  
  // Clean up unused kajur test accounts
  await prisma.user.deleteMany({
    where: { email: { in: ['kajur2@itg.ac.id', 'kajur3@itg.ac.id'] } }
  }).catch(() => {});
  
  console.log('Updated db');
}
main();
