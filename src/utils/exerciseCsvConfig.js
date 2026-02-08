
export const EXERCISE_CSV_MAP = {
    // Neck
    "Chin Tucks": "/csv-data/neck.csv",
    "Isometric Side Press": "/csv-data/neck.csv",
    "Upper Trap Stretch": "/csv-data/neck.csv",
    "Neck Rotations": "/csv-data/neck.csv",
    "Levator Scapulae Stretch": "/csv-data/neck.csv",
    "Prone Neck Extension": "/csv-data/neck.csv",
    "T-Spine Openers": "/csv-data/neck.csv",
    "Corner Chest Stretch": "/csv-data/neck.csv",
    "Isometric Front": "/csv-data/neck.csv", // Added based on CSV content

    // Shoulders
    "Banded External Rotation": "/csv-data/shoulders.csv",
    "Banded Internal Rotation": "/csv-data/shoulders.csv",
    "Serratus Punches": "/csv-data/shoulders.csv",
    "Empty Can (Scaption)": "/csv-data/shoulders.csv",
    "Wall Slides": "/csv-data/shoulders.csv",
    "Pendulums": "/csv-data/shoulders.csv",
    "Face Pulls": "/csv-data/shoulders.csv",
    "Sleeper Stretch": "/csv-data/shoulders.csv",
    "Prone Y-Lifts": "/csv-data/shoulders.csv",
    "Wall Lift-Offs": "/csv-data/shoulders.csv",

    // Core & Back
    "Bird-Dog": "/csv-data/core-back.csv",
    "Dead Bug": "/csv-data/core-back.csv",
    "Pelvic Tilts": "/csv-data/core-back.csv",
    "Cat-Cow": "/csv-data/core-back.csv",
    "Side Plank": "/csv-data/core-back.csv",
    "Glute Bridges": "/csv-data/core-back.csv",
    "Superman Extensions": "/csv-data/core-back.csv",
    "Pallof Press": "/csv-data/core-back.csv",
    "Knee-to-Chest Stretch": "/csv-data/core-back.csv",
    "Prone Cobra": "/csv-data/core-back.csv",

    // Hips & Glutes
    "Clamshells": "/csv-data/hips-glutes.csv",
    "Lateral Band Walks": "/csv-data/hips-glutes.csv",
    "Monster Walks": "/csv-data/hips-glutes.csv",
    "Donkey Kicks": "/csv-data/hips-glutes.csv",
    "Fire Hydrants": "/csv-data/hips-glutes.csv",
    "Pigeon Stretch": "/csv-data/hips-glutes.csv",
    "Hip Flexor Stretch": "/csv-data/hips-glutes.csv",
    "Single-Leg Bridge": "/csv-data/hips-glutes.csv",
    "Adductor Squeezes": "/csv-data/hips-glutes.csv",
    "Figure-Four Stretch": "/csv-data/hips-glutes.csv",

    // Knees & Quads
    "Quad Sets": "/csv-data/knees-quads.csv",
    "Terminal Knee Extension (TKE)": "/csv-data/knees-quads.csv",
    "Straight Leg Raises": "/csv-data/knees-quads.csv",
    "Wall Sits": "/csv-data/knees-quads.csv",
    "Step-Ups": "/csv-data/knees-quads.csv",
    "Heel Slides": "/csv-data/knees-quads.csv",
    "Eccentric Squats": "/csv-data/knees-quads.csv",
    "Hamstring Curls": "/csv-data/knees-quads.csv",
    "VMO Arcs (Short Arc Quad)": "/csv-data/knees-quads.csv",
    "Long Arc Quads": "/csv-data/knees-quads.csv",

    // Ankles & Calves
    "Standing Calf Raises": "/csv-data/ankles-calves.csv",
    "Seated Calf Raises": "/csv-data/ankles-calves.csv",
    "Ankle Pumps": "/csv-data/ankles-calves.csv",
    "Ankle Alphabets": "/csv-data/ankles-calves.csv",
    "Towel Curls": "/csv-data/ankles-calves.csv",
    "Banded Eversion": "/csv-data/ankles-calves.csv",
    "Banded Inversion": "/csv-data/ankles-calves.csv",
    "Tibialis Raises": "/csv-data/ankles-calves.csv",
    "Single-Leg Balance": "/csv-data/ankles-calves.csv",
    "Tandem Stance": "/csv-data/ankles-calves.csv"
};

export const getCsvPathForExercise = (exerciseName) => {
    return EXERCISE_CSV_MAP[exerciseName] || null;
};
