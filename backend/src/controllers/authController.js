import User from '../models/User.js';

export async function register(req, res, next) {
  try {
    const { name, email, department, firebaseUid } = req.body;

    if (!name || !email || !firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and firebaseUid are required',
      });
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { firebaseUid }],
    });

    if (existing) {
      const conflictField = existing.firebaseUid === firebaseUid ? 'account' : 'email';
      return res.status(409).json({
        success: false,
        message: `An account with that ${conflictField} already exists`,
      });
    }

    const user = await User.create({
      firebaseUid,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      department: department || 'General',
      role: 'member',
    });

    return res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (err) {
    console.error('[register]', err);
    next(err);
  }
}

export async function getMe(req, res) {
  const profile = req.userProfile.toObject();
  delete profile.__v;
  return res.status(200).json({ success: true, data: profile });
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = ['name', 'department', 'avatarUrl'];
    const updates = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No updatable fields provided. Allowed: name, department, avatarUrl',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userProfile._id,
      { $set: updates },
      { new: true, runValidators: true, select: '-__v' },
    );

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('[updateProfile]', err);
    next(err);
  }
}
