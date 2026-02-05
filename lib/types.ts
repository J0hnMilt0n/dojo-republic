// User Roles
export type UserRole = 'student' | 'player' | 'parent' | 'dojo_owner' | 'coach' | 'referee' | 'judge' | 'seller' | 'admin';

// User Type
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
  isApproved: boolean;
  linkedStudents?: string[]; // For parents
  dojoId?: string; // For dojo owners, coaches, students
}

// Dojo Type
export interface Dojo {
  id: string;
  name: string;
  ownerId: string;
  description: string;
  martialArts: string[];
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phoneNumber: string;
  email: string;
  website?: string;
  images: string[];
  pricing: DojoPrice[];
  schedule: DojoSchedule[];
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DojoPrice {
  name: string;
  price: number;
  duration: string;
  description?: string;
}

export interface DojoSchedule {
  day: string;
  startTime: string;
  endTime: string;
  className: string;
  instructor: string;
}

// Player Profile
export interface PlayerProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  beltCategory: string;
  dojoId: string;
  city: string;
  country: string;
  weight?: number;
  height?: number;
  profileImage?: string;
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}

// Achievement
export interface Achievement {
  id: string;
  playerId: string;
  tournamentName: string;
  category: string;
  position: 'gold' | 'silver' | 'bronze' | 'participation';
  year: number;
  date: string;
  certificateUrl?: string;
  imageUrl?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tournament
export interface Tournament {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  organizerType: 'dojo_owner' | 'coach' | 'referee' | 'judge' | 'admin';
  martialArt: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  venue: string;
  city: string;
  country: string;
  categories: TournamentCategory[];
  rules: string;
  contactEmail: string;
  contactPhone: string;
  maxParticipants?: number;
  registrationFee: number;
  posterImage?: string;
  isApproved: boolean;
  isPublished: boolean;
  participants: TournamentParticipant[];
  results?: TournamentResult[];
  createdAt: string;
  updatedAt: string;
}

export interface TournamentCategory {
  id: string;
  name: string;
  ageGroup: string;
  gender: 'male' | 'female' | 'mixed';
  weightClass?: string;
  beltLevel?: string;
}

export interface TournamentParticipant {
  id: string;
  playerId: string;
  categoryId: string;
  registrationDate: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface TournamentResult {
  id: string;
  tournamentId: string;
  categoryId: string;
  playerId: string;
  position: 'gold' | 'silver' | 'bronze' | 'participation';
  points?: number;
  notes?: string;
}

// Tournament Hosting Request
export interface TournamentHostingRequest {
  id: string;
  requesterId: string;
  tournamentDetails: Partial<Tournament>;
  pricingPlan: 'basic' | 'standard' | 'premium';
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Match Scorecard
export interface Match {
  id: string;
  tournamentId: string;
  categoryId: string;
  playerAId: string;
  playerBId: string;
  round: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scorePlayerA: MatchScore;
  scorePlayerB: MatchScore;
  winner?: string;
  matchDate: string;
  refereeId?: string;
  judges?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MatchScore {
  points: number;
  warnings: number;
  penalties: number;
  ippon: number;
  wazaari: number;
  yuko: number;
}

// Student & Attendance
export interface Student {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  gender?: string;
  dojoId: string;
  beltLevel: string;
  parentId?: string;
  enrollmentDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  dojoId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  className?: string;
  notes?: string;
  markedBy: string;
  createdAt: string;
}

// Engagement Metrics
export interface StudentEngagement {
  studentId: string;
  attendancePercentage: number;
  totalClasses: number;
  classesAttended: number;
  tournamentsParticipated: number;
  lastAttendance?: string;
  engagementLevel: 'high' | 'medium' | 'low' | 'inactive';
}

// E-commerce
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  specifications: { [key: string]: string };
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  address: string;
  phoneNumber: string;
  email: string;
  logo?: string;
  isApproved: boolean;
  commissionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  sellerId: string;
  products: OrderItem[];
  totalAmount: number;
  commissionAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

// Pricing Plans
export interface PricingPlan {
  id: string;
  name: string;
  type: 'tournament_hosting' | 'dojo_listing' | 'commission';
  features: string[];
  price: number;
  duration?: string;
}

// Enquiry
export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  type: 'general' | 'dojo' | 'tournament' | 'support';
  status: 'new' | 'in_progress' | 'resolved';
  dojoId?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics
export interface Analytics {
  totalDojos: number;
  totalStudents: number;
  totalPlayers: number;
  totalTournaments: number;
  totalOrders: number;
  totalRevenue: number;
  commissionEarned: number;
  activeUsers: number;
  newUsersThisMonth: number;
}
