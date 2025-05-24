import React from 'react';

export default function HomePage() {
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '50px auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '10px'
    }}>
      <h1 style={{ color: '#22c55e', textAlign: 'center' }}>
        🌱 EcoSort Backend API
      </h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>🚀 API Status: Running</h2>
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Environment:</strong> Development</p>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>🔗 Quick Test Links</h2>
        <ul>
          <li><a href="/api" target="_blank">📋 API Documentation</a></li>
          <li><a href="/api/test" target="_blank">🧪 Connection Test</a></li>
          <li><a href="/api/health" target="_blank">❤️ Health Check</a></li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>📱 Frontend Connection</h2>
        <p>Make sure frontend is running on: <code>http://localhost:5173</code></p>
        <p>CORS is configured for development environment.</p>
      </div>
    </div>
  );
}