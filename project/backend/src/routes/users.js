const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const { validate, updateProfileRules, changePasswordRules } = require('../middleware/validators');
const {
  getProfile, updateProfile, changePassword, uploadAvatar, getAllUsers, deleteAccount,
} = require('../controllers/userController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/avatars/'),
  filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed.'), false);
  },
});

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfileRules, validate, updateProfile);
router.put('/change-password', changePasswordRules, validate, changePassword);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.delete('/account', deleteAccount);

// Admin only
router.get('/', authorize('admin'), getAllUsers);

module.exports = router;
