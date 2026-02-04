# Dojo Republic - Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
Create `.env.local` for production:

```env
# Production URL
NEXT_PUBLIC_API_URL=https://yourdomain.com

# Database (when migrating from JSON)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Session Secret
SESSION_SECRET=your-super-secret-key-change-this

# Email Service (optional)
SENDGRID_API_KEY=your-sendgrid-key

# File Upload (optional)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name

# Payment Gateway (optional)
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_PUBLISHABLE_KEY=your-stripe-public-key
```

### 2. Update Configuration Files

**next.config.ts:**
```typescript
const nextConfig = {
  // Enable production optimizations
  reactStrictMode: true,
  
  // Image domains (if using external images)
  images: {
    domains: ['your-cdn-domain.com'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **Set Environment Variables:**
- Go to Vercel Dashboard
- Project Settings → Environment Variables
- Add all required variables

5. **Deploy to Production:**
```bash
vercel --prod
```

**Pros:**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Automatic deployments from Git
- Free tier available

---

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build the project:**
```bash
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod
```

Or connect your Git repository:
- Go to Netlify Dashboard
- New site from Git
- Connect your repository
- Deploy

---

### Option 3: AWS (EC2 + S3)

1. **Setup EC2 Instance:**
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

2. **Deploy Application:**
```bash
# Clone repository
git clone your-repo-url
cd dojo-republic

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "dojo-republic" -- start
pm2 save
pm2 startup
```

3. **Setup Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

### Option 4: Docker

1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Create docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

3. **Build and Run:**
```bash
docker-compose up -d
```

---

## 🗄️ Database Migration

### From JSON to PostgreSQL

1. **Install Prisma:**
```bash
npm install @prisma/client
npm install -D prisma
```

2. **Initialize Prisma:**
```bash
npx prisma init
```

3. **Create Schema (prisma/schema.prisma):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  name        String
  role        String
  phoneNumber String?
  isApproved  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Add other models...
```

4. **Migrate:**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Update lib/db.ts:**
Replace JSON database with Prisma client.

---

## 📧 Email Service Setup

### Using SendGrid:

1. **Install:**
```bash
npm install @sendgrid/mail
```

2. **Create email utility (lib/email.ts):**
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendEmail(to: string, subject: string, html: string) {
  await sgMail.send({
    to,
    from: 'noreply@dojorepublic.com',
    subject,
    html,
  });
}
```

---

## 💳 Payment Gateway

### Stripe Integration:

1. **Install:**
```bash
npm install stripe @stripe/stripe-js
```

2. **Create payment endpoint:**
```typescript
// app/api/payments/route.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5000, // $50.00
    currency: 'usd',
  });
  
  return Response.json({ clientSecret: paymentIntent.client_secret });
}
```

---

## 📦 File Upload

### AWS S3:

1. **Install:**
```bash
npm install aws-sdk
```

2. **Create upload utility:**
```typescript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function uploadFile(file: Buffer, key: string) {
  await s3.putObject({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: file,
  }).promise();
  
  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
}
```

---

## 🔒 Security Hardening

### 1. Add Security Headers

**middleware.ts:**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );
  
  return response;
}
```

### 2. Rate Limiting

Install: `npm install express-rate-limit`

### 3. CORS Configuration

Update API routes to limit CORS to specific domains.

### 4. Environment Variables

Never commit `.env` files. Use platform-specific secret management.

---

## 📊 Monitoring & Analytics

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

### 2. Analytics (Google Analytics / Plausible)

Add to layout.tsx

### 3. Performance Monitoring

Use Vercel Analytics or custom solution

---

## 🧪 Testing Before Production

```bash
# Run build locally
npm run build
npm start

# Test on port 3000
curl http://localhost:3000

# Check for errors in console
# Test all user flows
# Verify API endpoints
```

---

## 📝 Post-Deployment

1. **Update DNS Records**
2. **Enable HTTPS**
3. **Setup Monitoring**
4. **Configure Backups** (especially for database)
5. **Setup CI/CD Pipeline**
6. **Monitor Logs**

---

## 🆘 Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next
npm run build
```

### Database Connection Issues

Check environment variables and connection string.

### Session Issues

Ensure cookies are being set correctly. Check domain and secure flags.

---

## 📈 Scaling Considerations

1. **Database**: Use connection pooling (PgBouncer for PostgreSQL)
2. **Caching**: Implement Redis for sessions and frequent queries
3. **CDN**: Use Cloudflare or AWS CloudFront
4. **Load Balancing**: Use multiple instances behind load balancer
5. **Database Replication**: Read replicas for heavy read operations

---

## ✅ Production Checklist

- [ ] Environment variables configured
- [ ] Database migrated and tested
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Security headers set
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] Error tracking setup
- [ ] Analytics installed
- [ ] Backups configured
- [ ] Monitoring active
- [ ] Performance tested
- [ ] SEO optimized
- [ ] Mobile responsive verified

---

For any deployment issues, refer to:
- Next.js Deployment Docs: https://nextjs.org/docs/deployment
- Vercel Docs: https://vercel.com/docs
- Your chosen platform's documentation
