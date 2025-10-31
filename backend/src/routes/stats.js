const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { mean } = require('../utils/../utils/stats');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// In-memory cache for computed stats
let statsCache = {
  value: null,
  sourceMtime: null,
  inFlight: null
};

async function computeStatsFromFile() {
  const raw = await fs.readFile(DATA_PATH, 'utf-8');
  const items = JSON.parse(raw);
  const prices = items.map(i => i.price);
  return {
    total: items.length,
    averagePrice: prices.length ? mean(prices) : 0
  };
}

async function getCachedStats() {
  const stat = await fs.stat(DATA_PATH);
  const mtimeMs = stat.mtimeMs;

  if (statsCache.value && statsCache.sourceMtime === mtimeMs) {
    return statsCache.value;
  }

  if (statsCache.inFlight) {
    return statsCache.inFlight;
  }

  statsCache.inFlight = (async () => {
    const fresh = await computeStatsFromFile();
    statsCache = { value: fresh, sourceMtime: mtimeMs, inFlight: null };
    return fresh;
  })();

  try {
    return await statsCache.inFlight;
  } finally {
    statsCache.inFlight = null;
  }
}


// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const stats = await getCachedStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;