const express =
  require('express');

const ApprovedCourseController =
  require('../controllers/approvedCourse.controller');

const authMiddleware =
  require('../middleware/auth.middleware');

const router =
  express.Router();

router.get(
  '/me/approved-courses',
  authMiddleware,
  ApprovedCourseController.getMine
);

router.post(
  '/me/approved-courses',
  authMiddleware,
  ApprovedCourseController.add
);

router.delete(
  '/me/approved-courses/:courseId',
  authMiddleware,
  ApprovedCourseController.remove
);

router.get(
  '/:academicRegistry/approved-courses',
  authMiddleware,
  ApprovedCourseController
    .getByAcademicRegistry
);

module.exports = router;