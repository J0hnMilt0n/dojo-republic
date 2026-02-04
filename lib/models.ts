import mongoose, { Schema, model, models } from 'mongoose';
import { User, Dojo, PlayerProfile, Achievement, Tournament, Product, Seller, Order, Student, Attendance, Enquiry } from './types';

// User Schema
const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'player', 'parent', 'dojo_owner', 'coach', 'referee', 'judge', 'seller', 'admin'] },
  phoneNumber: String,
  isApproved: { type: Boolean, default: false },
  linkedStudents: [String],
  dojoId: String,
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// Dojo Schema
const DojoSchema = new Schema<Dojo>({
  name: { type: String, required: true },
  ownerId: { type: String, required: true },
  description: { type: String, required: true },
  martialArts: [String],
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  website: String,
  images: [String],
  pricing: [{
    name: String,
    price: Number,
    duration: String,
    description: String,
  }],
  schedule: [{
    day: String,
    startTime: String,
    endTime: String,
    className: String,
    instructor: String,
  }],
  isApproved: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// Player Profile Schema
const PlayerProfileSchema = new Schema<PlayerProfile>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  beltCategory: { type: String, required: true },
  dojoId: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  weight: Number,
  height: Number,
  profileImage: String,
  achievements: [{
    id: String,
    playerId: String,
    tournamentName: String,
    category: String,
    position: { type: String, enum: ['gold', 'silver', 'bronze', 'participation'] },
    year: Number,
    date: String,
    certificateUrl: String,
    imageUrl: String,
    isApproved: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  }],
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// Tournament Schema
const TournamentSchema = new Schema<Tournament>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  organizerId: { type: String, required: true },
  organizerType: { type: String, required: true },
  martialArt: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  registrationDeadline: { type: String, required: true },
  venue: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  categories: [{
    id: String,
    name: String,
    ageGroup: String,
    gender: { type: String, enum: ['male', 'female', 'mixed'] },
    weightClass: String,
    beltLevel: String,
  }],
  rules: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  maxParticipants: Number,
  registrationFee: { type: Number, required: true },
  posterImage: String,
  isApproved: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  participants: [{
    id: String,
    playerId: String,
    categoryId: String,
    registrationDate: String,
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'] },
  }],
  results: [{
    id: String,
    tournamentId: String,
    categoryId: String,
    playerId: String,
    position: { type: String, enum: ['gold', 'silver', 'bronze', 'participation'] },
    points: Number,
    notes: String,
  }],
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// Product Schema
const ProductSchema = new Schema<Product>({
  sellerId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: [String],
  specifications: { type: Map, of: String },
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// Seller Schema
const SellerSchema = new Schema<Seller>({
  userId: { type: String, required: true },
  businessName: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  logo: String,
  isApproved: { type: Boolean, default: false },
  commissionRate: { type: Number, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// Order Schema
const OrderSchema = new Schema<Order>({
  customerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  products: [{
    productId: String,
    quantity: Number,
    price: Number,
  }],
  totalAmount: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
  shippingAddress: { type: String, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'] },
  paymentMethod: { type: String, required: true },
  trackingNumber: String,
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// Student Schema
const StudentSchema = new Schema<Student>({
  userId: String,
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  dojoId: { type: String, required: true },
  beltLevel: { type: String, required: true },
  parentId: String,
  enrollmentDate: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// Attendance Schema
const AttendanceSchema = new Schema<Attendance>({
  studentId: { type: String, required: true },
  dojoId: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'excused'] },
  className: String,
  notes: String,
  markedBy: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
});

// Enquiry Schema
const EnquirySchema = new Schema<Enquiry>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['general', 'dojo', 'tournament', 'support'] },
  status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' },
  dojoId: String,
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
});

// Export models
export const UserModel = models.User || model<User>('User', UserSchema);
export const DojoModel = models.Dojo || model<Dojo>('Dojo', DojoSchema);
export const PlayerProfileModel = models.PlayerProfile || model<PlayerProfile>('PlayerProfile', PlayerProfileSchema);
export const TournamentModel = models.Tournament || model<Tournament>('Tournament', TournamentSchema);
export const ProductModel = models.Product || model<Product>('Product', ProductSchema);
export const SellerModel = models.Seller || model<Seller>('Seller', SellerSchema);
export const OrderModel = models.Order || model<Order>('Order', OrderSchema);
export const StudentModel = models.Student || model<Student>('Student', StudentSchema);
export const AttendanceModel = models.Attendance || model<Attendance>('Attendance', AttendanceSchema);
export const EnquiryModel = models.Enquiry || model<Enquiry>('Enquiry', EnquirySchema);
