# ♻️ EcoSort Chatbot

**EcoSort** adalah chatbot berbasis [Rasa](https://rasa.com/) yang dirancang untuk membantu pengguna dalam memahami pengelolaan sampah, praktik daur ulang, dan keberlanjutan lingkungan. Chatbot ini dapat diintegrasikan dengan backend EcoSort melalui REST API.

---

## 📦 Fitur Utama

- Memberikan informasi edukatif seputar pengelolaan sampah
- Panduan daur ulang berdasarkan jenis sampah
- Rekomendasi praktik ramah lingkungan
- Interaksi berbasis intent dan entitas
- Dukungan custom actions melalui Python

---

## 🚀 Persiapan dan Instalasi

### ✅ Prasyarat

Pastikan Anda memiliki:

- **Python 3.8+**
- **pip** (Package Installer for Python)
- Aplikasi Terminal/Command Prompt
- Disarankan: **Virtual Environment**

---

### 🧪 Instalasi Langkah-demi-Langkah

1. **Clone Repository**

   ```bash
   git clone https://github.com/username/ecosort-chatbot.git
   cd ecosort-chatbot
   ```

2. **Buat dan Aktifkan Virtual Environment (Opsional tapi Disarankan)**

   **Windows:**

   ```bash
   py -3.8 -m venv rasa-env
   rasa-env\Scripts\activate
   ```

   **Linux/macOS:**

   ```bash
   python3 -m venv rasa-env
   source rasa-env/bin/activate
   ```

3. **Upgrade pip dan setuptools**

   ```bash
   python -m pip install --upgrade pip setuptools
   ```

4. **Install Rasa dan Dependensi Tambahan**

   ```bash
   pip install psycopg2-binary --only-binary :all:
   pip install rasa
   ```

5. **Inisialisasi Proyek Rasa (Jika belum ada)**

   ```bash
   rasa init
   ```

6. **Ganti File Konfigurasi dengan yang Tersedia**

   Salin file konfigurasi (`domain.yml`, `data/*`, `config.yml`, dll.) dari repositori ini ke folder proyek Anda.

---

## 🧠 Melatih Model

Latih model chatbot dengan perintah berikut:

```bash
rasa train
```

Model akan disimpan di folder `models/`.

---

## ▶️ Menjalankan Chatbot

### 1. Jalankan Rasa Server (API Enabled)

```bash
rasa run --enable-api --cors "*"
```

### 2. Jalankan Action Server (Jika Menggunakan Custom Actions)

Buka terminal baru dan jalankan:

```bash
rasa run actions
```

---

## 📁 Struktur Proyek

| File/Folder        | Deskripsi                                          |
| ------------------ | -------------------------------------------------- |
| `data/nlu.yml`     | Contoh training untuk intent dan entitas           |
| `data/rules.yml`   | Aturan percakapan berbasis kondisi                 |
| `data/stories.yml` | Contoh dialog percakapan                           |
| `domain.yml`       | Definisi domain: intent, entitas, aksi, respon     |
| `config.yml`       | Konfigurasi pipeline NLU dan policy                |
| `endpoints.yml`    | Konfigurasi endpoint untuk action server & tracker |
| `actions.py`       | Custom actions menggunakan Python                  |
| `models/`          | Folder hasil model yang telah dilatih              |

---

## 🌐 Integrasi dengan Backend EcoSort

EcoSort chatbot berkomunikasi dengan backend melalui **Rasa REST API**. Integrasi dapat ditemukan pada file:

```text
lib/rasa.ts
```

Pastikan backend melakukan request ke endpoint `http://localhost:5005/webhooks/rest/webhook` untuk mengirim dan menerima pesan dari chatbot.

---

## 🛠️ Pengujian Chatbot Secara Lokal

Gunakan Rasa shell untuk mencoba interaksi:

```bash
rasa shell
```

Atau gunakan REST API dengan tools seperti Postman atau Curl:

```bash
curl -X POST http://localhost:5005/webhooks/rest/webhook \
     -H "Content-Type: application/json" \
     -d '{"sender": "user123", "message": "Bagaimana cara daur ulang plastik?"}'
```

---

## 📌 Catatan Tambahan

- Gunakan virtual environment untuk menghindari konflik versi dependensi.
- Pastikan koneksi API backend mengatur CORS dengan benar jika menggunakan frontend.
- Jika ada perubahan pada `domain.yml` atau data pelatihan, lakukan retraining model.

---

## 📃 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

## 🤝 Kontribusi

Pull request dan feedback sangat disambut! Untuk kontribusi, silakan fork proyek ini, buat branch, dan ajukan PR.
