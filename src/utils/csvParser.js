/**
 * Fetches and parses exercise angle CSV. Returns row for a given exercise.
 * CSV columns: Exercise Name, Primary Vertex, Landmark A, Landmark C, Start Angle Range, End Angle Range, Error Condition
 */

import { getCsvPathForExercise, getCsvRowNameForExercise } from './exerciseCsvConfig';

// MediaPipe Pose landmark indices (33 total)
const LANDMARK_NAMES = {
  'Nose (0)': 0,
  'Nose': 0,
  'Ear (7)': 7,
  'Ear (8)': 8,
  'Ear (7/8)': null, // use midpoint 7,8
  'Shoulder (11)': 11,
  'Shoulder (12)': 12,
  'Shoulder (11/12)': null,
  'Elbow (13)': 13,
  'Elbow (14)': 14,
  'Elbow (13/14)': null,
  'Wrist (15)': 15,
  'Wrist (16)': 16,
  'Wrist (15/16)': null,
  'Hip (23)': 23,
  'Hip (24)': 24,
  'Hip (23/24)': null,
  'Knee (25)': 25,
  'Knee (26)': 26,
  'Knee (25/26)': null,
  'Ankle (27)': 27,
  'Ankle (28)': 28,
  'Ankle (27/28)': null,
  'Heel (29)': 29,
  'Heel (30)': 30,
  'Heel (29/30)': null,
  'Toe (31)': 31,
  'Toe (32)': 32,
  'Toe (31/32)': null,
  'Mid-Shoulder': null,
  'Mid-Back': null,
  'Sternum': null,
  'Chest Mid': null,
  'Foot Mid': null,
  'Mid-Hip': null,
};

const BILATERAL_PAIRS = {
  'Ear (7/8)': [7, 8],
  'Shoulder (11/12)': [11, 12],
  'Elbow (13/14)': [13, 14],
  'Wrist (15/16)': [15, 16],
  'Hip (23/24)': [23, 24],
  'Knee (25/26)': [25, 26],
  'Ankle (27/28)': [27, 28],
  'Heel (29/30)': [29, 30],
  'Toe (31/32)': [31, 32],
};

const COMPOSITE_ALIASES = {
  'Mid-Shoulder': 'Shoulder (11/12)',
  'Sternum': 'Shoulder (11/12)',
  'Chest Mid': 'Shoulder (11/12)',
  'Mid-Hip': 'Hip (23/24)',
  'Foot Mid': 'Toe (31/32)',
};
const MID_BACK_INDICES = [11, 12, 23, 24];

/** Parse "85∘−95∘" or "175-180" style range to [min, max] or null if not parseable */
export function parseAngleRange(str) {
  if (!str || typeof str !== 'string') return null;
  const cleaned = str.replace(/∘/g, '').replace(/°/g, '').trim();
  const match = cleaned.match(/(\d+)\s*[−\-–]\s*(\d+)/);
  if (match) return [parseFloat(match[1]), parseFloat(match[2])];
  const single = cleaned.match(/(\d+)/);
  if (single) {
    const v = parseFloat(single[1]);
    return [v - 5, v + 5];
  }
  return null;
}

/** Get landmark index or bilateral pair for a landmark name string from CSV */
export function resolveLandmark(name) {
  if (!name) return null;
  const key = name.trim();
  const alias = COMPOSITE_ALIASES[key];
  const resolvedKey = alias || key;
  const single = LANDMARK_NAMES[resolvedKey];
  if (single !== undefined && single !== null) return { type: 'single', index: single };
  const pair = BILATERAL_PAIRS[resolvedKey];
  if (pair) return { type: 'bilateral', indices: pair };
  if (resolvedKey === 'Mid-Back')
    return { type: 'composite', indices: MID_BACK_INDICES };
  if (LANDMARK_NAMES[resolvedKey] === null) {
    const b = BILATERAL_PAIRS[resolvedKey];
    if (b) return { type: 'bilateral', indices: b };
  }
  return null;
}

/** Get x,y from pose landmarks for a resolved landmark (single or bilateral midpoint) */
export function getLandmarkPoint(landmarks, resolved) {
  if (!landmarks || !resolved) return null;
  if (resolved.type === 'single') {
    const p = landmarks[resolved.index];
    return p && p.visibility > 0.5 ? { x: p.x, y: p.y } : null;
  }
  if (resolved.type === 'bilateral') {
    const [i, j] = resolved.indices;
    const a = landmarks[i];
    const b = landmarks[j];
    if (!a || !b || a.visibility < 0.3 || b.visibility < 0.3) return null;
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
  }
  if (resolved.type === 'composite') {
    let x = 0, y = 0, n = 0;
    for (const i of resolved.indices) {
      const p = landmarks[i];
      if (p && p.visibility > 0.3) {
        x += p.x;
        y += p.y;
        n++;
      }
    }
    return n > 0 ? { x: x / n, y: y / n } : null;
  }
  return null;
}

/** Calculate angle at vertex B between BA and BC (degrees) */
export function angleAtVertex(a, b, c) {
  if (!a || !b || !c) return null;
  const rad = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let deg = (Math.abs(rad) * 180) / Math.PI;
  if (deg > 180) deg = 360 - deg;
  return deg;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if ((ch === ',' && !inQuotes) || ch === '\n') {
      result.push(current.trim());
      current = '';
      if (ch === '\n') break;
    } else {
      current += ch;
    }
  }
  if (current.length) result.push(current.trim());
  return result;
}

function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const header = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};
    header.forEach((h, j) => {
      row[h.trim()] = values[j] != null ? values[j].trim() : '';
    });
    rows.push(row);
  }
  return rows;
}

/** Fetch CSV and return parsed rows */
export async function fetchExerciseCsv(csvPath) {
  const res = await fetch(csvPath);
  if (!res.ok) throw new Error(`Failed to fetch CSV: ${csvPath}`);
  const text = await res.text();
  return parseCSV(text);
}

/** Get angle rule for current exercise: { vertex, landmarkA, landmarkC, startRange, endRange, errorCondition } */
export async function getAngleRuleForExercise(exerciseDisplayName) {
  const csvPath = getCsvPathForExercise(exerciseDisplayName);
  const csvRowName = getCsvRowNameForExercise(exerciseDisplayName);
  if (!csvPath || !csvRowName) return null;

  const rows = await fetchExerciseCsv(csvPath);
  const nameKey = 'Exercise Name';
  const row = rows.find((r) => {
    const name = (r[nameKey] || '').replace(/^"|"$/g, '').trim();
    return name === csvRowName || name.toLowerCase() === csvRowName.toLowerCase();
  });
  if (!row) return null;

  const primaryVertex = (row['Primary Vertex'] || row['Primary Vertex'] || '').trim();
  const landmarkA = (row['Landmark A'] || '').trim();
  const landmarkC = (row['Landmark C'] || '').trim();
  const startStr = (row['Start Angle Range'] || '').trim();
  const endStr = (row['End Angle Range'] || '').trim();
  const errorCondition = (row['Error Condition'] || '').trim();

  const startRange = parseAngleRange(startStr);
  const endRange = parseAngleRange(endStr);

  return {
    primaryVertex,
    landmarkA,
    landmarkC,
    startRange,
    endRange,
    errorCondition,
    startRaw: startStr,
    endRaw: endStr,
  };
}

/** Validate current angle against rule. Returns { valid, message, currentAngle }. */
export function validateAngle(angle, rule) {
  if (!rule) return { valid: true, message: 'No rule', currentAngle: angle };
  const currentAngle = angle;
  if (currentAngle == null) return { valid: false, message: 'Angle not available', currentAngle: null };

  const start = rule.startRange;
  const end = rule.endRange;
  const inStart = start && currentAngle >= start[0] && currentAngle <= start[1];
  const inEnd = end && currentAngle >= end[0] && currentAngle <= end[1];
  if (start && end) {
    const valid = inStart || inEnd;
    return {
      valid,
      message: valid ? 'Good form' : `Target: ${rule.startRaw} / ${rule.endRaw}. Current: ${currentAngle.toFixed(0)}°`,
      currentAngle,
    };
  }
  if (start) {
    const valid = inStart;
    return {
      valid,
      message: valid ? 'Good form' : `Target: ${rule.startRaw}. Current: ${currentAngle.toFixed(0)}°`,
      currentAngle,
    };
  }
  if (end) {
    const valid = inEnd;
    return {
      valid,
      message: valid ? 'Good form' : `Target: ${rule.endRaw}. Current: ${currentAngle.toFixed(0)}°`,
      currentAngle,
    };
  }
  return { valid: true, message: 'No angle range defined', currentAngle };
}
