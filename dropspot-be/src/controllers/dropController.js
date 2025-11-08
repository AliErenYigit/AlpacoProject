const crypto = require("crypto");
const { nanoid } = require("nanoid");
const { Drop, Waitlist, Claim,User} = require("../models");
const sequelize = require("../db/database");
const { computePriorityScore } = require("../utils/priority");
const { getSeed } = require("../utils/seed");
const { Op } = require("sequelize");
const dayjs = require("dayjs");

// // 🔐 seed hesaplama (her ortamda farklı deterministik değer)
// const getSeed = () => {
//   const raw =
//     (process.env.SEED_RAW || "local") +
//     (process.env.PROJECT_START_YYYYMMDDHHmm || "");
//   return crypto.createHash("sha256").update(raw).digest("hex").slice(0, 12);
// };

// 📍 Tüm drop'ları listele (her kullanıcı erişebilir)
const getDrops = async (req, res) => {
  try {
    const rows = await Drop.findAll({
      order: [["claim_window_start", "ASC"]],
    });
    return res.json(rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "list_failed" });
  }
};

// 📍 Belirli drop'u ID ile getir
const getDropById = async (req, res) => {
  try {
    const dropId = parseInt(req.params.id, 10);
    const drop = await Drop.findByPk(dropId);
    if (!drop) return res.status(404).json({ error: "drop_not_found" });
    return res.json(drop);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "fetch_failed" });
  }
};

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
// 📍 Kullanıcının belirli bir drop'taki waitlist durumunu getirir
const getWaitlistStatus = async (req, res) => {
  const userId = req.user.id;
  const dropId = parseInt(req.params.id, 10);

  try {
    const record = await Waitlist.findOne({
      where: { user_id: userId, drop_id: dropId },
      attributes: ["status", "priority_score"],
    });

    if (!record) {
      // Kullanıcının kaydı yoksa status null dönelim
      return res.json({ status: null, in_waitlist: false });
    }

    return res.json({
      status: record.status, // örn: "waiting", "claimed", "left"
      in_waitlist: record.status === "waiting" || record.status === "claimed",
      priority_score: record.priority_score,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "status_fetch_failed" });
  }
};


// 📍 Kullanıcı bekleme listesinden ayrılır
const leaveWaitlist = async (req, res) => {
  const userId = req.user.id;
  const dropId = parseInt(req.params.id, 10);
  try {
    const [affected] = await Waitlist.update(
      { status: "left" },
      {
        where: {
          user_id: userId,
          drop_id: dropId,
          status: { [Op.in]: ["waiting", "claimed"] },
        },
      }
    );
    return res.json({ ok: true, updated: affected });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "leave_failed" });
  }
};

// 📍 Kullanıcı drop hak talebi yapar (claim)
const claimDrop = async (req, res) => {
  const userId = req.user.id;
  const dropId = parseInt(req.params.id, 10);

  const t = await sequelize.transaction();
  try {
    // transaction kilidi (aynı anda iki kişi claim yapmasın)
    await sequelize.query(`SELECT pg_advisory_xact_lock(hashtext($1));`, {
      bind: [`drop:${dropId}`],
      transaction: t,
    });

    const drop = await Drop.findByPk(dropId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!drop) {
      await t.rollback();
      return res.status(404).json({ error: "drop_not_found" });
    }

    const now = new Date();
    if (!(now >= drop.claim_window_start && now <= drop.claim_window_end)) {
      await t.rollback();
      return res.status(409).json({ error: "claim_window_closed" });
    }

    // kapasite kontrolü
    const claims = await Claim.count({ where: { drop_id: dropId }, transaction: t });
    if (claims >= drop.capacity) {
      await t.rollback();
      return res.status(409).json({ error: "sold_out" });
    }

    // kullanıcı bekleme listesinde mi?
    const wl = await Waitlist.findOne({
      where: { user_id: userId, drop_id: dropId, status: "waiting" },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!wl) {
      await t.rollback();
      return res.status(403).json({ error: "not_in_waiting" });
    }

    // sıradaki kişi mi?
    const [rows] = await sequelize.query(
      `SELECT id, user_id FROM waitlist
       WHERE drop_id = $1 AND status='waiting'
       ORDER BY priority_score ASC, joined_at ASC
       LIMIT 1 FOR UPDATE SKIP LOCKED`,
      { bind: [dropId], transaction: t }
    );

    if (!rows.length || rows[0].user_id !== userId) {
      await t.rollback();
      return res.status(409).json({ error: "not_your_turn" });
    }

    const code = `CLM-${nanoid(10)}`;

    await Claim.findOrCreate({
      where: { user_id: userId, drop_id: dropId },
      defaults: {
        user_id: userId,
        drop_id: dropId,
        claim_code: code,
        claimed_at: new Date(),
      },
      transaction: t,
    });

    await Waitlist.update(
      { status: "claimed" },
      { where: { id: rows[0].id }, transaction: t }
    );

    await t.commit();
    return res.status(201).json({ claim_code: code });
  } catch (e) {
    await t.rollback();
    console.error(e);
    if (e.name === "SequelizeUniqueConstraintError")
      return res.status(409).json({ error: "already_claimed" });
    return res.status(500).json({ error: "claim_failed" });
  }
};

module.exports = { getDrops, getDropById, joinWaitlist, leaveWaitlist, claimDrop,getWaitlistStatus };
