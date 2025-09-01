# Gems

**Discover Hidden Places Through Friends**

A location-based social discovery app where posts can only be unlocked when you physically visit the same place your friends have been.

<a href="https://gems16.netlify.app" target="_blank">
  Slides for More Info
</a>

## What Makes Gems Unique

- **Location-Locked Posts** - Posts unlock only when you're within 100m of the location
- **Global Discovery** - See mysterious pins from friends worldwide 
- **Social Network** - Connect with friends and discover their hidden gems

## Live Demo

**[Try the Demo](https://gems16.netlify.app)** - Choose a destination from "Demo" for instant access

- No signup required
- Explore posts at Disneyland, in Rome, or at the gym
- Experience location-based unlocking with demo data

## Tech Stack

**Frontend:** React, Tailwind CSS, Mapbox GL JS  
**Backend:** Node.js, Express, PostgreSQL  
**Deployment:** Netlify + Railway  
**Features:** JWT Auth, Geolocation API, Image Upload

## Quick Start

```bash
# Clone and setup backend
git clone https://github.com/yoitsnatalia/gems.git
cd gems/server
npm install
npm run dev

# Setup frontend (new terminal)
cd ../client  
npm install
npm run start
```

**Environment Variables:**
- Backend: `DATABASE_URL`, `JWT_SECRET`, Cloudinary keys
- Frontend: `REACT_APP_API_URL`, `REACT_APP_MAPBOX_TOKEN`

## Key Features

- **Geospatial Calculations** - Haversine formula for precise distance verification
- **Interactive Maps** - Global exploration with local precision
- **Social Discovery** - Friend-based content sharing
- **Responsive Design** - Works on desktop and mobile
- **Secure Authentication** - JWT-based user sessions

## API Endpoints

```
POST /api/auth/login              # Authentication
GET  /api/posts/nearby            # Location-based posts  
POST /api/posts                   # Create location-locked post
GET  /api/friends/posts           # Global friends' posts
POST /api/friends/unlock          # Unlock post by proximity
```

## Technical Challenges Solved

- **Location Verification** - GPS accuracy validation without being restrictive
- **Global Scalability** - Optimized spatial queries for worldwide posts  
- **UX Design** - Intuitive mystery/reveal interaction for location unlocking
- **Authentic Discovery** - Prevented fake check-ins through geolocation requirements

## Developer

**[Natalia]**  
Portfolio: [https://yoitsnatalia.github.io/] | LinkedIn: [www.linkedin.com/in/natalia-linn]
