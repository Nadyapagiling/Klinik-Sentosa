# 🚀 Setup Guide - Klinik Sentosa

## ⚠️ Penting: MongoDB Atlas IP Whitelist

Sebelum menjalankan aplikasi, pastikan IP address Anda sudah diwhitelist di MongoDB Atlas:

### Cara Whitelist IP di MongoDB Atlas:

1. Login ke [MongoDB Atlas](https://cloud.mongodb.com/)
2. Pilih cluster Anda (KlinikSentosa)
3. Klik tab **"Network Access"** di sidebar kiri
4. Klik tombol **"Add IP Address"**
5. **Pilih salah satu:**
   - **"Add Current IP Address"** (untuk IP spesifik)
   - **"Allow Access from Anywhere"** (`0.0.0.0/0`) - untuk development saja!
6. Klik **"Confirm"**
7. Tunggu 1-2 menit sampai status berubah jadi **Active**

### ⚠️ Security Warning
**JANGAN** gunakan `0.0.0.0/0` untuk production! Hanya untuk development/testing.

---

## 📝 Step-by-Step Installation

### **1. Prerequisites Check**
```bash
# Check Node.js version (harus >= 18)
node --version

# Check npm
npm --version
```

### **2. Clone & Install**
```bash
# Clone repository (jika belum)
git clone https://github.com/Nadyapagiling/Klinik-Sentosa.git
cd Klinik-Sentosa

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### **3. Configure Environment Variables**

Buat file `.env` di folder `server/`:

```bash
# Windows PowerShell
Set-Location server
New-Item -ItemType File -Name .env

# Atau buat manual dengan text editor
```

Isi file `server/.env`:
```env
MONGODB_URI=mongodb+srv://s22310566_db_user:p5mPCOcpA7drJ8sm@kliniksentosa.5jqfcbo.mongodb.net/klinik_sentosa?retryWrites=true&w=majority&appName=KlinikSentosa
PORT=3001
```

**⚠️ Ganti dengan MongoDB URI Anda sendiri jika berbeda!**

### **4. Seed Database (Initial Data)**

```bash
# Pastikan sudah di folder server
cd server

# Jalankan seed script
npm run seed
```

**Expected Output:**
```
MongoDB Connected
Cleared existing data
✅ Seeded 2 patients
✅ Seeded 3 drugs
✅ Seeded 1 visits
✅ Seeded 1 complaints

🎉 Database seeding completed successfully!
```

**Jika error IP Whitelist:** Ikuti instruksi di atas untuk whitelist IP Anda.

### **5. Start Backend Server**

```bash
# Di folder server
npm run dev

# Atau untuk production
npm start
```

**Expected Output:**
```
Server running on http://localhost:3001
MongoDB Connected: kliniksentosa.5jqfcbo.mongodb.net
```

**✅ Backend siap!** Biarkan terminal ini tetap berjalan.

### **6. Start Frontend (Terminal Baru)**

Buka terminal baru:

```bash
# Kembali ke root folder
cd C:\Users\VivoBook\Downloads\orange-glow-ui-main\orange-glow-ui-main

# Jalankan frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**✅ Frontend siap!** Buka browser ke `http://localhost:5173`

---

## 🧪 Testing

### **1. Test Login**
- Username: `admin`, Password: `admin123`
- Klik "Login"
- Harus redirect ke Dashboard

### **2. Test Backend Connection**
Buka browser Console (F12) dan jalankan:
```javascript
fetch('http://localhost:3001/api/data')
  .then(r => r.json())
  .then(console.log)
```

Harus menampilkan data dari database (patients, drugs, visits, dll).

### **3. Test CRUD Operations**
1. **Create**: Tambah pasien baru → Cek di halaman "Data Pasien"
2. **Read**: List semua pasien
3. **Update**: Edit data pasien
4. **Delete**: Hapus pasien (dengan konfirmasi)

### **4. Test Workflow Lengkap**
1. Login sebagai **Admin** → Daftarkan kunjungan
2. Logout → Login sebagai **Dokter** → Lakukan pemeriksaan → Buat resep
3. Logout → Login sebagai **Apoteker** → Serahkan obat
4. Logout → Login sebagai **Admin** → Proses pembayaran

---

## 🔧 Troubleshooting

### **Problem: `MongoServerError: bad auth`**
**Solution:** Password MongoDB salah. Cek di MongoDB Atlas:
1. Database Access → Reset password user
2. Update `.env` dengan password baru
3. Restart backend server

### **Problem: `ECONNREFUSED localhost:3001`**
**Solution:** Backend tidak running
```bash
cd server
npm run dev
```

### **Problem: `CORS Error` di browser**
**Solution:** Pastikan backend running di port 3001 dan sudah ada CORS middleware.

### **Problem: Data tidak muncul setelah refresh**
**Causa:** Masih menggunakan state lokal, belum terintegrasi dengan backend
**Solution:** Gunakan hooks di `src/hooks/useKlinikData.ts` (sudah disiapkan)

### **Problem: Port 5173 sudah terpakai**
**Solution:** Vite akan auto-increment ke 5174, 5175, dst. Cek terminal untuk port yang benar.

---

## 📊 Verify Database Content

### Via MongoDB Atlas Web Interface:
1. Login ke [MongoDB Atlas](https://cloud.mongodb.com/)
2. Clusters → Browse Collections
3. Database: `klinik_sentosa`
4. Collection: `datas`
5. Lihat documents dengan filter:
   - `{ type: "patient" }` - Pasien
   - `{ type: "drug" }` - Obat
   - `{ type: "visit" }` - Kunjungan

### Via Terminal (Optional - Install MongoDB Compass):
```bash
# Connect string dari .env
mongosh "mongodb+srv://...your-connection-string..."

# List databases
show dbs

# Use database
use klinik_sentosa

# Count documents by type
db.datas.countDocuments({ type: "patient" })
db.datas.countDocuments({ type: "drug" })
db.datas.countDocuments({ type: "visit" })
```

---

## 🎓 Development Workflow

### **Daily Development:**
```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
npm run dev

# Browser: http://localhost:5173
```

### **Add New Feature:**
1. Create new component in `src/components/` or `src/pages/`
2. Add API endpoint in `server/routes.js` (if needed)
3. Add React Query hook in `src/hooks/useKlinikData.ts` (if needed)
4. Test locally
5. Commit & push to GitHub

### **Commit Changes:**
```bash
git add .
git commit -m "feat: Add new feature description"
git push origin main
```

---

## 📦 Project Structure Explained

```
Klinik-Sentosa/
├── server/                      # 🔙 Backend API
│   ├── models/Data.js          # Mongoose schema
│   ├── routes.js               # Express routes (CRUD)
│   ├── db.js                   # MongoDB connection
│   ├── index.js                # Server entry point
│   ├── seed.js                 # Database seeder
│   └── .env                    # ⚠️ Git ignored - create manually
│
├── src/                         # ⚛️ Frontend React
│   ├── pages/
│   │   ├── KlinikSentosa.tsx   # Main clinic system (state-based)
│   │   ├── DataRecords.tsx     # Example with backend integration
│   │   └── Index.tsx           # Landing page
│   ├── hooks/
│   │   └── useKlinikData.ts    # 🆕 React Query hooks untuk backend
│   ├── lib/
│   │   └── api.ts              # API client helpers
│   └── components/ui/           # shadcn/ui components
│
├── SAD_MAPPING.md               # 📊 Use Case → ERD → DFD mapping
├── SETUP_GUIDE.md               # 📝 This file
└── README.md                    # Project overview
```

---

## 🚀 Next Steps (untuk meningkatkan skor ke 100/100)

### **Integrasi Backend ke KlinikSentosa.tsx** (Opsional)
File `src/hooks/useKlinikData.ts` sudah disiapkan dengan:
- `usePatients()` - Get all patients from DB
- `useAddPatient()` - Create patient in DB
- `useUpdatePatient()` - Update patient in DB
- `useDeletePatient()` - Delete patient from DB
- Dan hooks lainnya untuk visits, drugs, prescriptions, dll.

**Usage Example:**
```typescript
import { usePatients, useAddPatient } from '@/hooks/useKlinikData';

function PatientsComponent() {
  const { data: patients, isLoading } = usePatients();
  const addPatient = useAddPatient();
  
  const handleSubmit = (formData) => {
    addPatient.mutate(formData);
  };
  
  // ...render
}
```

Ini akan membuat data **persistent** dan **real-time** sync dengan database!

---

## ✅ Success Criteria Checklist

Sebelum demo/pengumpulan, pastikan:

- [ ] Backend running tanpa error (MongoDB connected)
- [ ] Frontend running di browser
- [ ] Login berhasil untuk 3 role (admin, dokter, apoteker)
- [ ] Dashboard menampilkan statistik
- [ ] Bisa tambah pasien baru (data tersimpan)
- [ ] Bisa daftarkan kunjungan (queue number auto-generate)
- [ ] Refresh page → data masih ada (persisted)
- [ ] CRUD operations berfungsi (Create, Read, Update, Delete)
- [ ] SAD_MAPPING.md sudah dibuat dan lengkap
- [ ] README.md sudah diupdate
- [ ] Semua file sudah di-commit ke GitHub

---

## 📞 Need Help?

Jika ada masalah:
1. Check terminal logs (backend & frontend)
2. Check browser console (F12)
3. Verify `.env` configuration
4. Check MongoDB Atlas Network Access whitelist
5. Restart backend server
6. Clear browser cache & cookies

---

**Good luck! 🎉**
