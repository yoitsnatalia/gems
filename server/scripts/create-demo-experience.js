const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const demoData = {
  users: [
    { username: 'demo_user', email: 'demo@gems.app', password: 'demo123' },
    { username: 'sarah_sf', email: 'sarah@demo.gems.app', password: 'demo123' },
    { username: 'mike_paris', email: 'mike@demo.gems.app', password: 'demo123' },
    { username: 'emma_tokyo', email: 'emma@demo.gems.app', password: 'demo123' },
    { username: 'alex_nyc', email: 'alex@demo.gems.app', password: 'demo123' },
    { username: 'lisa_london', email: 'lisa@demo.gems.app', password: 'demo123' }
  ],
  
  // Demo user location: San Francisco (37.7749, -122.4194)
  nearbyPosts: [
    {
      username: 'sarah_sf',
      caption: '☕ Hidden gem coffee shop! Perfect morning spot with amazing pastries',
      latitude: 37.7751, // 50 meters from demo user
      longitude: -122.4190,
      location_name: 'Union Square, San Francisco',
      image_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=600&fit=crop&crop=center'
    },
    {
      username: 'sarah_sf',
      caption: '🌮 Best fish tacos in the city! Local secret spot',
      latitude: 37.7745, // 80 meters from demo user
      longitude: -122.4198,
      location_name: 'Downtown San Francisco',
      image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&crop=center'
    },
    {
      username: 'alex_nyc',
      caption: '🎨 Amazing street art! Such creativity in this alley',
      latitude: 37.7750, // 30 meters from demo user
      longitude: -122.4192,
      location_name: 'Market Street, San Francisco',
      image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&crop=center'
    }
  ],

  sfPosts: [
    {
      username: 'sarah_sf',
      caption: '🌅 Sunrise at Golden Gate! Worth the early wake-up call',
      latitude: 37.8199,
      longitude: -122.4783,
      location_name: 'Golden Gate Bridge, San Francisco',
      image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
    },
    {
      username: 'alex_nyc',
      caption: '🦭 Sea lions everywhere! Kids will love this spot',
      latitude: 37.8086,
      longitude: -122.4098,
      location_name: 'Pier 39, San Francisco',
      image_url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=800&h=600&fit=crop&crop=center'
    },
    {
      username: 'lisa_london',
      caption: '🌳 Perfect picnic spot in Golden Gate Park. So peaceful!',
      latitude: 37.7694,
      longitude: -122.4862,
      location_name: 'Golden Gate Park, San Francisco',
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&crop=center'
    }
  ],

  internationalPosts: [
    // Paris Posts
    {
      username: 'mike_paris',
      caption: '🥐 Café au lait perfection! This boulangerie is pure magic',
      latitude: 48.8566,
      longitude: 2.3522,
      location_name: 'Le Marais, Paris',
      image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&crop=center'
    },
    {
      username: 'mike_paris',
      caption: '🗼 Secret Eiffel Tower viewpoint! No crowds, perfect photos',
      latitude: 48.8584,
      longitude: 2.2945,
      location_name: 'Trocadéro, Paris',
      image_url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop&crop=center'
    },

    // Tokyo Posts
    {
      username: 'emma_tokyo',
      caption: '🍜 Hole-in-the-wall ramen spot. Life-changing tonkotsu broth!',
      latitude: 35.6762,
      longitude: 139.6503,
      location_name: 'Shibuya, Tokyo',
      image_url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop&crop=center'
    },
    {
      username: 'emma_tokyo',
      caption: '🌸 Cherry blossom season! Early morning for the best shots',
      latitude: 35.7090,
      longitude: 139.7319,
      location_name: 'Ueno Park, Tokyo',
      image_url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop&crop=center'
    },

    // New York Posts
    {
      username: 'alex_nyc',
      caption: '🥯 Best bagel in NYC! Worth the 20-minute line every time',
      latitude: 40.7580,
      longitude: -73.9855,
      location_name: 'Times Square, New York',
      image_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&crop=center'
    },
    {
      username: 'alex_nyc',
      caption: '🌆 Rooftop bar with incredible skyline views. Sunset magic!',
      latitude: 40.7614,
      longitude: -73.9776,
      location_name: 'Midtown Manhattan, New York',
      image_url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop&crop=center'
    },

    // London Posts
    {
      username: 'lisa_london',
      caption: '☂️ Cozy pub with the best fish & chips. Perfect rainy day spot',
      latitude: 51.5074,
      longitude: -0.1278,
      location_name: 'Westminster, London',
      image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop&crop=center'
    },
    {
      username: 'lisa_london',
      caption: '🎡 London Eye area has this hidden gem garden. Tourist-free zone!',
      latitude: 51.5033,
      longitude: -0.1195,
      location_name: 'South Bank, London',
      image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&crop=center'
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
    const allPosts = [...demoData.nearbyPosts, ...demoData.sfPosts, ...demoData.internationalPosts];
    
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
    const users = await pool.query('SELECT id FROM users WHERE email LIKE $1', ['%@demo.gems.app']);
    const demoUser = await pool.query('SELECT id FROM users WHERE email = $1', ['demo@gems.app']);
    
    if (demoUser.rows.length > 0) {
      for (const user of users.rows) {
        if (user.id !== demoUser.rows[0].id) {
          const [smallerId, largerId] = demoUser.rows[0].id < user.id ? 
            [demoUser.rows[0].id, user.id] : [user.id, demoUser.rows[0].id];
          
          await pool.query(`
            INSERT INTO friendships (user1_id, user2_id, status)
            VALUES ($1, $2, 'accepted')
          `, [smallerId, largerId]);
        }
      }
    }
    console.log('✅ Demo friendships created');

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