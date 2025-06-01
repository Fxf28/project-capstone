// components/layout.tsx
import React from 'react';
import Head from 'next/head';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                {/* Metadata per halaman */}
                <title>EcoSort Backend API</title>
                <meta
                    name="description"
                    content="EcoSort is a smart waste classification backend API built with love and care for the environment."
                />
            </Head>
            <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
                <header className="bg-green-600 text-white p-4 shadow-md">
                    <h1 className="text-3xl font-bold">EcoSort</h1>
                </header>
                <main className="grow container mx-auto p-6">{children}</main>
                <footer className="bg-green-100 text-center py-4 mt-8">
                    <p className="text-gray-700">&copy; 2025 EcoSort</p>
                </footer>
            </div>
        </>
    );
}
