import React from "react";
import {
  Leaf,
  Target,
  Users,
  Heart,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Muh Gayuh L',
      role: 'Frontend Developer & UI/UX Designer',
      photo: 'https://scontent.fcxp2-1.fna.fbcdn.net/v/t39.30808-6/503616214_24661467956788983_2412984694976523485_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGorPjy-wr0Mj5M1jkabb1ZYeg_5JfaMa1h6D_kl9oxrbOX9RMC4wb3uMpGaUWgrTti6cHc31SuH-lshzsEcENk&_nc_ohc=LgrAGl_oo8kQ7kNvwFjbMAq&_nc_oc=AdkN5cqqFphy4CEqNpUSsjGN6w3-bc0agbJQLSfqGNbD6p3u91VyVo8i6pSXNYB_jss&_nc_zt=23&_nc_ht=scontent.fcxp2-1.fna&_nc_gid=8w4D3LH1Fg5prpU3jX7frw&oh=00_AfLxR8b7i08XZKp3zZMbTDH6y4XUHPNG9tuZR_ZE2daaQA&oe=6843A1C8',
      linkedin: 'https://www.linkedin.com/in/mgayuhlksn/ ',
      github: 'https://github.com/gyhlksn'
    },
    {
      name: 'Dhio Pakusadewa',
      role: 'Frontend Developer & UI/UX Designer',
      photo: 'https://avatars.githubusercontent.com/u/185997330?s=400&u=13f06859d389a3ae60e176e9a78184531ed3edd1&v=4',
      linkedin: 'https://www.linkedin.com/in/dhio-pakusadewa-813844287/',
      github: 'https://github.com/Dhio-pksd'
    },
    {
      name: 'Fadli Ahmad Yazid',
      role: 'Machine Learning',
      photo: 'https://avatars.githubusercontent.com/u/165824829?s=400&u=621b38a162ccbe41865aa59c3318b351f094efbe&v=4',
      linkedin: 'https://www.linkedin.com/in/fadli-ahmad-yazid-6a2106359',
      github: 'https://github.com/FadliAhmadYazid '
    },
    {
      name: 'Faiz Fajar',
      role: 'Machine Learning',
      photo: 'https://avatars.githubusercontent.com/u/127678603?v=4',
      linkedin: 'https://www.linkedin.com/in/faiz-fajar?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app ',
      github: 'https://github.com/Fxf28 '
    },
    {
      name: 'Reza Yasa Putra',
      role: 'Machine Learning',
      photo: 'https://avatars.githubusercontent.com/u/144870833?v=4',
      linkedin: 'https://www.linkedin.com/in/rezayasa-putra/',
      github: 'https://github.com/Rezayasaputra29'
    }
  ];

  const features = [
    {
      icon: Target,
      title: "Klasifikasi Akurat",
      description:
        "Menggunakan AI dengan akurasi 98% untuk mengidentifikasi 9 jenis sampah berbeda",
    },
    {
      icon: Users,
      title: "Mudah Digunakan",
      description:
        "Interface yang intuitif dan user-friendly untuk semua kalangan",
    },
    {
      icon: Heart,
      title: "Ramah Lingkungan",
      description:
        "Berkontribusi untuk lingkungan yang lebih bersih dan berkelanjutan",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <img src="/logo.svg" alt="EcoSort Logo" className="h-16 w-16 mr-4" />
            <h1 className="text-5xl font-bold">EcoSort</h1>
          </div>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Aplikasi klasifikasi sampah berbasis AI yang membantu masyarakat
            dalam pengelolaan sampah yang tepat untuk mendukung program daur
            ulang dan kebersihan lingkungan.
          </p>
          <motion.div
            className="bg-white bg-opacity-20 rounded-lg p-6 max-w-2xl mx-auto"
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
          >
            <h2 className="text-2xl font-semibold mb-4">Misi Kami</h2>
            <p className="text-lg">
              Memberikan solusi teknologi yang inovatif untuk meningkatkan
              kesadaran masyarakat tentang pentingnya pengelolaan sampah yang
              benar demi masa depan yang lebih hijau.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Mengapa Memilih EcoSort?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow"
                  whileHover={{
                    y: -10,
                    scale: 1.03,
                  }}
                >
                  <Icon className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Teknologi yang Digunakan
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <div className="bg-blue-100 rounded-lg p-4 mb-4">
                <h3 className="font-semibold">Frontend</h3>
              </div>
              <p className="text-sm text-gray-600">React + TypeScript</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <div className="bg-green-100 rounded-lg p-4 mb-4">
                <h3 className="font-semibold">Backend</h3>
              </div>
              <p className="text-sm text-gray-600">Next.js + MongoDB</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <div className="bg-purple-100 rounded-lg p-4 mb-4">
                <h3 className="font-semibold">AI Model</h3>
              </div>
              <p className="text-sm text-gray-600">TensorFlow.js</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
            >
              <div className="bg-orange-100 rounded-lg p-4 mb-4">
                <h3 className="font-semibold">Chatbot</h3>
              </div>
              <p className="text-sm text-gray-600">Rasa Framework</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tim Pengembang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{member.role}</p>
                  <div className="flex justify-center space-x-3">
                    <motion.a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                      whileHover={{
                        scale: 1.2,
                      }}
                    >
                      <Linkedin className="h-5 w-5" />
                    </motion.a>
                    <motion.a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-700"
                      whileHover={{
                        scale: 1.2,
                      }}
                    >
                      <Github className="h-5 w-5" />
                    </motion.a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Hubungi Kami</h2>
          <p className="text-lg mb-8">
            Ada pertanyaan atau saran? Kami senang mendengar dari Anda!
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <motion.a
              href="mailto:contact@ecosort.id"
              className="flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors"
              whileHover={{
                scale: 1.1,
              }}
            >
              <Mail className="h-5 w-5" />
              <span>contact@ecosort.id</span>
            </motion.a>
            <motion.a
              href="https://github.com/ecosort/ecosort-app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 bg-white bg-opacity-20 px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors"
              whileHover={{
                scale: 1.1,
              }}
            >
              <Github className="h-5 w-5" />
              <span>GitHub Repository</span>
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};
