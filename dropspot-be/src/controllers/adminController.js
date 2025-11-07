const { Drop } = require('../models');


const listDropsAdmin = async (req, res) => {
  const rows = await Drop.findAll({ order: [['created_at','DESC']] });
  return res.json(rows);
};

const createDrop = async (req, res) => {
  const { title, description, capacity, start_at, end_at, claim_window_start, claim_window_end } = req.body;
  if (!title || !capacity || !start_at || !end_at || !claim_window_start || !claim_window_end)
    return res.status(422).json({ error: 'invalid_payload' });

  try {
    const d = await Drop.create({ title, description, capacity, start_at, end_at, claim_window_start, claim_window_end });
    return res.status(201).json(d);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'create_failed' });
  }
};

const updateDrop = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, capacity, start_at, end_at, claim_window_start, claim_window_end } = req.body;

  try {
    const d = await Drop.findByPk(id);
    if (!d) return res.status(404).json({ error: 'not_found' });

    await d.update({
      title: title ?? d.title,
      description: description ?? d.description,
      capacity: capacity ?? d.capacity,
      start_at: start_at ?? d.start_at,
      end_at: end_at ?? d.end_at,
      claim_window_start: claim_window_start ?? d.claim_window_start,
      claim_window_end: claim_window_end ?? d.claim_window_end
    });
    return res.json(d);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'update_failed' });
  }
};

const deleteDrop = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const d = await Drop.findByPk(id);
    if (!d) return res.status(404).json({ error: 'not_found' });
    await d.destroy();
    return res.status(204).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'delete_failed' });
  }
};

module.exports = { listDropsAdmin, createDrop, updateDrop, deleteDrop };
