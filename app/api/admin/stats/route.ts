import { NextRequest, NextResponse } from 'next/server';
import { getUserFromSession, requireRole } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { 
  DojoModel,
  TournamentModel,
  SellerModel,
  UserModel,
  OrderModel
} from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const sessionId = request.cookies.get('session')?.value;
    const user = await getUserFromSession(sessionId);
    requireRole(user, ['admin']);

    // Get all data from MongoDB
    const [dojos, tournaments, sellers, users, orders] = await Promise.all([
      DojoModel.find({}).lean(),
      TournamentModel.find({}).lean(),
      SellerModel.find({}).lean(),
      UserModel.find({}).lean(),
      OrderModel.find({}).lean(),
    ]);

    // Calculate stats
    const stats = {
      pendingDojos: dojos.filter((d: any) => !d.isApproved).length,
      pendingTournaments: tournaments.filter((t: any) => !t.isApproved).length,
      pendingSellers: sellers.filter((s: any) => !s.isApproved).length,
      totalUsers: users.length,
      totalDojos: dojos.length,
      totalTournaments: tournaments.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0),
      commissionEarned: orders.reduce((sum: number, order: any) => sum + (order.commissionAmount || 0), 0),
    };

    return NextResponse.json({ stats });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

