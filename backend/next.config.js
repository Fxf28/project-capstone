/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  
  // Fix CORS untuk semua API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Allow all origins for development
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-requested-with' },
          { key: 'Access-Control-Max-Age', value: '86400' }, // Cache preflight for 24 hours
        ]
      }
    ];
  }
};

module.exports = nextConfig;