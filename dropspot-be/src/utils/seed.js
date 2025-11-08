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
