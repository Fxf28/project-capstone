import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload, BookOpen, MessageCircle, MapPin, Leaf } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

// Counter component for animated numbers
interface CounterProps {
  value: number | string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Only animate if value is a number
    if (typeof value !== 'number') return;

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
  if (typeof value !== 'number') {
    return <motion.span>{value}</motion.span>;
  }

  return <motion.span>{count}</motion.span>;
};

export const Home: React.FC = () => {
  const { user } = useAuth();
  const [heroText, setHeroText] = useState('');
  const fullText = "Jadikan Sampah Lebih Bernilai dengan AI";
  const [currentIndex, setCurrentIndex] = useState(0);

  // Typing animation effect
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setHeroText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
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
        ease: "easeInOut"
      }
    }
  };

  const floating = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/light-wool.png")',
        backgroundBlendMode: 'soft-light',
      }}
    >
      {/* Hero Section */}
      <motion.section
        className="py-20 px-4"
        initial="initial"
        animate="animate"
        viewport={{ once: true }}
        variants={container}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight"
            variants={item}
          >
            <div className="inline-block overflow-hidden">
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

          <motion.p
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            variants={item}
          >
            EcoSort membantu Anda mengidentifikasi jenis sampah menggunakan teknologi AI untuk mendukung daur ulang yang lebih efektif.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={container}
          >
            <motion.div
              variants={item}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 15px 30px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to="/classify"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg flex items-center gap-2"
              >
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚀
                </motion.span>
                Mulai Klasifikasi
              </Link>
            </motion.div>

            <motion.div
              variants={item}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#f0f9ff",
                boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to="/about"
                className="border-2 border-primary-600 hover:bg-primary-50 text-primary-600 px-8 py-4 rounded-full font-semibold flex items-center gap-2"
              >
                <motion.span
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📘
                </motion.span>
                Pelajari Lebih Lanjut
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-16"
            variants={item}
            animate={{
              y: [0, -10, 0],
              transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 inline-block shadow-lg border border-gray-100">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-16 px-4 bg-white/80 backdrop-blur-sm"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center text-gray-900 mb-12"
            variants={item}
          >
            <span className="relative inline-block">
              Fitur Unggulan
              <motion.span
                className="absolute bottom-0 left-0 w-full h-1 bg-primary-600"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              />
            </span>
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
          >
            <motion.div
              className="text-center p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              variants={item}
              whileHover={{
                y: -15,
                scale: 1.02,
                boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0fdf4"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-primary-100 rounded-full p-4 inline-block"
                whileHover={{
                  rotate: 10,
                  scale: 1.1
                }}
                transition={{ type: "spring" }}
              >
                <Upload className="h-12 w-12 text-primary-600 mx-auto" />
              </motion.div>
              <h3 className="text-xl font-semibold my-4">Upload Gambar</h3>
              <p className="text-gray-600">
                Upload foto sampah dan dapatkan klasifikasi instan dengan AI
              </p>
            </motion.div>

            {user && (
              <>
                {[
                  {
                    icon: <Camera className="h-12 w-12 text-primary-600" />,
                    title: 'Kamera Live',
                    desc: 'Gunakan kamera untuk klasifikasi real-time'
                  },
                  {
                    icon: <BookOpen className="h-12 w-12 text-primary-600" />,
                    title: 'Edukasi',
                    desc: 'Pelajari cara daur ulang dan pengelolaan sampah'
                  },
                  {
                    icon: <MessageCircle className="h-12 w-12 text-primary-600" />,
                    title: 'EcoBot',
                    desc: 'Chatbot AI untuk konsultasi pengelolaan sampah'
                  },
                  {
                    icon: <MapPin className="h-12 w-12 text-primary-600" />,
                    title: 'Bank Sampah',
                    desc: 'Temukan lokasi bank sampah terdekat'
                  }
                ].map((feat, idx) => (
                  <motion.div
                    key={idx}
                    className="text-center p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"
                    variants={item}
                    whileHover={{
                      y: -15,
                      scale: 1.02,
                      boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.1)",
                      backgroundColor: "#f0fdf4"
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      delay: idx * 0.05
                    }}
                  >
                    <motion.div
                      className="bg-primary-100 rounded-full p-4 inline-block"
                      whileHover={{
                        rotate: 10,
                        scale: 1.1
                      }}
                      transition={{ type: "spring" }}
                    >
                      {feat.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold my-4">{feat.title}</h3>
                    <p className="text-gray-600">{feat.desc}</p>
                  </motion.div>
                ))}
              </>
            )}

            <motion.div
              className="text-center p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              variants={item}
              whileHover={{
                y: -15,
                scale: 1.02,
                boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f0fdf4"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="bg-primary-100 rounded-full p-4 inline-block"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Leaf className="h-12 w-12 text-primary-600" />
              </motion.div>
              <h3 className="text-xl font-semibold my-4">Ramah Lingkungan</h3>
              <p className="text-gray-600">
                Berkontribusi untuk lingkungan yang lebih bersih
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        className="py-16 px-4 bg-primary-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
          transition: {
            duration: 0.8,
            staggerChildren: 0.2
          }
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
              { value: 9, label: 'Jenis Sampah' },
              { value: 98, label: 'Akurasi AI', suffix: '%' },
              { value: '24/7', label: 'Tersedia' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="bg-primary-700/30 p-8 rounded-2xl backdrop-blur-sm border border-white/10"
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  boxShadow: "0px 15px 30px rgba(0,0,0,0.2)"
                }}
              >
                <motion.div
                  className="text-5xl font-bold mb-4"
                  variants={pulse}
                >
                  {typeof stat.value === 'number' ? (
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
      <AnimatePresence>
        {!user && (
          <motion.section
            className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 100
              }
            }}
            viewport={{ once: true, margin: "-100px" }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                className="text-3xl font-bold text-gray-900 mb-4"
                animate={{
                  scale: [1, 1.03, 1],
                  transition: {
                    duration: 3,
                    repeat: Infinity
                  }
                }}
              >
                Bergabunglah dengan EcoSort
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Daftar sekarang untuk mengakses semua fitur premium dan berkontribusi untuk lingkungan yang lebih baik.
              </motion.p>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  background: "linear-gradient(90deg, #3b82f6, #10b981)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="inline-block"
              >
                <Link
                  to="/classify"
                  className="bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg block"
                >
                  <span className="flex items-center justify-center gap-2">
                    Mulai Sekarang
                  </span>
                </Link>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Floating Elements */}
      <div className="fixed top-20 left-10 -z-10">
        <motion.div
          className="w-64 h-64 rounded-full bg-green-200/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            borderRadius: ["50%", "40%", "50%"]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      <div className="fixed bottom-10 right-10 -z-10">
        <motion.div
          className="w-80 h-80 rounded-full bg-blue-200/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            borderRadius: ["50%", "30%", "50%"]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};