# Wasata Connect Backend Server

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- `MONGODB_URI`: MongoDB connection string (use `mongodb://localhost:27017/wasata-connect` for local)
- `JWT_SECRET`: A strong random string for JWT signing
- `CORS_ORIGIN`: Frontend URL (e.g., `http://localhost:5173` for local dev)
- `PORT`: Server port (default: 5000)

4. Seed the database with dummy data:
```bash
npm run seed
```

This will create:
- 1 admin user (admin@wasata.com / admin123)
- 3 test users (job seekers)
- 2 companies (1 approved, 1 pending)
- 5 jobs
- 3 applications

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Auth
- `POST /api/auth/register-user` - Register as job seeker
- `POST /api/auth/register-company` - Register as company
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Jobs (Public)
- `GET /api/jobs` - List all active jobs
- `GET /api/jobs/:id` - Get job details

### User (Protected)
- `GET /api/me` - Get user profile
- `PUT /api/me` - Update user profile
- `GET /api/me/applications` - Get user's applications
- `POST /api/applications` - Create application

### Company (Protected)
- `GET /api/company/me` - Get company profile
- `GET /api/company/me/jobs` - Get company's jobs
- `POST /api/company/jobs` - Create job (requires approval)
- `PUT /api/company/jobs/:id` - Update job
- `DELETE /api/company/jobs/:id` - Delete job
- `GET /api/company/jobs/:id/applicants` - Get job applicants

### Admin (Protected)
- `GET /api/admin/companies` - List companies
- `PUT /api/admin/companies/:id/approve` - Approve company
- `PUT /api/admin/companies/:id/reject` - Reject company
- `GET /api/admin/users` - List users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/jobs` - List all jobs
- `DELETE /api/admin/jobs/:id` - Delete job
- `GET /api/admin/applications` - List all applications

### Upload
- `POST /api/uploads` - Upload file (CV, documents)

## Deployment

For production deployment on Render:

1. Set environment variables in Render dashboard
2. Use MongoDB Atlas connection string for `MONGODB_URI`
3. Set `CORS_ORIGIN` to your Netlify frontend URL
4. Deploy using `npm start`

## File Uploads

Currently, files are stored locally in the `uploads/` directory. For production, you should:
1. Use a cloud storage service (S3, Cloudinary, etc.)
2. Update the upload route to handle cloud storage
3. Update the file URL generation logic

