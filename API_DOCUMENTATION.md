# Dojo Republic - API Documentation

Base URL: `http://localhost:3000/api` (Development)

## Authentication

All authenticated endpoints require a session cookie. The session is set automatically after login.

### Register User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "phoneNumber": "+1 555 123 4567" // optional
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "abc123",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "student",
    "isApproved": true
  }
}
```

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@demo.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "admin-1",
    "email": "admin@demo.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Logout
```
POST /api/auth/logout
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

### Get Current User
```
GET /api/auth/me
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "admin-1",
    "email": "admin@demo.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

## Dojos

### List All Dojos
```
GET /api/dojos
```

**Query Parameters:**
- `city` (optional) - Filter by city name
- `martialArt` (optional) - Filter by martial art
- `approved` (optional) - Filter by approval status (default: true)

**Response:** `200 OK`
```json
{
  "dojos": [
    {
      "id": "dojo-1",
      "name": "Dragon Warrior Karate Dojo",
      "city": "New York",
      "country": "USA",
      "martialArts": ["Karate", "Kickboxing"],
      "description": "Premier karate training facility...",
      "isApproved": true
    }
  ]
}
```

### Create Dojo
```
POST /api/dojos
```

**Auth Required:** Yes (Dojo Owner or Admin)

**Request Body:**
```json
{
  "name": "My Dojo",
  "description": "Best dojo in town",
  "martialArts": ["Karate"],
  "address": "123 Main St",
  "city": "Boston",
  "country": "USA",
  "phoneNumber": "+1 555 999 8888",
  "email": "info@mydojo.com",
  "pricing": [
    {
      "name": "Monthly",
      "price": 150,
      "duration": "1 month",
      "description": "Unlimited classes"
    }
  ],
  "schedule": [
    {
      "day": "Monday",
      "startTime": "18:00",
      "endTime": "19:30",
      "className": "Adult Karate",
      "instructor": "John Doe"
    }
  ]
}
```

**Response:** `201 Created`

---

## Tournaments

### List Tournaments
```
GET /api/tournaments
```

**Query Parameters:**
- `approved` (optional) - Filter by approval status (default: true)
- `upcoming` (optional) - Show only upcoming tournaments
- `city` (optional) - Filter by city

**Response:** `200 OK`
```json
{
  "tournaments": [
    {
      "id": "tournament-1",
      "name": "Spring Karate Championship 2026",
      "startDate": "2026-04-15T09:00:00.000Z",
      "endDate": "2026-04-16T18:00:00.000Z",
      "city": "Boston",
      "martialArt": "Karate",
      "registrationFee": 50,
      "isApproved": true
    }
  ]
}
```

### Create Tournament
```
POST /api/tournaments
```

**Auth Required:** Yes (Dojo Owner, Coach, Referee, Judge, or Admin)

**Request Body:**
```json
{
  "name": "My Tournament",
  "description": "Annual championship",
  "martialArt": "Karate",
  "startDate": "2026-05-01T09:00:00.000Z",
  "endDate": "2026-05-01T18:00:00.000Z",
  "registrationDeadline": "2026-04-20T23:59:59.000Z",
  "venue": "Sports Arena",
  "city": "Miami",
  "country": "USA",
  "categories": [
    {
      "id": "cat-1",
      "name": "Kata",
      "ageGroup": "18+",
      "gender": "mixed"
    }
  ],
  "rules": "WKF official rules",
  "contactEmail": "organizer@email.com",
  "contactPhone": "+1 555 777 8888",
  "registrationFee": 40
}
```

**Response:** `201 Created`

---

## Players

### List Players
```
GET /api/players
```

**Response:** `200 OK`
```json
{
  "players": [
    {
      "id": "player-profile-1",
      "userId": "player-1",
      "name": "Sarah Johnson",
      "age": 22,
      "beltCategory": "Black Belt 2nd Dan",
      "city": "New York",
      "country": "USA",
      "achievements": [
        {
          "id": "achievement-1",
          "tournamentName": "National Championship 2024",
          "position": "gold",
          "isApproved": true
        }
      ]
    }
  ]
}
```

---

## Products (Marketplace)

### List Products
```
GET /api/products
```

**Query Parameters:**
- `approved` (optional) - Filter by approval status (default: true)

**Response:** `200 OK`
```json
{
  "products": [
    {
      "id": "product-1",
      "name": "Karate Gi",
      "description": "Premium quality uniform",
      "price": 75,
      "stock": 50,
      "category": "Uniforms",
      "isApproved": true,
      "isActive": true
    }
  ]
}
```

---

## Admin Endpoints

All admin endpoints require admin role authentication.

### Get Platform Statistics
```
GET /api/admin/stats
```

**Auth Required:** Yes (Admin only)

**Response:** `200 OK`
```json
{
  "stats": {
    "pendingDojos": 2,
    "pendingTournaments": 3,
    "pendingAchievements": 5,
    "pendingSellers": 1,
    "totalUsers": 45,
    "totalDojos": 15,
    "totalTournaments": 25,
    "totalOrders": 120,
    "totalRevenue": 45000,
    "commissionEarned": 4500
  }
}
```

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

**Error Response Format:**
```json
{
  "error": "Error message here"
}
```

---

## Common Data Types

### User Roles
- `student`
- `player`
- `parent`
- `dojo_owner`
- `coach`
- `referee`
- `judge`
- `seller`
- `admin`

### Achievement Positions
- `gold`
- `silver`
- `bronze`
- `participation`

### Martial Arts
- Karate
- Taekwondo
- Judo
- Brazilian Jiu-Jitsu
- MMA
- Boxing
- Muay Thai
- Kung Fu
- Kickboxing
- Wrestling

---

## Demo Accounts

For testing, use these credentials:

- **Admin**: admin@demo.com / password123
- **Dojo Owner**: owner@demo.com / password123
- **Player**: player@demo.com / password123
- **Coach**: coach@demo.com / coach123

---

## Rate Limiting

Currently no rate limiting (MVP). For production, implement rate limiting on all endpoints.

## CORS

Development: All origins allowed
Production: Configure allowed origins

## WebSocket Support

Not implemented in MVP. Can be added for:
- Live tournament updates
- Real-time scorecard
- Chat functionality
