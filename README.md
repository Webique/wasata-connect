# Wasata Connect | وساطة

A full-stack bilingual (Arabic/English) accessible job platform connecting people with disabilities to inclusive employment opportunities.

## 🚀 Features

- **Job Seeker Dashboard**: Browse jobs, apply with CV upload, track applications
- **Company Dashboard**: Post jobs, manage applicants (after admin approval)
- **Admin Panel**: Approve/reject companies, manage users, jobs, and applications
- **Bilingual Support**: Full RTL/LTR support for Arabic and English
- **Accessibility**: Designed with accessibility best practices

## 🛠️ Tech Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- i18next for translations
- React Query

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer for file uploads

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)

## 🏃 Quick Start

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Setup Backend

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/wasata-connect
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=http://localhost:5173
PORT=5000
UPLOAD_DIR=./uploads
```

### 4. Seed Database (Optional)

```bash
cd server
npm run seed
```

This creates:
- Admin: `admin@wasata.com` / `admin123`
- Test users and companies
- Sample jobs and applications

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
wasata-connect/
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts (Auth, Language)
│   ├── pages/             # Page components
│   │   ├── auth/          # Auth pages
│   │   └── dashboard/     # Dashboard pages
│   ├── lib/               # Utilities & API client
│   └── i18n/              # Translations
├── server/                # Backend Express app
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── scripts/           # Seed script
└── public/                # Static assets
```

## 🔐 User Roles

### Job Seeker (User)
- Register with disability type
- Browse and search jobs
- Apply to jobs with CV upload
- View application status

### Company
- Register with commercial registration documents
- Wait for admin approval
- Post jobs (after approval)
- View and manage applicants

### Admin
- Approve/reject company registrations
- Manage users, jobs, and applications
- View audit logs

## 🌐 API Configuration

The frontend API client is configured in `src/config.ts`. For production:

1. Set `VITE_API_BASE_URL` in Netlify environment variables
2. Update `CORS_ORIGIN` in backend `.env` to match your frontend URL

## 📦 Deployment

### Frontend (Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set `VITE_API_BASE_URL` environment variable

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Build command: `cd server && npm install`
4. Start command: `cd server && npm start`

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in backend `.env`

## 🎨 Design System

- **Gold**: #A17322
- **Royal Blue**: #3373B8
- **Off-White**: #F7F7F7
- **Typography**: Cairo (Arabic), Inter (English)
- **Spacing**: Uses `gap` for RTL-friendly layouts

## 📝 Notes

- File uploads are currently stored locally. For production, integrate with S3/Cloudinary.
- The seed script can be run multiple times (clears existing data).
- All forms use proper labels and accessibility attributes.
- RTL support is handled via `dir="rtl"` and logical CSS properties.

## 🤝 Contributing

This project follows accessibility best practices and uses gap-based layouts for RTL compatibility.

## 📄 License

All rights reserved - Wasata Connect
