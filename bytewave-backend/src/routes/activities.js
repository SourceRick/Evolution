const express = require('express');
const { activitiesController } = require('../controllers');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', activitiesController.getActivities);
router.get('/upcoming', activitiesController.getUpcomingActivities);
router.get('/student', activitiesController.getStudentActivities);
router.get('/:id', activitiesController.getActivityById);

// Apenas professores podem criar/editar atividades
router.post('/', requireRole(['professor', 'admin']), activitiesController.createActivity);
router.put('/:id', requireRole(['professor', 'admin']), activitiesController.updateActivity);

module.exports = router;