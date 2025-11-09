const express = require('express');
const { coursesController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getCourseById);
router.get('/:id/statistics', coursesController.getCourseStatistics);

// Apenas admin pode criar/editar cursos
router.post('/', requireRole(['admin']), coursesController.createCourse);
router.put('/:id', requireRole(['admin']), coursesController.updateCourse);

module.exports = router;