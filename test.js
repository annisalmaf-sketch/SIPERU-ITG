const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const bookings = await prisma.booking.findMany();
    if (bookings.length === 0) return console.log('No bookings');
    const booking = bookings[0];
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'APPROVED', notes: '' }
    });
    console.log('Success');
  } catch(e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
