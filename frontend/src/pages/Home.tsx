import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Upload,
  BookOpen,
  MessageCircle,
  MapPin,
  Leaf,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

// Counter component for animated numbers
interface CounterProps {
  value: number | string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Only animate if value is a number
    if (typeof value !== "number") return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const incrementTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  // If value is not a number, return it directly
  if (typeof value !== "number") {
    return <motion.span>{value}</motion.span>;
  }

  return <motion.span>{count}</motion.span>;
};

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [heroText, setHeroText] = useState("");
  const fullText = "Jadikan Sampah Lebih Bernilai dengan AI";
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typing animation effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setHeroText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 70);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const pulse = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Waste types data
  const wasteTypes = [
    { name: "Cardboard", emoji: "📦", color: "bg-amber-100 border-amber-300", description: "Kardus bekas kemasan" },
    { name: "Food Organics", emoji: "🍎", color: "bg-green-100 border-green-300", description: "Sisa makanan organik" },
    { name: "Glass", emoji: "🥃", color: "bg-cyan-100 border-cyan-300", description: "Botol dan pecahan kaca" },
    { name: "Metal", emoji: "🥫", color: "bg-gray-100 border-gray-300", description: "Kaleng dan logam lainnya" },
    { name: "Miscellaneous Trash", emoji: "🗑️", color: "bg-orange-100 border-orange-300", description: "Sampah campuran lainnya" },
    { name: "Paper", emoji: "📄", color: "bg-blue-100 border-blue-300", description: "Kertas bekas dan dokumen" },
    { name: "Plastic", emoji: "🍼", color: "bg-red-100 border-red-300", description: "Botol plastik dan kemasan" },
    { name: "Textile Trash", emoji: "👕", color: "bg-purple-100 border-purple-300", description: "Tekstil dan pakaian bekas" },
    { name: "Vegetation", emoji: "🌿", color: "bg-emerald-100 border-emerald-300", description: "Dedaunan dan tumbuhan" },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50"
      style={{
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/light-wool.png")',
        backgroundBlendMode: "soft-light",
      }}
    >
      {/* Hero Section */}
      <motion.section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
            variants={item}
          >
            <div className="inline-block overflow-hidden p-4">
              {heroText}
              {currentIndex < fullText.length && (
                <motion.span
                  className="ml-1 inline-block w-1 h-10 bg-primary-600 align-middle"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </div>
          </motion.h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            EcoSort membantu Anda mengidentifikasi jenis sampah menggunakan
            teknologi AI untuk mendukung daur ulang yang lebih efektif.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
              <Link
                to="/classify"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Mulai Klasifikasi
              </Link>
            </motion.div>
            <br />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
              <Link
                to="/about"
                className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Fitur Unggulan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Upload Gambar */}
            <motion.div
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
            >
              <Link to="/classify" className="block">
                <Upload className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Gambar</h3>
                <p className="text-gray-600">
                  Upload foto sampah dan dapatkan klasifikasi instan dengan AI
                </p>
              </Link>
            </motion.div>

            {/* Kamera Live */}
            <motion.div
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
            >
              <Link to={user ? "/classify" : "/login"} className="block">
                <Camera className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Kamera Live</h3>
                <p className="text-gray-600">
                  Gunakan kamera untuk klasifikasi real-time
                </p>
              </Link>
            </motion.div>

            {/* Edukasi */}
            <motion.div
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
            >
              <Link to={user ? "/education" : "/login"} className="block">
                <BookOpen className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Edukasi</h3>
                <p className="text-gray-600">
                  Pelajari cara daur ulang dan pengelolaan sampah
                </p>
              </Link>
            </motion.div>

            {/* EcoBot */}
            <motion.div
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
            >
              <Link to={user ? "/chatbot" : "/login"} className="block">
                <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">EcoBot</h3>
                <p className="text-gray-600">
                  Chatbot AI untuk konsultasi pengelolaan sampah
                </p>
              </Link>
            </motion.div>

            {/* Bank Sampah */}
            <motion.div
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
            >
              <Link to={user ? "/waste-bank" : "/login"} className="block">
                <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Bank Sampah</h3>
                <p className="text-gray-600">
                  Temukan lokasi bank sampah terdekat
                </p>
              </Link>
            </motion.div>

            {/* Ramah Lingkungan */}
            <motion.div
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.03 }}
            >
              <Link to="/about" className="block">
                <Leaf className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ramah Lingkungan</h3>
                <p className="text-gray-600">
                  Berkontribusi untuk lingkungan yang lebih bersih
                </p>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Waste Classification Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              9 Jenis Sampah yang Dapat Diklasifikasi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              EcoSort AI dapat mengidentifikasi berbagai jenis sampah dengan akurasi 98% untuk membantu proses daur ulang yang tepat
            </p>
          </motion.div>

          {/* Scrolling waste types */}
          <div className="relative">
            {/* First row - moving left */}
            <motion.div
              className="flex space-x-6 mb-6"
              animate={{
                x: [-50, -1400],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...wasteTypes, ...wasteTypes.slice(0, 5)].map((waste, index) => (
                <motion.div
                  key={`row1-${index}`}
                  className={`flex-shrink-0 w-72 p-6 rounded-xl border-2 ${waste.color} backdrop-blur-sm shadow-sm`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">{waste.emoji}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{waste.name}</h3>
                    <p className="text-sm text-gray-600">{waste.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Second row - moving right */}
            <motion.div
              className="flex space-x-6"
              animate={{
                x: [-1400, -50],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...wasteTypes.slice(4), ...wasteTypes.slice(0, 8)].map((waste, index) => (
                <motion.div
                  key={`row2-${index}`}
                  className={`flex-shrink-0 w-72 p-6 rounded-xl border-2 ${waste.color} backdrop-blur-sm shadow-sm`}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">{waste.emoji}</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{waste.name}</h3>
                    <p className="text-sm text-gray-600">{waste.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-lg text-gray-600 mb-6">
              Coba klasifikasi sampah Anda sekarang dan dapatkan panduan daur ulang yang tepat!
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/classify"
                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
              >
                <Upload className="mr-2 h-5 w-5" />
                Coba Klasifikasi Sekarang
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <motion.section
        className="py-16 px-4 bg-primary-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
          transition: {
            duration: 0.8,
            staggerChildren: 0.2,
          },
        }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Dampak Positif
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            variants={container}
          >
            {[
              { value: 9, label: "Jenis Sampah" },
              { value: 98, label: "Akurasi AI", suffix: "%" },
              { value: "24/7", label: "Tersedia" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="bg-primary-700/30 p-8 rounded-2xl backdrop-blur-sm border border-white/10"
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
              >
                <motion.div
                  className="text-5xl font-bold mb-4"
                  variants={pulse}
                >
                  {typeof stat.value === "number" ? (
                    <Counter value={stat.value} duration={2} />
                  ) : (
                    stat.value
                  )}
                  {stat.suffix}
                </motion.div>
                <div className="text-xl">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-4"
              animate={{
                scale: [1, 1.03, 1],
                transition: {
                  duration: 3,
                  repeat: Infinity,
                },
              }}
            >
              Bergabunglah dengan EcoSort
            </motion.h2>
            <p className="text-xl text-gray-600 mb-8">
              Daftar sekarang untuk mengakses semua fitur premium dan
              berkontribusi untuk lingkungan yang lebih baik.
            </p>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
              <Link
                to="/login"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Mulai Sekarang
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};