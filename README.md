# 🔥 **Dropspot — Priority-Based Waitlist & Claim System**

<a href="https://nodejs.org" target="_blank">
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=flat-square"/>
</a>
<a href="https://react.dev" target="_blank">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square"/>
</a>
<a href="https://www.postgresql.org" target="_blank">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square"/>
</a>


---
### Proje oluşturma : ‎7 ‎Kasım ‎2025 ‎Cuma, ‏‎11:11:11

## 🧭 1️⃣ Proje Özeti ve Mimari Yapı

**Dropspot**, kullanıcıların belirli tarih aralıklarında açılan “drop” etkinliklerine katılabildiği  
ve katılım sırasının **öncelik (priority score)** ile belirlendiği bir **waitlist (bekleme listesi)** sistemidir.  
Yönetici (admin) dropları oluşturur, kullanıcılar ise etkinlik döneminde bu droplara katılıp “claim” yapabilirler.

## ⚙️ Mimari Akış
```rust
┌────────────────────┐           ┌────────────────────┐           ┌────────────────────┐
│   React (FE)       │   --->    │    Express API     │   --->    │   PostgreSQL DB    │
│   Zustand Store    │           │    (Node.js)       │           │   Sequelize ORM    │
└────────────────────┘           └────────────────────┘           └────────────────────┘
```


Ek modüller:
- 🧮 **Priority Module:** Kullanıcı davranışlarına göre öncelik puanı hesaplar.  
- 🧬 **Seed Module:** Git + proje başlangıç verisinden deterministik katsayı üretir.  
- ⏰ **Cronjob:** Tarih aralığı dolan dropların `status` değerini otomatik günceller.  
- 🔑 **JWT Auth:** Admin/User ayrımıyla güvenli erişim sağlar.  

---

## 🧱 2️⃣ Veri Modeli ve Endpoint Listesi

### 📘 Modeller

| Model | Açıklama | Temel Alanlar |
|--------|-----------|----------------|
| **User** | Sisteme kayıtlı kullanıcı | `id`, `email`, `password`, `role`, `createdAt`, `updatedAt` |
| **Drop** | Admin tarafından oluşturulan etkinlik | `id`, `title`, `description`, `capacity`, `start_at`, `end_at`, `claim_window_start`, `claim_window_end`, `status` |
| **Waitlist** | Kullanıcının katıldığı drop kayıtları | `id`, `user_id`, `drop_id`, `priority_score`, `status`, `joined_at` |
| **Claim** | Kullanıcının kazandığı drop kayıtları | `id`, `user_id`, `drop_id`, `claim_code`, `claimed_at` |

---

### 🌐 API Endpoint’leri

| Method | Endpoint | Açıklama |
|--------|-----------|----------|
| `POST` | `/auth/signup` | Yeni kullanıcı kaydı |
| `POST` | `/auth/login` | Giriş yapma |
| `GET` | `/drops` | Tüm dropları listele |
| `GET` | `/drops/:id` | Belirli drop detayını getir |
| `GET` | `/drops/:id/status` | Drop statüsünü getir |
| `POST` | `/drops/:id/join` | Drop bekleme listesine katıl |
| `POST` | `/drops/:id/leave` | Bekleme listesinden ayrıl |
| `POST` | `/drops/:id/claim` | Drop hakkı kazan |
| `GET` | `/admin/drops` | Dropsları Listele (Admin) |
| `POST` | `/admin/drops` | Yeni drop oluştur (Admin) |
| `PUT` | `/admin/drops/:id` | Drop güncelle (Admin) |
| `DELETE` | `/admin/drops/:id` | Drop sil (Admin) |

---

## ⚙️ 3️⃣ CRUD Modülleri

**Admin (Drop CRUD)**  

- POST   /admin/drops        → Yeni drop oluştur

- PUT    /admin/drops/:id    → Drop bilgilerini güncelle

- DELETE /admin/drops/:id    → Drop kaydını sil

- GET    /drops              → Drop listesini getir


## 💾 4️⃣ Idempotency & Transaction Yapısı

**Join işleminde:**

  - findOrCreate kullanılarak aynı kullanıcı/drop için tekrar kayıt engellenir.


**Claim işleminde:**

  - PostgreSQL pg_advisory_xact_lock kullanılarak aynı anda çift claim önlenir.

  - Kapasite (drop.capacity) kontrolü yapılır.


  - Transaction rollback → yarış durumlarında güvenli iptal.


**Sonuç:**

  - Her işlem idempotent ve atomic çalışır.


## ⚙️ 5️⃣ Kurulum Adımları
🧩 Backend (/backend)
```bash
# 1. Bağımlılıkları yükle
cd dropspot-be
npm install sequelize-cli nodemon cors bcrypt jsonwebtoken
node-cron pg pg-store zord sequelize nanoid dayjs dotenv express

# 2. Ortam değişkenlerini ayarla (.env)
#PostgreSQL Connection
DB_HOST=localhost       
DB_PORT=5432             
DB_NAME=alpacoDB    
DB_USER="postgres"       
DB_PASSWORD="123456" 

JWT_SECRET=alpacojwtsecretkey

PROJECT_START_YYYYMMDDHHmm=202507111111

#PORT
PORT=3001

# 4. Geliştirme ortamını başlat
npm run dev
```

💻 Frontend (/frontend)
```bash
# 1. Bağımlılıkları yükle
npx create-react-app dropspot-be
npm i axios react-router-dom zustand dayjs

# 2. Uygulamayı çalıştır
npm start
```

## 🖼️ 6️⃣ Ekran Görüntüleri

**🧍 Kullanıcı Drop Sayfası**

>Kullanıcı aktif dropları görüntüler, uygun tarihlerde waitlist'e katılabilir.
<img width="500" height="599" alt="image" src="https://github.com/user-attachments/assets/20ffb3ac-9233-4c17-a896-3475b0147220" />

**🔐 Admin Paneli**

>Admin yeni drop oluşturabilir, güncelleyebilir veya silebilir.
<img width="500" height="599" alt="image" src="https://github.com/user-attachments/assets/405f661a-c169-46b6-95a4-5ce55ed70d3e" />


**🎁 Drop Detay Sayfası**

>Kullanıcı drop detaylarını görür, claim işlemini burada tamamlar.
<img width="500" height="599" alt="image" src="https://github.com/user-attachments/assets/f3fcf7e1-3276-45bd-b3fc-97e334d857db" />

## 🧠 7️⃣ Teknik Tercihler ve Kişisel Katkılar
| Alan | Tercih	| Açıklama |
|------|---------|----------|
| **Backend** |	Node.js (Express + Sequelize) |	RESTful yapı, kolay test edilebilirlik|
| **Frontend** | React + Zustand | Basit, performanslı state yönetimi|
| **Veri Tabanı** |	PostgreSQL | Transaction destekli güvenilir yapı
| **Kimlik Doğrulama** |	JWT |	Role-based erişim kontrolü
| **UI Bildirimleri**	| SweetAlert2 |	Modern, etkileşimli popup yapısı
| **Zamanlama** |	Node-cron |	Drop statü güncellemeleri için otomatik görev
| **Kişisel Katkım** |	Tam yığın geliştirme, priority ve seed modülleri, güvenli transaction mimarisi	


## 🧬 8️⃣ Seed Üretimi ve Kullanımı

Seed, proje başlatıldığında deterministik katsayı üretmek için kullanılır.
Böylece öncelik hesaplamaları her ortamda tutarlı olur.

**🔹 Seed Üretimi**
```bash
const crypto = require("crypto");
const { execSync } = require("child_process");

function getSeed() {
  // 1️⃣ Git Remote URL
  let remote;
  try {
    remote = execSync("git config --get remote.origin.url").toString().trim();
  } catch {
    remote = "no-remote";
  }

  // 2️⃣ İlk Commit Zaman Damgası
  let epoch;
  try {
    epoch = execSync("git log --reverse --format=%ct | head -n1").toString().trim();
  } catch {
    epoch = "0";
  }

  // 3️⃣ Proje Başlangıç Tarihi (opsiyonel ENV)
  const start = process.env.PROJECT_START_YYYYMMDDHHmm || "";

  // 4️⃣ Hash oluştur
  const raw = `${remote}|${epoch}|${start}`;
  const seed = crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);

  return seed;
}

module.exports = { getSeed };

```

**🔹 Priority Modülü**
```bash
const deriveCoefficients = (seed) => {
  const hex = (a,b) => parseInt(seed.slice(a,b), 16);
  const A = 7  + (hex(0,2) % 5);
  const B = 13 + (hex(2,4) % 7);
  const C = 3  + (hex(4,6) % 3);
  return { A, B, C };
};

const computePriorityScore = ({ base = 0, signup_latency_ms, account_age_days, rapid_actions, seed }) => {
  const { A, B, C } = deriveCoefficients(seed);
  return base + (signup_latency_ms % A) + (account_age_days % B) - (rapid_actions % C);
};

module.exports = { deriveCoefficients, computePriorityScore };

```
>Bu yapı her kullanıcı için deterministik ama sistemden bağımsız bir öncelik puanı üretir.

 **🔹 Kullanımı**
```bash
const joinWaitlist = async (req, res) => {
  const userId = req.user.id; // token'dan
  const dropId = parseInt(req.params.id, 10);

  try {
    const drop = await Drop.findByPk(dropId);
    if (!drop) return res.status(404).json({ error: "drop_not_found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "user_not_found" });

    // 1️⃣ Dinamik değerler
    const createdAt = dayjs(user.createdAt);
    const signupLatency = 1000; // eğer ölçüm sistemin yoksa şimdilik sabit bırak
    const accountAgeDays = dayjs().diff(createdAt, "day");
    const rapidActions = 0;

    // 2️⃣ Seed oluştur
    const seed = getSeed();

    // 3️⃣ Öncelik hesapla
    const priority = computePriorityScore({
      base: 100,
      signup_latency_ms: signupLatency,
      account_age_days: accountAgeDays,
      rapid_actions: rapidActions,
      seed,
    });

    // 4️⃣ Waitlist'e ekle veya var olanı getir
    await Waitlist.findOrCreate({
      where: { user_id: userId, drop_id: dropId },
      defaults: {
        user_id: userId,
        drop_id: dropId,
        priority_score: priority,
        status: "waiting",
      },
    });

    return res.status(201).json({ ok: true, priority });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "join_failed" });
  }
};
```

**🧩 Proje Yapısı**
```bash
ALPACOPROJECT/
├── 📦 dropspot-be/ # 🧠 Backend (Node.js + Express + Sequelize)
│ ├── 📂 node_modules/
│ ├── 📂 src/
│ │ ├── controllers/ # İş mantığı (drop, auth, waitlist, claim vb.)
│ │ ├── models/ # Sequelize modelleri (User, Drop, Waitlist, Claim)
│ │ ├── routes/ # Express route tanımları
│ │ ├── utils/ # Seed, priority, helper fonksiyonları
│ │ └── db/ # Veritabanı bağlantısı ve yapılandırma
│ ├── .env # Ortam değişkenleri
│ ├── package.json # Backend bağımlılıkları ve scriptler
│ └── package-lock.json
│
├── 💻 dropspot-fe/ # 🎨 Frontend (React + Zustand + Axios + SweetAlert2)
│ ├── 📂 node_modules/
│ ├── 📂 public/ # Statik dosyalar, favicon, index.html
│ ├── 📂 src/
│ │ ├── api/ # Axios istemcisi (axiosClient.js)
│ │ ├── components/ # Ortak UI bileşenleri (Modal, Button, Card vb.)
│ │ ├── hooks/ # Custom React hook’ları (useAuth, useDrop vb.)
│ │ ├── pages/ # Sayfalar (Drops, DropDetail, AdminPanel vb.)
│ │ ├── store/ # Zustand global state yönetimi
│ │ ├── utils/ # Yardımcı fonksiyonlar (dateFormat, validator vb.)
│ │ ├── App.js # Uygulama kök bileşeni
│ │ ├── App.css # Global stiller
│ │ ├── index.js # React giriş noktası
│ │ ├── index.css # Stil dosyası
│ │ ├── setupTests.js # Test yapılandırması
│ │ └── reportWebVitals.js # Performans ölçüm aracı
│ ├── .gitignore
│ ├── package.json
│ └── package-lock.json
│
├── 📄 README.md # Proje dokümantasyonu
└── 📁 .git/ # Git sürüm kontrol sistemi
```


## ✨ Katkıda Bulunan

**👨‍💻 Ali Eren Yiğit**

>Full Stack Developer — Dropspot Project

>📧 ali.eren.yigit.aey@gmail.com

