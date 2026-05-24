# AI SAAS Dashboard

A production-ready, full-stack SaaS Dashboard built with **React 19 + Vite** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## Features

- **Authentication** - Register, Login, Forgot Password with JWT
- **Dashboard** - Revenue cards, usage charts, activity feed
- **Analytics** - Line, Bar, Pie charts with period selectors
- **AI Tools** - Content Generator, Email Generator, Social Media, Code Assistant, Image Prompt
- **Projects** — Full CRUD with status filtering and search
- **Billing** — Subscription plans, payment method, invoice history
- **Profile** — Personal info, avatar upload, security settings, 2FA
- **Settings** — Theme (dark/light/system), notifications, preferences, privacy
- **Global** — Sidebar, Navbar, Search (Cmd+K), Notification Center, Toasts, Modals, Skeletons, Error Pages

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, Redux Toolkit, Framer Motion, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs |
| Security | Helmet, CORS, express-rate-limit, express-mongo-sanitize |
| Dev tools | Nodemon, Winston logging, Morgan |

---

## Project Structure

```
nexus-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai-tools/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   └── layout/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── ai-tools/
│   │   │   ├── analytics/
│   │   │   ├── auth/
│   │   │   ├── billing/
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   ├── projects/
│   │   │   └── settings/
│   │   ├── services/
│   │   ├── store/
│   │   │   └── slices/
│   │   ├── styles/
│   │   └── utils/
│   └── ...config files
└── backend/
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── scripts/
        └── utils/
```

---

## Quick Start

### 1. Clone & install

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure environment

```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend
cp backend/.env.example backend/.env
# Fill in MONGO_URI, JWT_SECRET, and SMTP values
```

### 3. Seed the database (optional)

```bash
cd backend
npm run seed
```

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev        # runs on http://localhost:5173
```

---

## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET | `/api/auth/me` | ✅ | Current user |
| POST | `/api/auth/forgot-password` | ❌ | Send reset email |
| GET | `/api/users/profile` | ✅ | Get profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| PUT | `/api/users/change-password` | ✅ | Change password |
| POST | `/api/users/avatar` | ✅ | Upload avatar |
| GET | `/api/dashboard/stats` | ✅ | Dashboard overview |
| GET | `/api/dashboard/activity` | ✅ | Activity feed |
| GET | `/api/analytics` | ✅ | Analytics data |
| GET | `/api/projects` | ✅ | List projects |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/notifications` | ✅ | List notifications |
| PUT | `/api/notifications/read-all` | ✅ | Mark all read |
| GET | `/api/subscriptions` | ✅ | Get subscription |
| PUT | `/api/subscriptions/plan` | ✅ | Upgrade/downgrade |

---

## Demo Mode

The frontend works **without a running backend** using mock data. The Login page has a **"Demo Login"** button that signs you in instantly so you can explore the full UI.

**Demo credentials (with live backend):**
- Email: `demo@nexusai.com`
- Password: `Demo1234!`

---

## Design System

- **Colors:** Brand violet (`#6366f1`), accent cyan (`#06b6d4`), surface neutrals
- **Typography:** Syne (headings) · DM Sans (body) · JetBrains Mono (code)
- **Effects:** Glassmorphism cards, gradient text, backdrop blur, shimmer skeletons
- **Motion:** Framer Motion spring animations, staggered list entries, page transitions
- **Themes:** Dark, Light, System — persisted in localStorage

---

## Production Checklist

- [ ] Set `NODE_ENV=production` in backend `.env`
- [ ] Replace `JWT_SECRET` with a strong random 64-char string
- [ ] Configure real SMTP credentials (SendGrid / AWS SES / Postmark)
- [ ] Set `MONGO_URI` to MongoDB Atlas connection string
- [ ] Set `CLIENT_URL` to your production frontend domain
- [ ] Run `npm run build` in the frontend and serve the `dist/` folder
- [ ] Enable HTTPS / TLS on your server / CDN
- [ ] Set up a process manager (PM2) for the backend

---

## License

MIT — free to use, modify, and distribute.
