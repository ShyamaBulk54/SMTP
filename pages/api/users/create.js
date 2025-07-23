import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }

    // Check if user already exists
    const existingUserQuery = 'SELECT * FROM users WHERE email = $1';
    const existingUser = await pool.query(existingUserQuery, [email]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Insert new user
    const insertUserQuery = `
      INSERT INTO users (email, name, is_authenticated)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const userResult = await pool.query(insertUserQuery, [email, name, true]);
    const newUser = userResult.rows[0];

    // Create initial dashboard data for the user
    const dashboardQuery = `
      INSERT INTO dashboard_data (user_id, subscriber_count, active_subscribers, total_emails_sent, open_rate, click_rate)
      VALUES ($1, 0, 0, 0, 0.00, 0.00)
      RETURNING *
    `;
    const dashboardResult = await pool.query(dashboardQuery, [newUser.id]);

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      dashboard_data: dashboardResult.rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}