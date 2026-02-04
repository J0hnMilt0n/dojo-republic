import fs from 'fs';
import path from 'path';
import { 
  User, Dojo, PlayerProfile, Achievement, Tournament, Match, 
  Student, Attendance, Product, Seller, Order, Enquiry, 
  TournamentHostingRequest, PricingPlan 
} from './types';

const DB_PATH = path.join(process.cwd(), 'data');

// Ensure database directory exists
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Database files
const DB_FILES = {
  users: path.join(DB_PATH, 'users.json'),
  dojos: path.join(DB_PATH, 'dojos.json'),
  players: path.join(DB_PATH, 'players.json'),
  achievements: path.join(DB_PATH, 'achievements.json'),
  tournaments: path.join(DB_PATH, 'tournaments.json'),
  matches: path.join(DB_PATH, 'matches.json'),
  students: path.join(DB_PATH, 'students.json'),
  attendance: path.join(DB_PATH, 'attendance.json'),
  products: path.join(DB_PATH, 'products.json'),
  sellers: path.join(DB_PATH, 'sellers.json'),
  orders: path.join(DB_PATH, 'orders.json'),
  enquiries: path.join(DB_PATH, 'enquiries.json'),
  hostingRequests: path.join(DB_PATH, 'hosting-requests.json'),
  pricingPlans: path.join(DB_PATH, 'pricing-plans.json'),
};

// Initialize default data
const initializeDB = () => {
  Object.values(DB_FILES).forEach(file => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify([], null, 2));
    }
  });
  
  // Initialize pricing plans if not exists
  const pricingFile = DB_FILES.pricingPlans;
  if (fs.existsSync(pricingFile)) {
    const data = JSON.parse(fs.readFileSync(pricingFile, 'utf-8'));
    if (data.length === 0) {
      const defaultPlans: PricingPlan[] = [
        {
          id: '1',
          name: 'Basic Tournament Hosting',
          type: 'tournament_hosting',
          features: ['Up to 50 participants', 'Basic scoreboard', '3 categories'],
          price: 5000,
        },
        {
          id: '2',
          name: 'Standard Tournament Hosting',
          type: 'tournament_hosting',
          features: ['Up to 200 participants', 'Live scoreboard', '10 categories', 'Result reports'],
          price: 15000,
        },
        {
          id: '3',
          name: 'Premium Tournament Hosting',
          type: 'tournament_hosting',
          features: ['Unlimited participants', 'Live streaming support', 'Unlimited categories', 'Advanced analytics', 'Certificate generation'],
          price: 30000,
        },
      ];
      fs.writeFileSync(pricingFile, JSON.stringify(defaultPlans, null, 2));
    }
  }
};

initializeDB();

// Generic database operations
export class Database<T extends { id: string }> {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  getAll(): T[] {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data);
  }

  getById(id: string): T | undefined {
    const items = this.getAll();
    return items.find(item => item.id === id);
  }

  create(item: T): T {
    const items = this.getAll();
    items.push(item);
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
    return item;
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;
    
    items[index] = { ...items[index], ...updates };
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    
    fs.writeFileSync(this.filePath, JSON.stringify(filtered, null, 2));
    return true;
  }

  query(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }
}

// Database instances
export const usersDB = new Database<User>(DB_FILES.users);
export const dojosDB = new Database<Dojo>(DB_FILES.dojos);
export const playersDB = new Database<PlayerProfile>(DB_FILES.players);
export const achievementsDB = new Database<Achievement>(DB_FILES.achievements);
export const tournamentsDB = new Database<Tournament>(DB_FILES.tournaments);
export const matchesDB = new Database<Match>(DB_FILES.matches);
export const studentsDB = new Database<Student>(DB_FILES.students);
export const attendanceDB = new Database<Attendance>(DB_FILES.attendance);
export const productsDB = new Database<Product>(DB_FILES.products);
export const sellersDB = new Database<Seller>(DB_FILES.sellers);
export const ordersDB = new Database<Order>(DB_FILES.orders);
export const enquiriesDB = new Database<Enquiry>(DB_FILES.enquiries);
export const hostingRequestsDB = new Database<TournamentHostingRequest>(DB_FILES.hostingRequests);
export const pricingPlansDB = new Database<PricingPlan>(DB_FILES.pricingPlans);

// Helper functions
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};
