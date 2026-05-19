import { auth } from '../config/firebase.js';
import User from '../models/User.js';

export async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token is required',
    });
  }

  const token = authHeader.slice(7);

  try {
    const decoded = await auth.verifyIdToken(token);
    req.firebaseUser = decoded;
    next();
  } catch (err) {
    const message =
      err.code === 'auth/id-token-expired'
        ? 'Session expired. Please sign in again.'
        : 'Invalid or expired token';
    return res.status(401).json({ success: false, message });
  }
}

export async function attachUserProfile(req, res, next) {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid }).select('-__v');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please contact an administrator.',
      });
    }
    req.userProfile = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.userProfile) {
      return res.status(401).json({
        success: false,
        message: 'User profile not attached. Use attachUserProfile middleware first.',
      });
    }
    if (!roles.includes(req.userProfile.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
}
