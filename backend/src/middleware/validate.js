import { body, validationResult } from 'express-validator';

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

export const validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('department')
    .optional({ checkFalsy: true })
    .isIn(['Sound', 'Media', 'Streaming', 'Equipment', 'General'])
    .withMessage('Department must be one of: Sound, Media, Streaming, Equipment, General'),

  body('firebaseUid')
    .notEmpty().withMessage('Firebase UID is required'),

  handleValidation,
];
