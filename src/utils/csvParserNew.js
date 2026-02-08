import { getCsvPathForExercise } from './exerciseCsvConfig';
import allJsonRaw from '../assets/all-json.csv?raw';

let parsedJsonData = null;

const parseAllJson = () => {
    if (parsedJsonData) return parsedJsonData;
    try {
        // Cleaning the specific "CSV-JSON" format
        // 1. Split lines
        const lines = allJsonRaw.split('\n');
        // 2. Map lines: Remove wrapping quotes, unescape double quotes
        const cleanJson = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            // If strictly wrapped in quotes like "content", remove them
            // But be careful not to remove quotes from JSON keys
            // The format observed: "{" or """key"": ..."
            // We can try a simple replace of """ with " and then handle edges

            // Heuristic cleanup:
            // Remove leading " and trailing " if they exist
            let s = trimmed;
            if (s.startsWith('"') && s.endsWith('"')) {
                s = s.substring(1, s.length - 1);
            }
            // Replace """ with "
            s = s.replace(/""/g, '"');
            return s;
        }).join('\n');

        parsedJsonData = JSON.parse(cleanJson);
        return parsedJsonData;
    } catch (e) {
        console.error("Failed to parse all-json.csv", e);
        return null;
    }
};

// Start/Target Logic Helpers
const inferMovementRanges = (jointName, stats) => {
    const { absolute_min, absolute_max, mean } = stats;
    // Default Margins
    const START_MARGIN = 20;
    const TARGET_MARGIN = 15;

    // 1. Elbow (Curls, Rows) - Usually Flexion (180 -> 40)
    if (jointName.includes("elbow")) {
        // Check if it's a curl (mean < 140?) or extension
        // Assuming Curl for now as most common exercise
        return {
            start: `${(absolute_max - START_MARGIN).toFixed(0)}-${(absolute_max + 5).toFixed(0)}`, // ~160-180
            end: `${(absolute_min).toFixed(0)}-${(absolute_min + TARGET_MARGIN).toFixed(0)}`,       // ~0-40
            type: 'flexion'
        };
    }

    // 2. Hip (Thrusts, Squats)
    if (jointName.includes("hip")) {
        // Thrust: Extension (Start ~90, target ~180)
        // Squat: Flexion (Start ~180, target ~90)

        // Use mean to guess? 
        // If absolute_min is very low (squat deep), and absolute_max is 180.
        // If it's a Thrust, min is ~90.

        if (absolute_min > 70) {
            // Likely Thrust (Extension)
            return {
                start: `${(absolute_min - 10).toFixed(0)}-${(absolute_min + 30).toFixed(0)}`, // ~90-120
                end: `${(absolute_max - 20).toFixed(0)}-${(absolute_max + 5).toFixed(0)}`,   // ~160-180
                type: 'extension'
            };
        } else {
            // Likely Squat (Flexion)
            return {
                start: `${(absolute_max - 20).toFixed(0)}-${(absolute_max + 5).toFixed(0)}`, // ~160-180
                end: `${(absolute_min).toFixed(0)}-${(absolute_min + 30).toFixed(0)}`,       // ~40-70
                type: 'flexion'
            };
        }
    }

    // 3. Knee (Squat, Lunge) - Flexion (180 -> 90)
    if (jointName.includes("knee")) {
        return {
            start: `${(absolute_max - 20).toFixed(0)}-${(absolute_max + 5).toFixed(0)}`, // ~160-180
            end: `${(absolute_min).toFixed(0)}-${(absolute_min + 30).toFixed(0)}`,       // ~40-70
            type: 'flexion'
        };
    }

    // 4. Shoulder (Press, Raise) - Flexion/Abduction (0 -> 180)
    if (jointName.includes("shoulder")) {
        // Raise/Press: Start ~0-20, Target ~90-180
        return {
            start: `${(absolute_min).toFixed(0)}-${(absolute_min + 30).toFixed(0)}`, // ~0-30
            end: `${(absolute_max - 30).toFixed(0)}-${(absolute_max + 5).toFixed(0)}`, // ~150-180
            type: 'extension' // Technically flexion anatomically, but angle goes up
        };
    }

    // Default Fallback
    return {
        start: "0-0",
        end: "0-0",
        type: 'unknown'
    };
};

// Helper to resolve landmark names to MediaPipe indices or special composites
export const resolveLandmark = (name) => {
    if (!name) return null;
    const n = name.toLowerCase();

    // Special Averaged Landmarks
    if (n.includes("mid-shoulder") || n.includes("sternum") || n.includes("chest")) {
        return [11, 12]; // Will be averaged
    }

    // Mapping common names to indices
    if (n.includes("nose")) return 0;
    if (n.includes("left_eye_inner")) return 1;
    if (n.includes("left_eye")) return 2;
    if (n.includes("left_eye_outer")) return 3;
    if (n.includes("right_eye_inner")) return 4;
    if (n.includes("right_eye")) return 5;
    if (n.includes("right_eye_outer")) return 6;
    if (n.includes("left_ear")) return 7;
    if (n.includes("right_ear")) return 8;
    if (n.includes("mouth_left")) return 9;
    if (n.includes("mouth_right")) return 10;
    if (n.includes("left_shoulder")) return 11;
    if (n.includes("right_shoulder")) return 12;
    if (n.includes("left_elbow")) return 13;
    if (n.includes("right_elbow")) return 14;
    if (n.includes("left_wrist")) return 15;
    if (n.includes("right_wrist")) return 16;
    if (n.includes("left_pinky")) return 17;
    if (n.includes("right_pinky")) return 18;
    if (n.includes("left_index")) return 19;
    if (n.includes("right_index")) return 20;
    if (n.includes("left_thumb")) return 21;
    if (n.includes("right_thumb")) return 22;
    if (n.includes("left_hip")) return 23;
    if (n.includes("right_hip")) return 24;
    if (n.includes("left_knee")) return 25;
    if (n.includes("right_knee")) return 26;
    if (n.includes("left_ankle")) return 27;
    if (n.includes("right_ankle")) return 28;
    if (n.includes("left_heel")) return 29;
    if (n.includes("right_heel")) return 30;
    if (n.includes("left_foot_index")) return 31;
    if (n.includes("right_foot_index")) return 32;

    // Handle "Shoulder (11/12)" style - Default to LEFT (first number) for consistency
    const match = n.match(/\((\d+)\/?(\d+)?\)/);
    if (match) {
        return parseInt(match[1], 10);
    }

    // Fallbacks for general terms - Default to Left side
    if (n.includes("shoulder")) return 11;
    if (n.includes("elbow")) return 13;
    if (n.includes("wrist")) return 15;
    if (n.includes("hip")) return 23;
    if (n.includes("knee")) return 25;
    if (n.includes("ankle")) return 27;
    if (n.includes("heel")) return 29;
    if (n.includes("toe") || n.includes("foot")) return 31;
    if (n.includes("ear")) return 7;
    if (n.includes("nose")) return 0;

    return null;
};

export const getLandmarkPoint = (landmarks, indexOrIndices) => {
    if (!landmarks) return null;

    // Handle specific index
    if (typeof indexOrIndices === 'number') {
        return landmarks[indexOrIndices] || null;
    }

    // Handle array of indices (Average them)
    if (Array.isArray(indexOrIndices)) {
        let x = 0, y = 0, z = 0, visibility = 0;
        let count = 0;

        indexOrIndices.forEach(idx => {
            const l = landmarks[idx];
            if (l) {
                x += l.x;
                y += l.y;
                z += (l.z || 0);
                visibility += (l.visibility || 0);
                count++;
            }
        });

        if (count === 0) return null;

        return {
            x: x / count,
            y: y / count,
            z: z / count,
            visibility: visibility / count
        };
    }

    return null;
};

export const angleAtVertex = (A, B, C) => {
    if (!A || !B || !C) return 0;

    const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));

    const rad = Math.acos(Math.max(-1, Math.min(1, (AB * AB + BC * BC - AC * AC) / (2 * AB * BC))));
    return (rad * 180) / Math.PI;
};

export const getBodyPartFromVertex = (vertexName) => {
    const v = vertexName.toLowerCase();
    if (v.includes("shoulder")) return "shoulders";
    if (v.includes("elbow") || v.includes("hand") || v.includes("wrist")) return "arms";
    if (v.includes("hip")) return "hips";
    if (v.includes("knee")) return "knees";
    if (v.includes("ankle") || v.includes("foot") || v.includes("toe")) return "ankles";
    if (v.includes("neck") || v.includes("head") || v.includes("nose") || v.includes("ear")) return "neck";
    if (v.includes("back") || v.includes("spine")) return "back";
    return "body";
};

export const validateAngle = (currentAngle, rule, options = {}) => {
    if (currentAngle === null || isNaN(currentAngle)) {
        return { valid: false, message: "Tracking...", currentAngle: null, status: 'tracking', color: 'gray' };
    }

    // Parse ranges "170-180" or "85-95"
    const parseRange = (rangeStr) => {
        if (!rangeStr) return null;
        // Replace non-digit/dot chars (including hyphens) with space to separate parts
        // "85-95" -> "85 95"
        const clean = rangeStr.replace(/[^\d.]/g, ' ').trim();
        const parts = clean.split(/\s+/).filter(p => p !== '').map(Number);

        let min, max;

        if (parts.length >= 2) {
            min = Math.min(parts[0], parts[1]);
            max = Math.max(parts[0], parts[1]);
        } else if (parts.length === 1 && !isNaN(parts[0])) {
            min = parts[0] - 5;
            max = parts[0] + 5;
        } else {
            return null;
        }

        // Relax strictness for Physio (approx 25% / 20 degrees)
        if (options.isPhysio) {
            min -= 20;
            max += 20;
        }

        return { min, max };
    };

    const startRange = parseRange(rule.startRaw); // "Start Angle Range"
    const endRange = parseRange(rule.endRaw);     // "End Angle Angle" - Usually the target

    // 4-State Logic: Start -> Transition -> Target -> Overshoot
    // Determine movement direction
    const isFlexion = startRange && endRange && startRange.min > endRange.max; // e.g. 180 -> 90

    // 1. Check Target (Success)
    if (endRange) {
        if (currentAngle >= endRange.min && currentAngle <= endRange.max) {
            return { valid: true, message: "Perfect! Hold.", currentAngle, status: 'target', color: 'green' };
        }
    }

    // 2. Check Start (Ready)
    if (startRange) {
        if (currentAngle >= startRange.min && currentAngle <= startRange.max) {
            return { valid: true, message: "Ready. Begin.", currentAngle, status: 'start', color: 'blue' };
        }
    }

    // 3. Check Transition vs Error
    if (startRange && endRange) {
        if (isFlexion) {
            // Target is smaller (e.g. 90). Start is larger (e.g. 180).
            if (currentAngle < endRange.min) {
                // Went past target (e.g. 80)
                return { valid: false, message: "Too far! Increase angle.", instruction: "increase angle", currentAngle, status: 'overshoot', color: 'red' };
            }
            if (currentAngle < startRange.min && currentAngle > endRange.max) {
                // In between (e.g. 135)
                return { valid: true, message: "Keep going...", instruction: "squeeze", currentAngle, status: 'transition', color: 'yellow' };
            }
            if (currentAngle > startRange.max) {
                // Hyperextended at start?
                return { valid: false, message: "Reset to start.", instruction: "reset", currentAngle, status: 'undershoot', color: 'gray' };
            }
        } else {
            // Start is smaller (e.g. 0). Target is larger (e.g. 90).
            if (currentAngle > endRange.max) {
                // Went past target (e.g. 100)
                return { valid: false, message: "Too far! Decrease angle.", instruction: "decrease angle", currentAngle, status: 'overshoot', color: 'red' };
            }
            if (currentAngle > startRange.max && currentAngle < endRange.min) {
                // In between (e.g. 45)
                return { valid: true, message: "Keep going...", instruction: "lift", currentAngle, status: 'transition', color: 'yellow' };
            }
            if (currentAngle < startRange.min) {
                return { valid: false, message: "Reset to start.", instruction: "reset", currentAngle, status: 'undershoot', color: 'gray' };
            }
        }
    }

    // Fallback if no start range defined or weird data
    if (endRange) {
        if ((isFlexion && currentAngle > endRange.max) || (!isFlexion && currentAngle < endRange.min)) {
            return { valid: false, message: "Adjust angle towards target", instruction: "adjust", currentAngle, status: 'transition', color: 'yellow' };
        }
        return { valid: false, message: "Out of range", instruction: "fix form", currentAngle, status: 'error', color: 'red' };
    }

    return { valid: false, message: "No data", currentAngle, status: 'unknown', color: 'gray' };
};

export const getAngleRuleForExercise = async (exerciseName) => {
    const data = parseAllJson();
    if (data) {
        // Find Exercise (Case insensitive partial match)
        const nameKey = Object.keys(data).find(k =>
            k.toLowerCase() === exerciseName.toLowerCase() ||
            exerciseName.toLowerCase().includes(k.toLowerCase()) ||
            k.toLowerCase().includes(exerciseName.toLowerCase())
        );

        if (nameKey) {
            const exData = data[nameKey];
            // Prioritize Side View for most, Front for some
            // If "Squat" or "Lunge", Side is best.
            // If "Raise", Front might be better? But let's stick to Side Right default unless missing
            const views = exData.views || {};
            const viewKey = views.side_right ? 'side_right' : (views.side_left ? 'side_left' : 'front');
            const viewData = views[viewKey];

            if (viewData && viewData.correct && viewData.correct.joints) {
                const joints = viewData.correct.joints;
                const rules = [];

                // Iterate over all available joints (Elbows, Knees, Hips)
                for (const [jointName, stats] of Object.entries(joints)) {
                    let vertex = null, a = null, c = null;

                    // Map Joint Name to Landmarks
                    if (jointName.includes("right_elbow")) { vertex = 14; a = 12; c = 16; }
                    else if (jointName.includes("left_elbow")) { vertex = 13; a = 11; c = 15; }
                    else if (jointName.includes("right_knee")) { vertex = 26; a = 24; c = 28; }
                    else if (jointName.includes("left_knee")) { vertex = 25; a = 23; c = 27; }
                    else if (jointName.includes("right_hip")) { vertex = 24; a = 12; c = 26; }
                    else if (jointName.includes("left_hip")) { vertex = 23; a = 11; c = 25; }
                    else if (jointName.includes("right_shoulder")) { vertex = 12; a = 24; c = 14; }
                    else if (jointName.includes("left_shoulder")) { vertex = 11; a = 23; c = 13; }

                    if (vertex !== null) {
                        const ranges = inferMovementRanges(jointName, stats);
                        rules.push({
                            jointName: jointName,
                            primaryVertex: vertex,
                            landmarkA: a,
                            landmarkC: c,
                            startRaw: ranges.start,
                            endRaw: ranges.end,
                            stats: stats
                        });
                    }
                }

                if (rules.length > 0) {
                    return {
                        name: nameKey,
                        rules: rules // Array of all joint rules
                    };
                }
            }
        }
    }

    // Fallback to Old CSV System (Single Rule)
    const csvPath = getCsvPathForExercise(exerciseName);
    if (!csvPath) return null;

    try {
        const response = await fetch(csvPath);
        const text = await response.text();
        const rows = text.split('\n').map(r => r.trim()).filter(r => r);

        const dataRow = rows.slice(1).find(r => {
            const cols = r.split(',');
            const name = cols[0].replace(/"/g, '').trim();
            return name.toLowerCase() === exerciseName.toLowerCase() || exerciseName.toLowerCase().includes(name.toLowerCase());
        });

        if (!dataRow) return null;
        const cols = dataRow.split(',').map(c => c.replace(/"/g, '').trim());

        return {
            name: cols[0],
            rules: [{
                jointName: "primary",
                primaryVertex: cols[1],
                landmarkA: cols[2],
                landmarkC: cols[3],
                startRaw: cols[4],
                endRaw: cols[5],
                errorCondition: cols[6]
            }]
        };

    } catch (e) {
        console.error("Failed to parse CSV", e);
        return null;
    }
};
