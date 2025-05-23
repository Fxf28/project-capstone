'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import * as tf from '@tensorflow/tfjs';
import NextImage from "next/image";
import React, { useEffect, useState, useRef } from 'react';

const labels = [
    "Kardus", "Organik", "Kaca", "Logam", "Sampah Campuran",
    "Kertas", "Plastik", "Sampah Tekstil", "Vegetasi"
];

const wasteManagementInfo: Record<string, string> = {
    "Kardus": "Simpan dalam keadaan kering dan rapi. Bisa disetor ke bank sampah untuk didaur ulang.",
    "Organik": "Gunakan untuk kompos atau buang ke tempat sampah organik. Jangan dicampur dengan sampah anorganik.",
    "Kaca": "Pisahkan berdasarkan warna. Beberapa bank sampah menerima kaca untuk didaur ulang.",
    "Logam": "Bersihkan dan pisahkan, lalu dapat dijual atau disetor ke bank sampah atau pengepul logam.",
    "Sampah Campuran": "Sampah jenis ini biasanya tidak diterima bank sampah dan harus dibuang ke TPS umum.",
    "Kertas": "Pisahkan dari sampah basah dan kotor. Bisa disetorkan ke bank sampah untuk didaur ulang.",
    "Plastik": "Bersihkan, pisahkan jenisnya, dan setorkan ke bank sampah yang menerima plastik.",
    "Sampah Tekstil": "Beberapa bank sampah menerima pakaian bekas layak pakai untuk disumbangkan atau didaur ulang.",
    "Vegetasi": "Cacah untuk kompos. Biasanya tidak diterima bank sampah karena mudah terurai alami."
};


const Dashboard = () => {
    const { user, isLoaded } = useUser();
    const [model, setModel] = useState<tf.GraphModel | null>(null);
    const [chatMessages, setChatMessages] = useState<React.ReactNode[]>([]);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const modelUrl = '/model/model.json';
                const loadedModel = await tf.loadGraphModel(modelUrl);
                setModel(loadedModel);
            } catch (error) {
                console.error('Failed to load model:', error);
            }
        };
        loadModel();
    }, []);

    // Auto scroll chat to bottom on new message
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const addMessage = (content: React.ReactNode, sender: 'user' | 'bot') => {
        setChatMessages(prev => [
            ...prev,
            <div
                key={prev.length}
                className={`p-4 rounded-lg max-w-xs break-words shadow-md
                    ${sender === 'user'
                        ? 'bg-blue-600 text-white self-end rounded-br-none'
                        : 'bg-gray-100 text-black self-start rounded-bl-none'}`
                }
            >
                {content}
            </div>
        ]);
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !model) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const img = new Image();
            img.src = reader.result as string;
            setImageSrc(img.src);
            addMessage(<NextImage src={img.src} alt="Uploaded" width={150} height={150} className="rounded" />, 'user');

            img.onload = async () => {
                const tensor = tf.browser.fromPixels(img)
                    .resizeNearestNeighbor([224, 224])
                    .toFloat()
                    .div(255.0)
                    .expandDims();

                const output = model.predict(tensor) as tf.Tensor;
                const data = await output.data();
                const predictedIndex = data.indexOf(Math.max(...data));
                const predictedLabel = labels[predictedIndex];

                addMessage(
                    <>
                        <p className="font-semibold text-lg mb-1">Jenis Sampah: <span className="text-blue-400">{predictedLabel}</span></p>
                        <p className="mb-2">{wasteManagementInfo[predictedLabel]}</p>
                        {wasteManagementInfo[predictedLabel]?.includes("bank sampah") && (
                            <a
                                href="/bank-sampah"
                                className="text-blue-500 underline hover:text-blue-300"
                                target="_blank" rel="noopener noreferrer"
                            >
                                Lihat bank sampah terdekat
                            </a>
                        )}
                    </>,
                    'bot'
                );

                tensor.dispose();
                output.dispose();
            };
        };
        reader.readAsDataURL(file);
    };

    if (!isLoaded) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-400 text-lg bg-gray-900">
                Loading user data...
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-6 mt-10 bg-gray-900 rounded-lg shadow-xl text-gray-100">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-white">
                Hai, {user?.fullName}
            </h2>

            <div className="mb-6">
                <Label htmlFor="picture" className="mb-2 text-lg font-medium text-gray-300">
                    Upload Gambar Sampah
                </Label>
                <Input
                    id="picture"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer bg-gray-800 text-gray-100 border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            {imageSrc && (
                <div className="mb-6 flex justify-center">
                    <NextImage
                        src={imageSrc}
                        alt="Preview Upload"
                        width={200}
                        height={200}
                        className="rounded-lg border border-gray-700 shadow-lg"
                        priority
                    />
                </div>
            )}

            <div
                ref={chatContainerRef}
                className="flex flex-col gap-4 bg-gray-800 p-5 border border-gray-700 rounded-lg max-h-[480px] overflow-y-auto
                scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900"
            >
                {chatMessages.length === 0 && (
                    <p className="text-center text-gray-500 select-none">
                        Obrolan akan muncul di sini setelah kamu upload gambar.
                    </p>
                )}
                {chatMessages}
            </div>
        </div>
    );
};

export default Dashboard;
