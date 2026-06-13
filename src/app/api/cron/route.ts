import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Invalid CRON_SECRET.' },
      { status: 401 }
    );
  }

  try {
    const now = new Date();
    
    // Find and update all APPROVED bookings whose endTime has passed
    const result = await prisma.booking.updateMany({
      where: {
        status: 'APPROVED',
        endTime: {
          lt: now
        }
      },
      data: {
        status: 'COMPLETED'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Cron job executed successfully.`,
      updatedBookings: result.count 
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
