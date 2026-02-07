import { User, UserRole } from './types';
import bcrypt from 'bcryptjs';
import { connectDB } from './mongodb';
import { SessionModel } from './models';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const createSession = async (userId: string): Promise<string> => {
  await connectDB();
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  
  // Delete any existing session with this ID (cleanup)
  await SessionModel.deleteOne({ sessionId }).catch(() => {});
  
  // Create new session
  await SessionModel.create({
    sessionId,
    userId,
    expiresAt,
  });
  
  return sessionId;
};

export const getSession = async (sessionId: string): Promise<{ userId: string } | null> => {
  try {
    await connectDB();
    const session = await SessionModel.findOne({ sessionId }).lean();
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      await SessionModel.deleteOne({ sessionId });
      return null;
    }
    return { userId: session.userId };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    await connectDB();
    await SessionModel.deleteOne({ sessionId });
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

export const getUserFromSession = async (sessionId: string | undefined): Promise<User | null> => {
  if (!sessionId) return null;
  
  try {
    await connectDB();
    const session = await getSession(sessionId);
    if (!session) return null;
    
    const { UserModel } = await import('./models');
    const user = await UserModel.findById(session.userId).lean();
    if (!user) return null;
    
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phoneNumber: user.phoneNumber,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isApproved: user.isApproved,
      linkedStudents: user.linkedStudents,
      dojoId: user.dojoId,
    };
  } catch (error) {
    console.error('Error getting user from session:', error);
    return null;
  }
};

export const checkRole = (user: User | null, allowedRoles: UserRole[]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

export const requireAuth = (user: User | null): User => {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

export const requireRole = (user: User | null, allowedRoles: UserRole[]): User => {
  const authedUser = requireAuth(user);
  if (!checkRole(authedUser, allowedRoles)) {
    throw new Error('Insufficient permissions');
  }
  return authedUser;
};

// Helper for Next.js API routes to verify authentication
export const verifyAuth = async (request: any): Promise<User | null> => {
  try {
    await connectDB();
    const sessionId = request.cookies?.get('session')?.value;
    if (!sessionId) return null;
    
    const session = await getSession(sessionId);
    if (!session) return null;
    
    const { UserModel } = await import('./models');
    const user = await UserModel.findById(session.userId).lean();
    if (!user) return null;
    
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phoneNumber: user.phoneNumber,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isApproved: user.isApproved,
      linkedStudents: user.linkedStudents,
      dojoId: user.dojoId,
    };
  } catch (error) {
    console.error('Error verifying auth:', error);
    return null;
  }
};
