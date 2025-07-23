import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get user details
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get dashboard data
    const dashboardQuery = 'SELECT * FROM dashboard_data WHERE user_id = $1';
    const dashboardResult = await pool.query(dashboardQuery, [user_id]);

    // Get subscribers list
    const subscribersQuery = `
      SELECT 
        id,
        email,
        name,
        status,
        created_at
      FROM subscribers
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const subscribersResult = await pool.query(subscribersQuery, [user_id]);

    // Get monthly growth data (last 6 months)
    const monthlyGrowthQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_subscribers
      FROM subscribers
      WHERE user_id = $1
      AND created_at >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `;
    const monthlyGrowthResult = await pool.query(monthlyGrowthQuery, [user_id]);

    res.status(200).json({
      user: user,
      dashboard_data: dashboardResult.rows[0] || {
        user_id: user_id,
        subscriber_count: 0,
        active_subscribers: 0,
        total_emails_sent: 0,
        open_rate: 0.00,
        click_rate: 0.00
      },
      subscribers: subscribersResult.rows,
      monthly_growth: monthlyGrowthResult.rows,
      graph_data: {
        subscriber_growth: monthlyGrowthResult.rows.map(row => ({
          month: row.month,
          count: parseInt(row.new_subscribers)
        })),
        engagement_metrics: {
          open_rate: dashboardResult.rows[0]?.open_rate || 0,
          click_rate: dashboardResult.rows[0]?.click_rate || 0,
          bounce_rate: Math.max(0, 100 - (dashboardResult.rows[0]?.open_rate || 0))
        }
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}