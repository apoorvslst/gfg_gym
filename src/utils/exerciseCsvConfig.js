/**
 * Maps physio exercise display names to CSV filename and CSV row name.
 * CSV files live in public/ and are fetched at runtime.
 */
export const CSV_FILES = {
  neck: 'neckexercise.csv',
  shoulders: 'shoulder-_-rotated-cuff.csv',
  'core-back': 'core and lower back.csv',
  'hips-glutes': 'Hips & Glutes.csv',
  'knees-quads': 'knees_quadrants.csv',
  'ankles-calves': 'ankles&calves.csv',
};

/** Display name (from Physio/Gym) -> { muscleId, csvRowName } */
export const EXERCISE_TO_CSV_ROW = {
  // Neck
  'Chin Tucks': { muscleId: 'neck', csvRowName: 'Chin Tuck' },
  'Isometric Side Press': { muscleId: 'neck', csvRowName: 'Isometric Side' },
  'Upper Trap Stretch': { muscleId: 'neck', csvRowName: 'Trap Stretch' },
  'Levator Scapulae Stretch': { muscleId: 'neck', csvRowName: 'Levator Stretch' },
  'Neck Rotations': { muscleId: 'neck', csvRowName: 'Neck Rotation' },
  'Prone Neck Extension': { muscleId: 'neck', csvRowName: 'Prone Neck Ext.' },
  'T-Spine Openers': { muscleId: 'neck', csvRowName: 'T-Spine Opener' },
  'Corner Chest Stretch': { muscleId: 'neck', csvRowName: 'Corner Chest' },
  // Shoulders
  'Banded External Rotation': { muscleId: 'shoulders', csvRowName: 'Banded Ext. Rot.' },
  'Banded Internal Rotation': { muscleId: 'shoulders', csvRowName: 'Banded Int. Rot.' },
  'Serratus Punches': { muscleId: 'shoulders', csvRowName: 'Serratus Punch' },
  'Empty Can (Scaption)': { muscleId: 'shoulders', csvRowName: 'Empty Can' },
  'Wall Slides': { muscleId: 'shoulders', csvRowName: 'Wall Slides' },
  'Pendulums': { muscleId: 'shoulders', csvRowName: 'Pendulums' },
  'Face Pulls': { muscleId: 'shoulders', csvRowName: 'Face Pulls' },
  'Sleeper Stretch': { muscleId: 'shoulders', csvRowName: 'Sleeper Stretch' },
  'Prone Y-Lifts': { muscleId: 'shoulders', csvRowName: 'Prone Y-Lift' },
  'Wall Lift-Offs': { muscleId: 'shoulders', csvRowName: 'Wall Lift-Off' },
  // Core & Lower Back
  'Bird-Dog': { muscleId: 'core-back', csvRowName: 'Bird-Dog' },
  'Dead Bug': { muscleId: 'core-back', csvRowName: 'Dead Bug' },
  'Pelvic Tilts': { muscleId: 'core-back', csvRowName: 'Pelvic Tilt' },
  'Cat-Cow': { muscleId: 'core-back', csvRowName: 'Cat-Cow' },
  'Side Plank': { muscleId: 'core-back', csvRowName: 'Side Plank' },
  'Glute Bridges': { muscleId: 'core-back', csvRowName: 'Glute Bridge' },
  'Superman Extensions': { muscleId: 'core-back', csvRowName: 'Superman' },
  'Pallof Press': { muscleId: 'core-back', csvRowName: 'Pallof Press' },
  'Knee-to-Chest Stretch': { muscleId: 'core-back', csvRowName: 'Knee-to-Chest' },
  'Prone Cobra': { muscleId: 'core-back', csvRowName: 'Prone Cobra' },
  // Hips & Glutes
  'Clamshells': { muscleId: 'hips-glutes', csvRowName: 'Clamshells' },
  'Lateral Band Walks': { muscleId: 'hips-glutes', csvRowName: 'Lateral Walks' },
  'Monster Walks': { muscleId: 'hips-glutes', csvRowName: 'Monster Walks' },
  'Donkey Kicks': { muscleId: 'hips-glutes', csvRowName: 'Donkey Kicks' },
  'Fire Hydrants': { muscleId: 'hips-glutes', csvRowName: 'Fire Hydrants' },
  'Pigeon Stretch': { muscleId: 'hips-glutes', csvRowName: 'Pigeon Stretch' },
  'Hip Flexor Stretch': { muscleId: 'hips-glutes', csvRowName: 'Hip Flexor Str.' },
  'Single-Leg Bridge': { muscleId: 'hips-glutes', csvRowName: 'Single-Leg Br.' },
  'Adductor Squeezes': { muscleId: 'hips-glutes', csvRowName: 'Adductor Squeeze' },
  'Figure-Four Stretch': { muscleId: 'hips-glutes', csvRowName: 'Figure-Four' },
  // Knees & Quads
  'Quad Sets': { muscleId: 'knees-quads', csvRowName: 'Quad Set' },
  'Terminal Knee Extension (TKE)': { muscleId: 'knees-quads', csvRowName: 'TKE' },
  'Straight Leg Raises': { muscleId: 'knees-quads', csvRowName: 'SLR' },
  'Wall Sits': { muscleId: 'knees-quads', csvRowName: 'Wall Sit' },
  'Step-Ups': { muscleId: 'knees-quads', csvRowName: 'Step-Up' },
  'Heel Slides': { muscleId: 'knees-quads', csvRowName: 'Heel Slide' },
  'Eccentric Squats': { muscleId: 'knees-quads', csvRowName: 'Eccentric Squat' },
  'Hamstring Curls': { muscleId: 'knees-quads', csvRowName: 'Hamstring Curl' },
  'VMO Arcs (Short Arc Quad)': { muscleId: 'knees-quads', csvRowName: 'VMO Arc' },
  'Long Arc Quads': { muscleId: 'knees-quads', csvRowName: 'Long Arc Quad' },
  // Ankles & Calves
  'Standing Calf Raises': { muscleId: 'ankles-calves', csvRowName: 'Standing Calf R.' },
  'Seated Calf Raises': { muscleId: 'ankles-calves', csvRowName: 'Seated Calf R.' },
  'Ankle Pumps': { muscleId: 'ankles-calves', csvRowName: 'Ankle Pump' },
  'Ankle Alphabets': { muscleId: 'ankles-calves', csvRowName: 'Ankle Alphabet' },
  'Towel Curls': { muscleId: 'ankles-calves', csvRowName: 'Towel Curl' },
  'Banded Eversion': { muscleId: 'ankles-calves', csvRowName: 'Banded Eversion' },
  'Banded Inversion': { muscleId: 'ankles-calves', csvRowName: 'Banded Inversion' },
  'Tibialis Raises': { muscleId: 'ankles-calves', csvRowName: 'Tibialis Raise' },
  'Single-Leg Balance': { muscleId: 'ankles-calves', csvRowName: 'Single-Leg Bal.' },
  'Tandem Stance': { muscleId: 'ankles-calves', csvRowName: 'Tandem Stance' },
};

export function getCsvPathForExercise(exerciseDisplayName) {
  const mapping = EXERCISE_TO_CSV_ROW[exerciseDisplayName];
  if (!mapping) return null;
  const filename = CSV_FILES[mapping.muscleId];
  return filename ? `/${filename}` : null;
}

export function getCsvRowNameForExercise(exerciseDisplayName) {
  return EXERCISE_TO_CSV_ROW[exerciseDisplayName]?.csvRowName ?? null;
}
