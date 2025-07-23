// pages/api/subscribers/create.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, address, userId } = req.body;

    // Create subscriber
    const subscriber = await createSubscriber({
      name,
      email,
      phone,
      address,
      userId
    });

    // Create initial dashboard data
    await createInitialDashboardData(subscriber.id);

    res.status(201).json(subscriber);
  } catch (error) {
    console.error('Error creating subscriber:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function createSubscriber(subscriberData) {
  // আপনার database create logic
  return { id: 'sub123', ...subscriberData };
}

async function createInitialDashboardData(subscriberId) {
  const dashboardEntries = [
    { subscriberId, metric: 'page_views', value: 0, date: new Date() },
    { subscriberId, metric: 'clicks', value: 0, date: new Date() },
    { subscriberId, metric: 'conversions', value: 0, date: new Date() },
    { subscriberId, metric: 'engagement', value: 0, date: new Date() }
  ];
  
  // Save to database
  // await saveDashboardData(dashboardEntries);
}