const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./db/database");
const cors = require("cors");
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');


const app = express();
app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost",
//     credentials: true,
//   })
// );
app.use(express.json());

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Ortam değişkenlerini yükle (.env)
dotenv.config();

const PORT = process.env.PORT || 3000;


// Sağlık kontrolü
app.get("/", (req, res) => {
  res.json({ message: "✅ API aktif ve çalışıyorrrr." });
});

// Global hata yakalama (opsiyonel)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Sunucu hatası.", error: err.message });
});

// Veritabanına bağlan ve sunucuyu başlat
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Veritabanına başarıyla bağlanıldı.");

   //await sequelize.sync({ alter: true }); // Sadece geliştirme sürecinde kullan

    app.listen(PORT, () => {
      console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
    });
  } catch (err) {
    console.error("❌ Veritabanı bağlantı hatası:", err);
  }
})();