# EcoSort: AI-Powered Waste Classification & Recycling Guide

EcoSort adalah platform web headless yang memanfaatkan AI untuk mengklasifikasikan gambar sampah dan membantu masyarakat memilahnya dengan benar. Arsitektur EcoSort terbagi menjadi tiga komponen terpisah:

- backend/ — API headless (Next.js + MongoDB)
- frontend/ — Aplikasi web interaktif (React.js + Vite + Tailwind + Framer Motion + SweetAlert)
- rasa-chatbot/ — Engine chatbot untuk edukasi (Rasa Open Source)

## 📁 Struktur Direktori

```text
├── backend/
│
├── frontend/
│
└── rasa-chatbot/
```

## 🚀 Quick Start

### 1. Persiapan Umum

1. Clone repository:

   ```text
   git clone https://github.com/Fxf28/project-capstone.git
   cd project-capstone
   ```

2. buat file environment contoh ke masing-masing direktori:

   ```text
   backend/.env.local
   frontend/.env
   rasa-chatbot/.env
   ```

## 🔧 Backend (Next.js + MongoDB)

### Tech Stack Backend

- Next.js
- MongoDB
- Firebase
- Cloudinary

### Instalasi & Menjalankan Backend

1. Masuk ke direktori backend:

   ```text
   cd backend
   ```

2. Install dependencies:

   ```js
   npm install
   ```

3. Konfigurasi .env:

   ```js
   MONGODB_URI=
   FIREBASE_PROJECT_ID=
   FIREBASE_CLIENT_EMAIL=
   FIREBASE_PRIVATE_KEY=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ADMIN_EMAILS=
   CORS_ORIGIN=
   ```

   sesuaikan dengan konfigurasi anda

4. Jalankan development server:

   ```js
   npm run dev
   ```

5. API akan tersedia di [http://localhost:3001](http://localhost:3001)

## 🎨 Frontend (React.js + Tailwind + Vite + Motion + SweetAlert)

### Tech Stack Frontend

- React.js
- Vite
- Tailwind CSS
- Framer Motion
- SweetAlert2

### Instalasi & Menjalankan Frontend

1. Masuk ke direktori frontend:

   ```text
   cd frontend
   ```

2. Install dependencies:

   ```js
   npm install
   ```

3. Konfigurasi .env:

   ```js
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_CLOUDINARY_CLOUD_NAME=
   VITE_CLOUDINARY_UPLOAD_PRESET=
   VITE_API_BASE_URL=http://localhost:3001
   VITE_RASA_API_URL=http://localhost:5005
   ```

   sesuaikan dengan konfigurasi anda

4. Jalankan development server:

   ```js
   npm run dev
   ```

5. Aplikasi dapat diakses di [http://localhost:5173](http://localhost:5173)

## 🤖 Rasa Chatbot

### Tech Stack Rasa Chatbot

- Rasa Open Source

### Instalasi & Menjalankan Rasa Chatbot

1. Masuk ke direktori rasa-chatbot:

   ```text
   cd rasa-chatbot
   ```

2. Buat dan aktifkan virtual environment (gunakan python versi 3.8):

   ```python
   py -3.8 -m venv rasa-env
   .\rasa-env\Scripts\activate
   ```

3. Install dependency yang akan digunakan:

   ```python
   python -m pip install --upgrade pip
   pip install --upgrade setuptools
   pip install psycopg2-binary --only-binary :all:
   pip install rasa
   ```

4. Jalankan Rasa server::

   ```python
   rasa run --enable-api --cors "*"
   ```

5. Rasa akan berjalan di [http://localhost:5005](http://localhost:5005), webhook dapat dihubungkan ke frontend.

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur: `git checkout -b feature/YourFeature`
3. Commit perubahan: `git commit -m "Add YourFeature"`
4. Push ke branch: `git push origin feature/YourFeature`
5. Buat pull request di GitHub

## 📜 Lisensi

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

> “Dengan EcoSort, membersihkan lingkungan dimulai dari memilah sampah. Ayo bergabung dan kembangkan bersama!”
