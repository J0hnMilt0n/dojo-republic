import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession, requireRole } from '@/lib/auth';
import { 
  dojosDB, 
  tournamentsDB, 
  achievementsDB, 
  sellersDB, 
  usersDB, 
  ordersDB 
} from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value;
    const user = await getUserFromSession(sessionId);
    requireRole(user, ['admin']);

    // Get all data
    const dojos = dojosDB.getAll();
    const tournaments = tournamentsDB.getAll();
    const achievements = achievementsDB.getAll();
    const sellers = sellersDB.getAll();
    const users = usersDB.getAll();
    const orders = ordersDB.getAll();

    // Calculate stats
    const stats = {
      pendingDojos: dojos.filter(d => !d.isApproved).length,
      pendingTournaments: tournaments.filter(t => !t.isApproved).length,
      pendingAchievements: achievements.filter(a => !a.isApproved).length,
      pendingSellers: sellers.filter(s => !s.isApproved).length,
      totalUsers: users.length,
      totalDojos: dojos.length,
      totalTournaments: tournaments.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      commissionEarned: orders.reduce((sum, order) => sum + order.commissionAmount, 0),
    };

    return NextResponse.json({ stats });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

