const cron = require("node-cron");
const dayjs = require("dayjs");
const { Drop } = require("../models");

// Her 5 dakikada bir çalışacak
cron.schedule("* * * * *", async () => {
  console.log("🕒 Checking drop statuses...");

  try {
    const drops = await Drop.findAll();

    for (const drop of drops) {
      const now = dayjs();
      let newStatus = drop.status;

      if (now.isBefore(dayjs(drop.start_at))) {
        newStatus = "upcoming";
      } else if (now.isAfter(dayjs(drop.end_at))) {
        newStatus = "ended";
      } else {
        newStatus = "active";
      }

      // Değişiklik varsa güncelle
      if (newStatus !== drop.status) {
        await drop.update({ status: newStatus });
        console.log(`✅ Updated drop ${drop.id} → ${newStatus}`);
      }
    }
  } catch (err) {
    console.error("❌ Drop status job failed:", err);
  }
});
