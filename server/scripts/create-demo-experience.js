const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const demoData = {
  users: [
    { username: 'gym_user', email: 'gym@demo.gems.app', password: 'demo123' },
    { username: 'rome_user', email: 'rome@demo.gems.app', password: 'demo123' },
    { username: 'disney_user', email: 'disney@demo.gems.app', password: 'demo123' },
    { username: 'betty', email: 'betty@demo.gems.app', password: 'demo123' },
    { username: 'james', email: 'james@demo.gems.app', password: 'demo123' },
    { username: 'inez', email: 'inez@demo.gems.app', password: 'demo123' },
  ],

  internationalPosts: [
    // Disney Posts
    {
      username: 'betty',
      caption: 'The most magical view :)',
      latitude: 33.8124,
      longitude: -117.9189,
      location_name: 'Sleeping Beauty\'s Castle',
      image_url: 'https://images.unsplash.com/photo-1584079797523-69256c98e107?w=800&h=600&fit=crop&crop=center'
    },
    {
      username: 'betty',
      caption: 'I\'ll never get over these Mickey shaped waffles, omg.',
      latitude: 33.8110,
      longitude: -117.9190,
      location_name: 'Carnation Cafe',
      image_url: 'https://images.unsplash.com/photo-1565006111725-706899ffbb7f?w=800&h=600&fit=crop&crop=center'
    },
    {
        username: 'betty',
        caption: 'Yo ho, bro',
        latitude: 33.8118,
        longitude: -117.9203,
        location_name: 'Pirates of the Caribbean',
        image_url: 'https://images.unsplash.com/photo-1681934539843-4763a630b94f?w=800&h=600&fit=crop&crop=center'
    },
    {
        username: 'james',
        caption: 'Everyone knows this is the best Disneyland ride.',
        latitude: 33.8146,
        longitude: -117.9178,
        location_name: 'I\'ts a Small World',
        image_url: 'https://images.unsplash.com/photo-1586311474914-bc6000c52358?w=800&h=600&fit=crop&crop=center'
    },
    {
        username: 'james',
        caption: 'Never gets old AHHHHHH',
        latitude: 33.8112,
        longitude: -117.9207,
        location_name: 'Space Mountain',
        image_url: 'https://images.unsplash.com/photo-1740889089141-3b60d6a1247c?w=800&h=600&fit=crop&crop=center'
    },
    {
        username: 'james',
        caption: '999 happy haunts and room for one more… guess I\’m moving in.',
        latitude: 33.8128,
        longitude: -117.9210,
        location_name: 'Haunted Mansion',
        image_url: 'https://images.unsplash.com/photo-1652387629882-95cb54299390?w=800&h=600&fit=crop&crop=center'
    },
    {
        username: 'inez',
        caption: 'Made it to Batuu!!',
        latitude: 33.8146,
        longitude: -117.9210,
        location_name: 'Galaxy\'s Edge',
        image_url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop&crop=center'
    },
    {
        username: 'inez',
        caption: 'Yeti jump-scare count: 3.',
        latitude: 33.8131,
        longitude: -117.9175,
        location_name: 'Matterhorn',
        image_url: 'https://images.unsplash.com/photo-1623345573216-f6e8be64ac6d?w=800&h=600&fit=crop&crop=center'
    },
    {
        username: 'inez',
        caption: 'So, I\'ve had three of these and counting.',
        latitude: 33.8118,
        longitude: -117.9193,
        location_name: 'Dole Whip',
        image_url: 'https://images.unsplash.com/photo-1564507973526-cc6a411f8307?w=800&h=600&fit=crop&crop=center'
    }
  ]
};

const createDemoExperience = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🌍 Creating global demo experience...');

    // Clear existing demo data
    await pool.query('DELETE FROM post_unlocks WHERE post_id IN (SELECT id FROM posts WHERE user_id IN (SELECT id FROM users WHERE email LIKE $1))', ['%@demo.gems.app']);
    await pool.query('DELETE FROM friendships WHERE user1_id IN (SELECT id FROM users WHERE email LIKE $1) OR user2_id IN (SELECT id FROM users WHERE email LIKE $1)', ['%@demo.gems.app']);
    await pool.query('DELETE FROM posts WHERE user_id IN (SELECT id FROM users WHERE email LIKE $1)', ['%@demo.gems.app']);
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['%@demo.gems.app']);
    console.log('🧹 Cleared existing demo data');

    // Create demo users
    for (const userData of demoData.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      await pool.query(`
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
      `, [userData.username, userData.email, hashedPassword]);
    }
    console.log('✅ Demo users created');

    // Create all posts (nearby + SF + international)
    const allPosts = [...demoData.internationalPosts];
    
    for (const postData of allPosts) {
      const userResult = await pool.query(
        'SELECT id FROM users WHERE username = $1',
        [postData.username]
      );
      
      if (userResult.rows.length > 0) {
        // Random creation time in the last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        
        await pool.query(`
          INSERT INTO posts (user_id, caption, image_url, latitude, longitude, location_name, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '${daysAgo} days')
        `, [
          userResult.rows[0].id,
          postData.caption,
          postData.image_url,
          postData.latitude,
          postData.longitude,
          postData.location_name
        ]);
      }
    }
    console.log('✅ Demo posts created globally');

    // Create friendships (demo user is friends with everyone)
    // const users = await pool.query('SELECT id FROM users WHERE email LIKE $1', ['%@demo.gems.app']);
    // const demoUser = await pool.query('SELECT id FROM users WHERE email = $1', ['demo@gems.app']);
    
    // if (demoUser.rows.length > 0) {
    //   for (const user of users.rows) {
    //     if (user.id !== demoUser.rows[0].id) {
    //       const [smallerId, largerId] = demoUser.rows[0].id < user.id ? 
    //         [demoUser.rows[0].id, user.id] : [user.id, demoUser.rows[0].id];
          
    //       await pool.query(`
    //         INSERT INTO friendships (user1_id, user2_id, status)
    //         VALUES ($1, $2, 'accepted')
    //       `, [smallerId, largerId]);
    //     }
    //   }
    // }
    // console.log('✅ Demo friendships created');

    await pool.end();
    console.log('🎉 Global demo experience ready!');
    console.log('📍 Demo user location: San Francisco (37.7749, -122.4194)');
    console.log('🔓 3 posts nearby to unlock, plus posts in Paris, Tokyo, NYC, London');
    console.log('🚀 Login with: demo@gems.app / demo123');

  } catch (error) {
    console.error('❌ Demo creation failed:', error);
    throw error;
  }
};

if (require.main === module) {
  createDemoExperience()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = createDemoExperience;