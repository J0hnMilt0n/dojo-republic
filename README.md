# Dojo Republic - The Home of Combat Sports

A comprehensive, unified platform for martial arts ecosystems, starting with Karate and expandable to other combat sports. Built with Next.js 14, TypeScript, and TailwindCSS.

## 🥋 Project Overview

Dojo Republic is a full-featured martial arts platform connecting dojos, students, players (athletes), parents, coaches, referees, judges, sellers, and administrators in a single unified system.

### Key Features

- **Public Website** - Browse dojos, tournaments, athlete profiles, and marketplace
- **Multi-Role Authentication** - Role-based access control for 9 user types
- **Dojo Management** - Create and manage martial arts schools with schedules and pricing
- **Player Profiles & Achievements** - Athletes can showcase their career with admin-approved achievements
- **Live Karate Scorecard** - Real-time match scoring system for competitions
- **Tournament System** - Full tournament lifecycle management with approval workflows
- **Attendance Tracking** - Monitor student attendance and engagement
- **E-commerce Marketplace** - Buy and sell martial arts equipment with commission system
- **Admin Panel** - Comprehensive platform management and analytics
- **API-First Architecture** - RESTful APIs ready for mobile app integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
cd dojo-republic
npm install
```

### Seed Database with Demo Data

```bash
npm run seed
```

This creates demo accounts:
- **Admin**: admin@demo.com / password123
- **Dojo Owner**: owner@demo.com / password123
- **Player**: player@demo.com / password123
- **Coach**: coach@demo.com / coach123

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📚 User Roles & Capabilities

### 1. **Student** - Browse dojos, view attendance
### 2. **Player (Athlete)** - Create profile, add achievements, register for tournaments
### 3. **Parent** - Monitor children's progress and attendance
### 4. **Dojo Owner** - Manage dojo, students, and attendance
### 5. **Coach** - Manage students, submit tournaments
### 6. **Referee / Judge** - Access live scorecard, submit results
### 7. **Seller** - Manage online store and products
### 8. **Admin** - Platform-wide management and approvals

## 🎯 Core Modules

1. **Authentication & Authorization** - Multi-role system with secure sessions
2. **Dojo Management** - Full dojo profiles with approval workflow
3. **Player Profiles & Achievements** - Career tracking with admin verification
4. **Live Karate Scorecard** - Real-time match scoring
5. **Tournament System** - End-to-end tournament management
6. **Attendance Tracking** - Student attendance and engagement
7. **E-commerce Marketplace** - Product selling with commissions
8. **Admin Panel** - Comprehensive platform management

## 🔌 API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/dojos` - List dojos
- `GET /api/tournaments` - List tournaments
- `GET /api/players` - List athletes
- `GET /api/products` - List marketplace products
- `GET /api/admin/stats` - Admin statistics

## 🎨 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Session-based with bcryptjs
- **Database**: JSON files (MVP) → PostgreSQL ready
- **Icons**: Lucide React

## 📱 Mobile App Ready

API-first architecture designed for React Native mobile app integration.

## 🚢 Deployment

Deploy to Vercel, Netlify, AWS, or any Node.js hosting platform:

```bash
npm run build
```

## 🌟 Key Highlights

- ✅ Full-stack MVP in single codebase
- ✅ Production-ready architecture
- ✅ 9 distinct user roles with RBAC
- ✅ Approval workflows for content moderation
- ✅ Live karate scoring system
- ✅ E-commerce with commission system
- ✅ Mobile-app ready APIs
- ✅ SEO-friendly with SSR

## 📄 Project Structure

```
dojo-republic/
├── app/              # Pages and API routes
├── components/       # Reusable components
├── lib/              # Core utilities, types, database
├── data/             # JSON database files
└── scripts/          # Utility scripts
```

---

**Built with ❤️ for the Martial Arts Community**
