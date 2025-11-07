const { Drop } = require('../models');

// 📍 Tüm dropları listele (herkes görebilir)
const listDropsAdmin = async (req, res) => {
  try {
    const rows = await Drop.findAll({ order: [['created_at', 'DESC']] });
    return res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "list_failed" });
  }
};

// 📍 Yeni drop oluştur (sadece admin)
const createDrop = async (req, res) => {
  try {
    const { title, description, capacity, start_at, end_at, claim_window_start, claim_window_end } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "unauthenticated" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: "forbidden" });
    }

    const drop = await Drop.create({
      title,
      description,
      capacity,
      start_at,
      end_at,
      claim_window_start,
      claim_window_end,
      user_id: user.id, // foreign key artık user_id olacak
    });

    return res.status(201).json(drop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "create_failed" });
  }
};

const getDropByIdAdmin = async (req, res) => {
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
// 📍 Drop güncelle (sadece admin + kendi drop’u)
const updateDrop = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, capacity, start_at, end_at, claim_window_start, claim_window_end } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'unauthenticated' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'forbidden' });

    const drop = await Drop.findByPk(id);
    if (!drop) return res.status(404).json({ error: 'not_found' });

    // admin yalnızca kendi droplarını güncelleyebilir
    if (drop.user_id !== user.id) {
      return res.status(403).json({ error: 'not_owner' });
    }

    await drop.update({
      title: title ?? drop.title,
      description: description ?? drop.description,
      capacity: capacity ?? drop.capacity,
      start_at: start_at ?? drop.start_at,
      end_at: end_at ?? drop.end_at,
      claim_window_start: claim_window_start ?? drop.claim_window_start,
      claim_window_end: claim_window_end ?? drop.claim_window_end
    });

    return res.json(drop);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'update_failed' });
  }
};

// 📍 Drop sil (sadece admin + kendi drop’u)
const deleteDrop = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const user = req.user;

    if (!user) return res.status(401).json({ error: 'unauthenticated' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'forbidden' });

    const drop = await Drop.findByPk(id);
    if (!drop) return res.status(404).json({ error: 'not_found' });

    // sadece kendi droplarını silebilir
    if (drop.user_id !== user.id) {
      return res.status(403).json({ error: 'not_owner' });
    }

    await drop.destroy();
    return res.status(204).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'delete_failed' });
  }
};

module.exports = { listDropsAdmin, createDrop, updateDrop, deleteDrop,getDropByIdAdmin };
