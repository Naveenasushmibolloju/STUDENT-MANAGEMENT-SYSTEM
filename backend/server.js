import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';
import { connectDB } from './config/db.js';
import { auth } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/error.js';
import { apiLimiter, authLimiter, securityHeaders, corsConfig, sanitizeInput } from './middleware/security.js';
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import courseRoutes from './routes/courses.js';
import attendanceRoutes from './routes/attendance.js';
import dashboardRoutes from './routes/dashboard.js';
import User from './models/User.js';
import { seedDemoData } from './seed-data.js';

const required = ['MONGO_URI', 'JWT_SECRET'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
if (process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters');

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(corsConfig(process.env.CLIENT_URL));
app.use(sanitizeInput);

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging
app.use(morgan('tiny'));

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Health check
app.get('/api/v1/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', auth);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Seed an admin user on startup if no users exist (useful for in-memory dev server)
async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  const count = await User.countDocuments({});
  if (count === 0) {
    await User.create({
      name: 'System Administrator',
      email: ADMIN_EMAIL,
      password: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: 'admin',
      isActive: true
    });
    console.log(`Seeded admin user: ${ADMIN_EMAIL}`);
  }
}

const port = process.env.PORT || 5000;
connectDB()
  .then(async () => {
    await seedAdmin();
    await seedDemoData();
    app.listen(port, () => console.log(`API listening on ${port}`));
  })
  .catch(e => { console.error(e.message); process.exit(1); });

export default app;
