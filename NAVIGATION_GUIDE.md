# 🗺️ Dojo Republic - Navigation Guide

## 📍 Quick Access URLs

### Public Pages (No Login Required)
- **Home**: http://localhost:3000/
- **Browse Dojos**: http://localhost:3000/dojos
- **Browse Tournaments**: http://localhost:3000/tournaments
- **Browse Athletes**: http://localhost:3000/players
- **Marketplace**: http://localhost:3000/marketplace
- **About Us**: http://localhost:3000/about
- **Contact**: http://localhost:3000/contact

### Authentication Pages
- **Login**: http://localhost:3000/auth/login
- **Register**: http://localhost:3000/auth/register

### User Dashboards (Login Required)
- **Main Dashboard**: http://localhost:3000/dashboard
- **Admin Panel**: http://localhost:3000/admin

### Special Features
- **Live Scorecard**: http://localhost:3000/scorecard

---

## 🎭 Demo Accounts & What to Test

### 1. 👤 Admin Account
**Credentials**: admin@demo.com / password123

**What to Test:**
1. Login → http://localhost:3000/auth/login
2. View Admin Dashboard → http://localhost:3000/admin
3. Check pending approvals
4. View platform statistics
5. Manage all entities

**Key Features:**
- Approve/reject dojos
- Approve/reject tournaments
- Approve/reject achievements
- Approve/reject sellers
- View comprehensive analytics
- Manage all users

---

### 2. 🥋 Dojo Owner Account
**Credentials**: owner@demo.com / password123

**What to Test:**
1. Login → http://localhost:3000/auth/login
2. View Dashboard → http://localhost:3000/dashboard
3. Navigate to "My Dojo" (will show Dragon Warrior Karate Dojo)
4. Click "Students" - Manage enrolled students
5. Click "Attendance" - Track student attendance
6. Click "Tournaments" - Create new tournament
7. View dojo analytics

**Key Features:**
- Manage dojo information
- Enroll and manage students
- Mark attendance
- Submit tournaments for approval
- View dojo performance metrics

---

### 3. 🏆 Player Account
**Credentials**: player@demo.com / password123

**What to Test:**
1. Login → http://localhost:3000/auth/login
2. View Dashboard → http://localhost:3000/dashboard
3. Click "My Profile" - View athlete profile (Sarah Johnson)
4. Click "Achievements" - See approved achievements (2 gold/silver medals)
5. Browse tournaments to register
6. View personal statistics

**Key Features:**
- Manage athlete profile
- Add achievements (needs admin approval)
- Browse and register for tournaments
- View competition history
- Track personal stats

**Note:** This player already has 2 approved achievements you can view!

---

### 4. 👨‍🏫 Coach Account
**Credentials**: coach@demo.com / coach123

**What to Test:**
1. Login → http://localhost:3000/auth/login
2. View Dashboard → http://localhost:3000/dashboard
3. Navigate to "Students" - Manage training students
4. Click "Tournaments" - Create tournament
5. Click "Training Sessions" - Schedule sessions
6. Access live scorecard from menu

**Key Features:**
- Manage students
- Create and manage tournaments
- Schedule training sessions
- Access scorecard for judging

---

## 🎯 Feature Testing Checklist

### Public Features ✓
- [ ] Browse home page
- [ ] Filter dojos by city/martial art
- [ ] View dojo details
- [ ] Browse upcoming tournaments
- [ ] View athlete profiles
- [ ] Browse marketplace products
- [ ] Read about page
- [ ] Use contact form

### Authentication ✓
- [ ] Register new account
- [ ] Login with demo account
- [ ] Logout
- [ ] Access protected routes

### Dojo Management ✓
- [ ] Create new dojo (as dojo owner)
- [ ] View dojo listings
- [ ] Edit dojo information
- [ ] Add schedule and pricing

### Tournament System ✓
- [ ] Browse tournaments
- [ ] Create tournament (requires coach/owner login)
- [ ] View tournament details
- [ ] Check approval workflow (create tournament, then login as admin to approve)

### Player & Achievements ✓
- [ ] View player profiles (browse /players)
- [ ] Add achievement as player
- [ ] Approve achievement as admin
- [ ] View approved achievements publicly

### Live Scorecard ✓
- [ ] Access scorecard → http://localhost:3000/scorecard
- [ ] Add points (Ippon, Wazaari, Yuko)
- [ ] Track warnings and penalties
- [ ] Use timer
- [ ] Declare winner

### Admin Features ✓
- [ ] View admin dashboard
- [ ] Check pending approvals
- [ ] Approve/reject dojos
- [ ] Approve/reject tournaments
- [ ] Approve/reject achievements
- [ ] View platform statistics

### E-commerce ✓
- [ ] Browse marketplace
- [ ] View products
- [ ] Register as seller
- [ ] Add products (as seller)
- [ ] Approve products (as admin)

---

## 🔄 Suggested Testing Flow

### Flow 1: New User Journey
1. Visit home page → http://localhost:3000/
2. Browse dojos → Click "Find a Dojo" button
3. Filter by city or martial art
4. View a dojo detail page
5. Browse tournaments
6. View athlete profiles
7. Register new account
8. Login and access dashboard

### Flow 2: Tournament Lifecycle
1. Login as coach (coach@demo.com / coach123)
2. Go to dashboard
3. Click "Tournaments" → "Create Tournament"
4. Fill in tournament details
5. Submit (status: pending approval)
6. Logout
7. Login as admin (admin@demo.com / password123)
8. Go to admin panel
9. See "Pending Tournaments" count
10. Approve the tournament
11. Logout and view as public - tournament now visible

### Flow 3: Achievement Verification
1. Login as player (player@demo.com / password123)
2. Go to "Achievements"
3. Add new achievement
4. Logout
5. Login as admin
6. Navigate to "Manage Achievements"
7. See pending achievement
8. Approve it
9. View player profile publicly - achievement now visible

### Flow 4: Live Scoring
1. Navigate to http://localhost:3000/scorecard
2. Set player names (optional)
3. Start timer
4. Add scores:
   - Click + under Ippon for Player A
   - Click + under Wazaari for Player B
   - Add warnings/penalties as needed
5. Pause/resume timer
6. Declare winner
7. Reset for new match

---

## 📱 Responsive Testing

Test on different screen sizes:
- **Desktop**: 1920x1080
- **Laptop**: 1366x768
- **Tablet**: 768x1024
- **Mobile**: 375x667

All pages are fully responsive!

---

## 🎨 UI Components to Check

### Header Navigation
- Logo links to home
- Navigation menu (mobile hamburger menu)
- Login/Register buttons
- User menu when logged in

### Footer
- Quick links
- Social media icons
- Contact information
- Legal links

### Dashboard Cards
- Color-coded by category
- Hover effects
- Click to navigate
- Pending count badges (admin)

### Forms
- Input validation
- Error messages
- Loading states
- Success feedback

---

## 🐛 Known Behaviors (Not Bugs)

1. **Approval Workflow**: Items created by non-admin users require admin approval
2. **Session Persistence**: Sessions last 7 days
3. **Demo Data**: Pre-populated with 3 dojos, 2 tournaments, 1 player profile
4. **File Uploads**: Structure ready but needs S3/Cloudinary integration for production
5. **Payments**: Structure ready but needs Stripe/PayPal integration for production

---

## 💡 Tips for Best Experience

1. **Use demo accounts first** - They have pre-populated data
2. **Try admin approval workflow** - Create→Approve→View Public
3. **Test live scorecard** - Interactive and fun to use
4. **Browse on mobile** - Fully responsive design
5. **Check all dashboards** - Each role has different view
6. **Create new entities** - Test full CRUD operations

---

## 🆘 Quick Troubleshooting

### Can't login?
- Check credentials (case-sensitive)
- Run `npm run seed` to reset demo accounts

### Page not loading?
- Check if dev server is running (`npm run dev`)
- Clear browser cache
- Check terminal for errors

### API errors?
- Check browser console (F12)
- Verify session cookie is set
- Check API route in terminal output

### Database issues?
- Re-run `npm run seed`
- Check `data/` directory exists
- Verify JSON files are valid

---

## 📞 Support

If you encounter any issues:
1. Check terminal output for errors
2. Check browser console (F12)
3. Review error messages
4. Consult README.md for documentation

---

Enjoy exploring Dojo Republic! 🥋🏆
