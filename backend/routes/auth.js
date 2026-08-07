import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (typeof email !== 'string' || typeof password !== 'string' ||
        !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return res.status(400).json({ 
        message: 'Enter a valid email and a password of at least 8 characters' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
      return res.status(403).json({ 
        message: `Account locked. Try again in ${remainingTime} minutes` 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account if max attempts reached
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        await user.save();
        return res.status(403).json({ 
          message: `Account locked due to too many failed attempts. Try again in 15 minutes` 
        });
      }
      
      await user.save();
      return res.status(401).json({ 
        message: 'Invalid credentials',
        remainingAttempts: MAX_LOGIN_ATTEMPTS - user.loginAttempts
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();

    // Generate access token (15 minutes)
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Generate refresh token (7 days)
    const refreshToken = jwt.sign(
      { id: user._id, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (e) {
    next(e);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user._id, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    next(e);
  }
});

router.post('/refresh', async (req, res, next) => {

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Generate new refresh token (rotation)
    const newRefreshToken = jwt.sign(
      { id: user._id, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

export default router;