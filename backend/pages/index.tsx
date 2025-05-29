import React, { useEffect, useState } from 'react';
import Layout from './components/layout';

export default function HomePage() {
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <Layout>
      <div className="font-sans max-w-3xl mx-auto my-12 p-6 bg-gray-100 rounded-lg">
        <h1 className="text-center text-green-500 text-4xl font-semibold">
          🌱 EcoSort Backend API
        </h1>

        <div className="bg-white p-6 rounded-md mt-6 shadow-sm">
          <h2 className="text-2xl mb-4">🚀 API Status: Running</h2>
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Environment:</strong> Development</p>
          <p><strong>Timestamp:</strong> {timestamp || "Loading..."}</p>
        </div>

        <div className="bg-white p-6 rounded-md mt-6 shadow-sm">
          <h2 className="text-2xl mb-4">🔗 Quick Test Links</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><a href="/api" target="_blank" className="text-blue-600 hover:underline">📋 API Documentation</a></li>
            <li><a href="/api/test" target="_blank" className="text-blue-600 hover:underline">🧪 Connection Test</a></li>
            <li><a href="/api/health" target="_blank" className="text-blue-600 hover:underline">❤️ Health Check</a></li>
          </ul>
        </div>

        <div className="bg-green-100 p-6 rounded-md mt-6 shadow-sm">
          <h2 className="text-2xl mb-4">📱 Frontend Connection</h2>
          <p>Make sure frontend is running on: <code className="bg-gray-200 px-1 rounded">http://localhost:5173</code></p>
          <p>Or in your custom domain</p>
          <p>CORS is configured for development environment.</p>
        </div>
      </div>
    </Layout>
  );
}
