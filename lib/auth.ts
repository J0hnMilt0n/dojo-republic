import { usersDB } from './db';
import { User, UserRole } from './types';
import bcrypt from 'bcryptjs';

// Session management (simple in-memory for MVP, use Redis/DB in production)
const sessions = new Map<string, { userId: string; expiresAt: number }>();

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const createSession = (userId: string): string => {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
  sessions.set(sessionId, { userId, expiresAt });
  return sessionId;
};

export const getSession = (sessionId: string): { userId: string } | null => {
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  return { userId: session.userId };
};

export const deleteSession = (sessionId: string): void => {
  sessions.delete(sessionId);
};

export const getUserFromSession = (sessionId: string | undefined): User | null => {
  if (!sessionId) return null;
  const session = getSession(sessionId);
  if (!session) return null;
  return usersDB.getById(session.userId) || null;
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
