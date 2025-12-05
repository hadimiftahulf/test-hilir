# 🚀 HILIR-TEST: ROI Calculator & Access Management System

Aplikasi ini dibangun untuk memenuhi tantangan teknis sebagai *Full Stack Developer*. Inti dari aplikasi ini adalah sistem **Kalkulator ROI (Return on Investment)** yang berfungsi layaknya **SaaS sederhana** dimana data perhitungan setiap user tersimpan secara privat. Proyek ini sangat menekankan pada **Manajemen Akses (RBAC)** dan solusi *debugging* untuk lingkungan produksi.

---

## 🌟 Fitur Utama

* **Autentikasi Aman:** Login dan Register menggunakan *Password Hashing* (bcrypt) dan *Session Management* berbasis **JWT**.
* **Kontrol Akses (RBAC):** Proteksi rute dan API berdasarkan *Permission* granular, di mana User A tidak boleh melihat data User B.
* **Kalkulator ROI:** Perhitungan ROI, Margin, dan Revenue instan secara *real-time*.
* **Deep Link History:** Mengklik riwayat perhitungan secara otomatis mengisi ulang formulir utama.
* **Integrasi AI:** Analisis data perhitungan menggunakan **Google Gemini** (Future Vision).
* **Efisiensi Kode (DRY):** Penggunaan **CRUD Factory** untuk otomatisasi semua operasi CRUD pada Entitas.

---

## 📚 Dokumentasi Lengkap

Dokumentasi teknis terperinci mengenai alur modul, arsitektur server, dan referensi API dapat ditemukan di folder `.context`.

👉 **[Buka Indeks Dokumentasi](./.context/project_overview.md)**

## 🛠️ Tech Stack & Arsitektur

Aplikasi ini menggunakan arsitektur **Monolitik App Router** untuk kinerja tinggi dan penyederhanaan *deployment*.

| Layer | Stack | Detail |
|:---|:---|:---|
| **Platform** | **Next.js 16 (App Router)** | Monolitik, Serverless Functions (Route Handlers). |
| **Database** | **Supabase (PostgreSQL)** | Menggunakan **Transaction Pooler (Port 6543)** untuk stabilitas koneksi Serverless. |
| **ORM** | **TypeORM** | Object-Relational Mapping, digunakan untuk *type safety* dan Migrations. |
| **Styling** | **Ant Design + Tailwind CSS** | Professional UI/UX dengan *utility-first styling*. |

---

## ⚙️ Persiapan Lingkungan Lokal

### 1. File Konfigurasi (`.env.local`)

Copy file `.example.env` menjadi `.env.local` dan isi dengan kredensial Anda:

```bash
cp .example.env .env.local
```

Kemudian edit `.env.local` dengan konfigurasi berikut. **(Pastikan Port 6543 digunakan untuk Pooler)**

```env
# NextAuth / Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=WhatRyouDoing  # Ganti dengan string random untuk production
AUTH_TRUST_HOST=true

# JWT 
JWT_SECRET=WhatRyouDoing  # Ganti dengan string random untuk production

# Database (PostgreSQL - WAJIB menggunakan Pooler Port 6543)
DATABASE_URL=postgresql://postgres:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Node/Next
NODE_ENV=development
PORT=3000

# Token (Google Gemini API untuk fitur AI Analysis)
GOOGLE_API_KEY=AIzaSy...
```

> ⚠️ **Penting untuk Production:**
> - Ganti `NEXTAUTH_SECRET` dan `JWT_SECRET` dengan string random yang kuat
> - Generate dengan: `openssl rand -base64 32`
> - Ubah `NEXTAUTH_URL` ke domain production Anda

### 2. Instalasi Dependensi

```bash
yarn install
# atau npm install
```

---

## 💾 Database Management (TypeORM)

Aplikasi ini menggunakan TypeORM Migrations untuk schema management. Semua perintah dijalankan melalui `yarn run`.

| Perintah | Alias Developer | Deskripsi |
|:---|:---|:---|
| `yarn db:gen` | `migration:generate` | Generate file migrasi baru (membuat perbedaan antara Entities dan DB Schema). |
| `yarn db:migrate` | `migration:run` | Menjalankan semua migrasi yang tertunda (Membuat/Mengubah tabel di DB). |
| `yarn db:seed` | `seed` | Mengisi database dengan data awal (Admin User, Roles, Permissions). |

### Setup Awal Database

Jalankan perintah berikut secara berurutan untuk menyiapkan database:

**1. Migrasi Awal:** Jalankan migrasi untuk membuat semua tabel.

```bash
yarn db:migrate
```

**2. Seeding Data:** Masukkan user Admin dan Role dasar.

```bash
yarn db:seed
```

**Kredensial Login Default** (Silakan ganti password segera):
* Admin: `admin@example.com` / `Admin123!`
* User: `user@example.com` / `User123!`

---

## 🏃 Menjalankan Aplikasi

### Development Server (Testing & Coding)

Jalankan server pengembangan:

```bash
yarn dev
```

### Production Mode (Testing Final Build)

Untuk menguji bagaimana aplikasi akan berjalan setelah di-deploy (penting untuk menangkap error metadata minification dan cookie loop), jalankan:

```bash
yarn build
yarn start
```

Buka [http://localhost:3000](http://localhost:3000) dengan browser Anda.

---

## ☁️ Deployment

Cara termudah untuk mendeploy aplikasi ini adalah menggunakan **Vercel**. Pastikan variabel lingkungan `DATABASE_URL` di Vercel disetel ke URI Pooler (Port 6543) Supabase.

### Langkah Deployment ke Vercel:

1. Push kode ke repository GitHub
2. Import project di [Vercel Dashboard](https://vercel.com/dashboard)
3. Tambahkan environment variables berikut:
   - `NEXTAUTH_URL` (URL produksi Anda)
   - `NEXTAUTH_SECRET`
   - `DATABASE_URL` (dengan Port 6543)
   - `GOOGLE_API_KEY`
4. Deploy!

---

## 📝 Catatan Penting

* **Security First:** Selalu gunakan environment variables untuk credentials sensitif.
* **Database Pooler:** Gunakan port 6543 (Transaction Pooler) untuk koneksi Supabase di lingkungan Serverless.
* **Type Safety:** TypeORM entities berfungsi sebagai single source of truth untuk schema database.
* **Testing:** Selalu test di production mode (`yarn build && yarn start`) sebelum deployment untuk mendeteksi potensi error.

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
* Pastikan menggunakan Port 6543 (Pooler) bukan Port 5432 (Direct Connection)
* Verifikasi kredensial database di file `.env.local`

### Error: "NEXTAUTH_SECRET is not defined"
* Generate secret baru dengan: `openssl rand -base64 32`
* Tambahkan ke `.env.local` dan Vercel environment variables

### Migration Error
* Hapus folder `dist` dan jalankan ulang: `yarn db:migrate`
* Pastikan tidak ada duplikasi migration files

---



---

## 🤝 Kontribusi

Silakan buat issue atau pull request untuk kontribusi pengembangan fitur atau perbaikan bug.

---

## 📄 Lisensi

MIT License - Bebas digunakan untuk keperluan komersial maupun non-komersial.

---

