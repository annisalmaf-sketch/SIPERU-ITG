const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({
    where: { email: 'kajur@itg.ac.id' },
    data: { email: 'baak@itg.ac.id' }
  });
  console.log('Updated db');
}
main();
