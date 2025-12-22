#!/usr/bin/env node
import mongoose from 'mongoose';
import { mongoDBURL } from '../config.js';
import { Fruit } from '../models/vmodels.js';

/**
 * Migration script: convert legacy free-text `unitValue` or similar `quantity`
 * strings into structured `unitAmount`, `unitUnit`, and `unitType` fields.
 *
 * Usage:
 *  - Dry run (no DB writes): `node migrations/migrateUnits.js --dry`
 *  - Apply changes: `node migrations/migrateUnits.js`
 */

const dry = process.argv.includes('--dry') || process.env.DRY === '1';

function parseUnitString(str) {
  if (!str) return null;
  const s = String(str).trim().toLowerCase();

  // Try to match number + unit (e.g. "500g", "1.5 kg", "2 pcs")
  const re = /([\d.,]+)\s*(kg|g|gram|grams|l|litre|litres|ml|pcs?|pieces?|piece|pc|pack|packs)\b/i;
  const m = s.match(re);
  if (!m) return null;

  let num = parseFloat(m[1].replace(',', '.'));
  const rawUnit = m[2].toLowerCase();

  if (rawUnit.startsWith('kg')) {
    return { unitAmount: num * 1000, unitUnit: 'g', unitType: 'weight' };
  }

  if (rawUnit === 'g' || rawUnit.startsWith('gram')) {
    return { unitAmount: num, unitUnit: 'g', unitType: 'weight' };
  }

  if (rawUnit === 'l' || rawUnit.startsWith('litre') || rawUnit === 'ml') {
    // keep liters/ml as-is (not converting to grams) but mark as weight for display
    return { unitAmount: num, unitUnit: rawUnit === 'ml' ? 'ml' : 'l', unitType: 'weight' };
  }

  // pieces/pc/pack
  if (rawUnit.startsWith('pc') || rawUnit.startsWith('piece') || rawUnit.startsWith('pack') || rawUnit.startsWith('pcs')) {
    return { unitAmount: num, unitUnit: 'piece', unitType: 'pieces' };
  }

  return null;
}

async function run() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(mongoDBURL, { autoIndex: false });

    const fruits = await Fruit.find({}).lean();
    console.log(`Found ${fruits.length} fruits`);

    let modified = 0;

    for (const doc of fruits) {
      const hasStructured = doc.unitAmount != null && doc.unitUnit != null;
      if (hasStructured) continue;

      // Prefer explicit legacy `unitValue` if available, else fall back to `quantity` string
      const source = doc.unitValue ?? doc.quantity ?? '';
      const parsed = parseUnitString(source);

      const update = {};
      if (parsed) {
        update.unitAmount = parsed.unitAmount;
        update.unitUnit = parsed.unitUnit;
        update.unitType = parsed.unitType;
      } else {
        // No parseable unit found — set sensible defaults if missing
        update.unitAmount = doc.unitAmount ?? 100;
        update.unitUnit = doc.unitUnit ?? 'g';
        update.unitType = doc.unitType ?? 'weight';
      }

      console.log(`[${dry ? 'DRY' : 'APPLY'}] ${doc._id} ->`, update);

      if (!dry) {
        await Fruit.updateOne({ _id: doc._id }, { $set: update });
      }

      modified += 1;
    }

    console.log(`Processed ${fruits.length} fruits — modified ${modified} records.`);
    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(1);
  }
}

run();
