export const EXERCISE_STATS = {
    "Hip Thrust": {
        "info": {
            "target_muscle": "Glutes",
            "category": "Strength"
        },
        "views": {
            "front": {
                "correct": {
                    "joints": {
                        "right_hip_angles": { "mean": 117.5, "std": 38.54, "min_sigma": 40.43, "max_sigma": 194.57, "absolute_min": 29.35, "absolute_max": 179.27 }
                    }
                }
            },
            "side_right": {
                "correct": {
                    "joints": {
                        "right_hip_angles": {
                            "mean": 129.82,
                            "std": 34.45,
                            "min_sigma": 60.93,
                            "max_sigma": 198.72,
                            "absolute_min": 30.0,
                            "absolute_max": 177.87
                        },
                        "right_knee_angles": {
                            "mean": 84.39,
                            "std": 21.73,
                            "min_sigma": 40.93,
                            "max_sigma": 127.85,
                            "absolute_min": 30.65,
                            "absolute_max": 176.02
                        }
                    }
                }
            }
        },
        // Meta-config to help our parser map this to the UI
        "config": {
            "primary_joint": "right_hip_angles",
            "primary_vertex": "Hip (24)", // MediaPipe Right Hip
            "landmarkA": "Shoulder (12)",
            "landmarkC": "Knee (26)",
            // Identify phases based on distribution
            // Hip Thrust is Extension. Target is Max Angle.
            "phase_type": "extension"
        }
    }
};
