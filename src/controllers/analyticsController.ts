// controllers/analyticsController.ts
import { Response } from 'express';
import { getClientAnalyticsData } from '../services/analyticsService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export async function getClientAnalytics(req: AuthenticatedRequest, res: Response) {
  try {
    const clientId = req.user?._id; 
    const range = (req.query.range as '7d' | '30d') || '7d';
    const include = (req.query.include as string)?.split(',') || [];
       if (!clientId )
        return res.status(400).json({
          success: false,
          message: "clientId is required",
        });

    const analytics = await getClientAnalyticsData(clientId, range, include);

    if (!analytics.trends.calories.daily.length) {
      return res.status(204).send(); 
    }

    return res.json(analytics);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate analytics' });
  }
}
