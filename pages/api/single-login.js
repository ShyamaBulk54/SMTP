import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if email exists and is authenticated
    const userQuery = `
      SELECT * FROM users 
      WHERE email = $1 AND is_authenticated = true
    `;
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Email not found or not authenticated' });
    }

    const user = userResult.rows[0];

    // Get all users under this email (assuming one user per email for now)
    const usersQuery = `
      SELECT 
        u.id,
        u.email,
        u.name,
        u.created_at,
        COUNT(s.id) as subscriber_count
      FROM users u
      LEFT JOIN subscribers s ON u.id = s.user_id
      WHERE u.email = $1
      GROUP BY u.id, u.email, u.name, u.created_at
    `;
    const usersResult = await pool.query(usersQuery, [email]);

    // Get detailed subscriber information for each user
    const usersWithSubscribers = [];
    
    for (const user of usersResult.rows) {
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
      const subscribersResult = await pool.query(subscribersQuery, [user.id]);
      
      // Get dashboard data
      const dashboardQuery = `
        SELECT * FROM dashboard_data
        WHERE user_id = $1
      `;
      const dashboardResult = await pool.query(dashboardQuery, [user.id]);
      
      usersWithSubscribers.push({
        ...user,
        subscriber_count: parseInt(user.subscriber_count),
        subscribers: subscribersResult.rows,
        dashboard_data: dashboardResult.rows[0] || null
      });
    }

    res.status(200).json({
      message: 'Login successful',
      authenticated: true,
      user_email: email,
      users: usersWithSubscribers,
      total_users: usersWithSubscribers.length,
      total_subscribers: usersWithSubscribers.reduce((sum, user) => sum + user.subscriber_count, 0)
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}