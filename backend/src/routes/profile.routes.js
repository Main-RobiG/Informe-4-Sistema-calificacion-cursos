const express =
  require('express');

const ProfileController =
  require('../controllers/profile.controller');

const authMiddleware =
  require('../middleware/auth.middleware');

const router =
  express.Router();

router.get(
  '/me',
  authMiddleware,
  ProfileController.getMe
);

router.put(
  '/me',
  authMiddleware,
  ProfileController.updateMe
);

router.get(
  '/search',
  authMiddleware,
  ProfileController.search
);

router.get(
  '/:academicRegistry',
  authMiddleware,
  ProfileController.getByAcademicRegistry
);

module.exports = router;