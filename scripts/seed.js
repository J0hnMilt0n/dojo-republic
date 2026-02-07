const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const timestamp = new Date().toISOString();

// Helper to generate IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Hash passwords
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

async function seedData() {
  console.log('🌱 Seeding database...');

  // Users
  const users = [
    {
      id: 'admin-1',
      email: 'admin@demo.com',
      password: await hashPassword('password123'),
      name: 'Admin User',
      role: 'admin',
      phoneNumber: '+1 (555) 000-0001',
      isApproved: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'owner-1',
      email: 'owner@demo.com',
      password: await hashPassword('password123'),
      name: 'John Smith',
      role: 'dojo_owner',
      phoneNumber: '+1 (555) 111-0001',
      isApproved: true,
      dojoId: 'dojo-1',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'player-1',
      email: 'player@demo.com',
      password: await hashPassword('password123'),
      name: 'Sarah Johnson',
      role: 'player',
      phoneNumber: '+1 (555) 222-0001',
      isApproved: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'coach-1',
      email: 'coach@demo.com',
      password: await hashPassword('coach123'),
      name: 'Mike Chen',
      role: 'coach',
      phoneNumber: '+1 (555) 333-0001',
      isApproved: true,
      dojoId: 'dojo-2',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'seller-1',
      email: 'seller@demo.com',
      password: await hashPassword('password123'),
      name: 'Emily Martinez',
      role: 'seller',
      phoneNumber: '+1 (555) 444-0001',
      isApproved: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Dojos
  const dojos = [
    {
      id: 'dojo-1',
      name: 'Dragon Warrior Karate Dojo',
      ownerId: 'owner-1',
      description: 'Premier karate training facility with experienced instructors and state-of-the-art equipment.',
      martialArts: ['Karate', 'Kickboxing'],
      address: '123 Main Street',
      city: 'New York',
      country: 'USA',
      phoneNumber: '+1 (555) 100-0001',
      email: 'info@dragonwarrior.com',
      website: 'https://dragonwarrior.com',
      images: [],
      pricing: [
        { name: 'Monthly Membership', price: 150, duration: '1 month', description: 'Unlimited classes' },
        { name: 'Annual Membership', price: 1500, duration: '1 year', description: 'Best value - 2 months free' },
      ],
      schedule: [
        { day: 'Monday', startTime: '18:00', endTime: '19:30', className: 'Adult Karate', instructor: 'John Smith' },
        { day: 'Wednesday', startTime: '18:00', endTime: '19:30', className: 'Adult Karate', instructor: 'John Smith' },
        { day: 'Saturday', startTime: '10:00', endTime: '11:30', className: 'Kids Karate', instructor: 'John Smith' },
      ],
      isApproved: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'dojo-2',
      name: 'Phoenix Martial Arts Academy',
      ownerId: 'coach-1',
      description: 'Traditional martial arts training with modern techniques. Focus on discipline and character building.',
      martialArts: ['Karate', 'Taekwondo', 'Judo'],
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      country: 'USA',
      phoneNumber: '+1 (555) 200-0002',
      email: 'contact@phoenixma.com',
      images: [],
      pricing: [
        { name: 'Beginner Package', price: 120, duration: '1 month', description: '2 classes per week' },
        { name: 'Advanced Package', price: 180, duration: '1 month', description: 'Unlimited classes' },
      ],
      schedule: [
        { day: 'Tuesday', startTime: '17:00', endTime: '18:30', className: 'Karate Basics', instructor: 'Mike Chen' },
        { day: 'Thursday', startTime: '17:00', endTime: '18:30', className: 'Karate Basics', instructor: 'Mike Chen' },
      ],
      isApproved: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'dojo-3',
      name: 'Tiger Strike Karate Center',
      ownerId: 'owner-1',
      description: 'Competition-focused training center producing championship athletes.',
      martialArts: ['Karate', 'MMA'],
      address: '789 Pine Road',
      city: 'Chicago',
      country: 'USA',
      phoneNumber: '+1 (555) 300-0003',
      email: 'info@tigerstrike.com',
      images: [],
      pricing: [
        { name: 'Standard', price: 140, duration: '1 month', description: 'Regular training' },
        { name: 'Competition', price: 200, duration: '1 month', description: 'Competition prep included' },
      ],
      schedule: [
        { day: 'Monday', startTime: '19:00', endTime: '20:30', className: 'Competition Training', instructor: 'John Smith' },
      ],
      isApproved: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Player Profiles
  const players = [
    {
      id: 'player-profile-1',
      userId: 'player-1',
      name: 'Sarah Johnson',
      age: 22,
      dateOfBirth: '2002-03-15',
      gender: 'female',
      beltCategory: 'Black Belt 2nd Dan',
      dojoId: 'dojo-1',
      city: 'New York',
      country: 'USA',
      weight: 65,
      height: 170,
      achievements: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Achievements
  const achievements = [
    {
      id: 'achievement-1',
      playerId: 'player-profile-1',
      tournamentName: 'National Karate Championship 2024',
      category: 'Kata - Women Senior',
      position: 'gold',
      year: 2024,
      date: '2024-08-15',
      isApproved: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'achievement-2',
      playerId: 'player-profile-1',
      tournamentName: 'State Karate Open 2023',
      category: 'Kumite - Women -68kg',
      position: 'silver',
      year: 2023,
      date: '2023-11-20',
      isApproved: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Tournaments
  const tournaments = [
    {
      id: 'tournament-1',
      name: 'Spring Karate Championship 2026',
      description: 'Annual spring championship featuring kata and kumite competitions for all age groups.',
      organizerId: 'coach-1',
      organizerType: 'coach',
      martialArt: 'Karate',
      startDate: '2026-04-15T09:00:00.000Z',
      endDate: '2026-04-16T18:00:00.000Z',
      registrationDeadline: '2026-04-01T23:59:59.000Z',
      venue: 'City Sports Complex',
      city: 'Boston',
      country: 'USA',
      categories: [
        { id: 'cat-1', name: 'Kata', ageGroup: '18+', gender: 'mixed' },
        { id: 'cat-2', name: 'Kumite', ageGroup: '18+', gender: 'male', weightClass: 'Lightweight (< 60kg)' },
        { id: 'cat-3', name: 'Kumite', ageGroup: '18+', gender: 'female', weightClass: 'Lightweight (< 60kg)' },
      ],
      rules: 'WKF official rules apply. All participants must wear approved protective gear.',
      contactEmail: 'coach@demo.com',
      contactPhone: '+1 (555) 333-0001',
      maxParticipants: 200,
      registrationFee: 50,
      isApproved: true,
      isPublished: true,
      participants: [],
      results: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'tournament-2',
      name: 'Junior Karate League - Summer Edition',
      description: 'Youth focused tournament for ages 6-17. Perfect for young martial artists to gain competition experience.',
      organizerId: 'owner-1',
      organizerType: 'dojo_owner',
      martialArt: 'Karate',
      startDate: '2026-07-20T10:00:00.000Z',
      endDate: '2026-07-20T17:00:00.000Z',
      registrationDeadline: '2026-07-10T23:59:59.000Z',
      venue: 'Youth Sports Arena',
      city: 'Miami',
      country: 'USA',
      categories: [
        { id: 'cat-4', name: 'Kata', ageGroup: '6-8', gender: 'mixed' },
        { id: 'cat-5', name: 'Kata', ageGroup: '9-11', gender: 'mixed' },
        { id: 'cat-6', name: 'Kumite', ageGroup: '12-14', gender: 'male' },
      ],
      rules: 'Safety first. All participants must have parental consent.',
      contactEmail: 'owner@demo.com',
      contactPhone: '+1 (555) 111-0001',
      maxParticipants: 100,
      registrationFee: 30,
      isApproved: true,
      isPublished: true,
      participants: [],
      results: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Sellers
  const sellers = [
    {
      id: 'seller-1-profile',
      userId: 'seller-1',
      businessName: 'Martial Arts Gear Pro',
      description: 'Premium martial arts equipment and apparel. Official supplier for tournaments and dojos.',
      address: '456 Commerce Blvd, Los Angeles, CA 90001',
      phoneNumber: '+1 (555) 777-0001',
      email: 'seller@demo.com',
      logo: '',
      isApproved: true,
      commissionRate: 10,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Products
  const products = [
    {
      id: 'product-1',
      sellerId: 'seller-1',
      name: 'Professional Karate Gi - White',
      description: 'High-quality 100% cotton karate gi. Perfect for training and competitions. Lightweight and breathable.',
      category: 'Gi',
      price: 89.99,
      stock: 50,
      images: [],
      specifications: {
        material: '100% Cotton',
        weight: '12oz',
        sizes: 'XS, S, M, L, XL, XXL',
      },
      isApproved: true,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'product-2',
      sellerId: 'seller-1',
      name: 'Competition Karate Belt Set',
      description: 'Complete belt set from white to black. Made from durable cotton with reinforced stitching.',
      category: 'Belt',
      price: 149.99,
      stock: 30,
      images: [],
      specifications: {
        material: 'Cotton',
        length: '280cm',
        width: '4cm',
      },
      isApproved: true,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'product-3',
      sellerId: 'seller-1',
      name: 'Sparring Gloves - Red',
      description: 'Professional sparring gloves with foam padding. Thumb protection and secure velcro wrist strap.',
      category: 'Gloves',
      price: 45.99,
      stock: 75,
      images: [],
      specifications: {
        material: 'Synthetic Leather',
        padding: 'High-density foam',
        sizes: 'S, M, L, XL',
      },
      isApproved: true,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: 'product-4',
      sellerId: 'seller-1',
      name: 'Protective Headgear',
      description: 'Lightweight protective headgear for sparring. Excellent visibility and ventilation.',
      category: 'Protective Gear',
      price: 69.99,
      stock: 40,
      images: [],
      specifications: {
        material: 'Vinyl outer, foam padding',
        sizes: 'S, M, L',
      },
      isApproved: true,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  // Pricing Plans
  const pricingPlans = [
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

  // Write to files
  const writeData = (filename, data) => {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Created ${filename}`);
  };

  writeData('users.json', users);
  writeData('dojos.json', dojos);
  writeData('players.json', players);
  writeData('achievements.json', achievements);
  writeData('tournaments.json', tournaments);
  writeData('matches.json', []);
  writeData('students.json', []);
  writeData('attendance.json', []);
  writeData('products.json', products);
  writeData('sellers.json', sellers);
  writeData('orders.json', []);
  writeData('enquiries.json', []);
  writeData('hosting-requests.json', []);
  writeData('pricing-plans.json', pricingPlans);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📝 Demo Account Credentials:');
  console.log('   Admin:      admin@demo.com / password123');
  console.log('   Dojo Owner: owner@demo.com / password123');
  console.log('   Player:     player@demo.com / password123');
  console.log('   Coach:      coach@demo.com / coach123');
  console.log('   Seller:     seller@demo.com / password123');
  console.log('   Dojo Owner: owner@demo.com / password123');
  console.log('   Player:     player@demo.com / password123');
  console.log('   Coach:      coach@demo.com / coach123\n');
}

seedData().catch(console.error);
