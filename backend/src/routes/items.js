const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data asynchronously
async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const page = Math.max(1, parseInt(req.query.page || '1', 10) || 1);
    const pageSizeRaw = parseInt(req.query.pageSize || '20', 10) || 20;
    const pageSize = Math.min(100, Math.max(1, pageSizeRaw));

    // Filter
    let filtered = data;
    if (q) {
      const lower = q.toLowerCase();
      filtered = data.filter(item =>
        (item.name && item.name.toLowerCase().includes(lower)) ||
        (item.category && item.category.toLowerCase().includes(lower))
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = start >= total ? [] : filtered.slice(start, end);

    res.json({ items, page, pageSize, total });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;