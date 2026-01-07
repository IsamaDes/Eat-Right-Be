// routes/analyticsRoutes.ts
import { Router } from 'express';
import { getClientAnalytics } from '../controllers/analyticsController';
import protect from "../middleware/authMiddleware";

const router = Router();

/**
 * GET /api/client/analytics
 * Query params:
 * - range: '7d' | '30d'
 * - include: 'weight,mood,insights'
 */
router.get('/client', protect, getClientAnalytics);

export default router;
