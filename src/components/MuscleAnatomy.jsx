import React, { useState } from 'react';

const muscleData = {
    leftShoulder: {
        name: 'Left Shoulder (Deltoid)',
        exercises: ['Shoulder Press', 'Lateral Raises', 'Front Raises'],
        path: 'M 220 140 Q 200 120 180 140 Q 170 160 180 180 Q 200 190 220 180 Q 230 160 220 140 Z'
    },
    rightShoulder: {
        name: 'Right Shoulder (Deltoid)',
        exercises: ['Shoulder Press', 'Lateral Raises', 'Front Raises'],
        path: 'M 380 140 Q 400 120 420 140 Q 430 160 420 180 Q 400 190 380 180 Q 370 160 380 140 Z'
    },
    chest: {
        name: 'Chest (Pectoralis)',
        exercises: ['Push-ups', 'Bench Press', 'Chest Flyes'],
        path: 'M 250 180 Q 240 160 260 150 L 340 150 Q 360 160 350 180 L 340 220 Q 330 240 300 240 Q 270 240 260 220 Z'
    },
    leftBicep: {
        name: 'Left Bicep',
        exercises: ['Bicep Curls', 'Hammer Curls', 'Concentration Curls'],
        path: 'M 200 200 Q 190 220 195 250 Q 200 270 210 280 Q 220 270 225 250 Q 230 220 220 200 Z'
    },
    rightBicep: {
        name: 'Right Bicep',
        exercises: ['Bicep Curls', 'Hammer Curls', 'Concentration Curls'],
        path: 'M 400 200 Q 410 220 405 250 Q 400 270 390 280 Q 380 270 375 250 Q 370 220 380 200 Z'
    },
    leftTricep: {
        name: 'Left Tricep',
        exercises: ['Tricep Dips', 'Overhead Extension', 'Kickbacks'],
        path: 'M 225 200 Q 235 220 240 250 Q 245 270 250 280 Q 255 270 258 250 Q 260 220 255 200 Z'
    },
    rightTricep: {
        name: 'Right Tricep',
        exercises: ['Tricep Dips', 'Overhead Extension', 'Kickbacks'],
        path: 'M 375 200 Q 365 220 360 250 Q 355 270 350 280 Q 345 270 342 250 Q 340 220 345 200 Z'
    },
    leftForearm: {
        name: 'Left Forearm',
        exercises: ['Wrist Curls', 'Reverse Curls', 'Farmer Walks'],
        path: 'M 210 290 Q 205 310 208 340 Q 212 360 220 370 Q 228 360 232 340 Q 235 310 230 290 Z'
    },
    rightForearm: {
        name: 'Right Forearm',
        exercises: ['Wrist Curls', 'Reverse Curls', 'Farmer Walks'],
        path: 'M 390 290 Q 395 310 392 340 Q 388 360 380 370 Q 372 360 368 340 Q 365 310 370 290 Z'
    },
    abs: {
        name: 'Abdominals',
        exercises: ['Crunches', 'Planks', 'Leg Raises'],
        path: 'M 270 250 L 330 250 L 330 350 Q 325 360 300 360 Q 275 360 270 350 Z'
    },
    leftOblique: {
        name: 'Left Oblique',
        exercises: ['Side Planks', 'Russian Twists', 'Bicycle Crunches'],
        path: 'M 260 260 Q 250 280 255 310 Q 260 330 270 340 L 270 260 Z'
    },
    rightOblique: {
        name: 'Right Oblique',
        exercises: ['Side Planks', 'Russian Twists', 'Bicycle Crunches'],
        path: 'M 340 260 Q 350 280 345 310 Q 340 330 330 340 L 330 260 Z'
    },
    leftQuad: {
        name: 'Left Quadriceps',
        exercises: ['Squats', 'Lunges', 'Leg Extensions'],
        path: 'M 260 370 Q 250 400 255 450 Q 260 500 270 550 Q 280 540 285 500 Q 290 450 285 400 Q 280 370 270 370 Z'
    },
    rightQuad: {
        name: 'Right Quadriceps',
        exercises: ['Squats', 'Lunges', 'Leg Extensions'],
        path: 'M 340 370 Q 350 400 345 450 Q 340 500 330 550 Q 320 540 315 500 Q 310 450 315 400 Q 320 370 330 370 Z'
    },
    leftCalf: {
        name: 'Left Calf',
        exercises: ['Calf Raises', 'Jump Rope', 'Box Jumps'],
        path: 'M 270 560 Q 265 590 268 630 Q 272 660 280 680 Q 288 660 292 630 Q 295 590 290 560 Z'
    },
    rightCalf: {
        name: 'Right Calf',
        exercises: ['Calf Raises', 'Jump Rope', 'Box Jumps'],
        path: 'M 330 560 Q 335 590 332 630 Q 328 660 320 680 Q 312 660 308 630 Q 305 590 310 560 Z'
    }
};

export default function MuscleAnatomy() {
    const [hoveredMuscle, setHoveredMuscle] = useState(null);
    const [selectedMuscle, setSelectedMuscle] = useState(null);

    return (
        <div className="relative w-full h-full">
            {/* Muscle Anatomy Image */}
            <div className="relative w-full h-full">
                <img
                    src="/muscle-anatomy.jpg"
                    alt="Human Muscle Anatomy"
                    className="w-full h-full object-contain"
                />

                {/* SVG Overlay for Muscle Highlighting */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 600 900"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {Object.entries(muscleData).map(([key, muscle]) => (
                        <path
                            key={key}
                            d={muscle.path}
                            className={`transition-all duration-300 pointer-events-auto cursor-pointer ${hoveredMuscle === key
                                    ? 'fill-red-500/40 stroke-red-600 stroke-2'
                                    : 'fill-transparent stroke-transparent hover:fill-red-400/20'
                                }`}
                            onMouseEnter={() => setHoveredMuscle(key)}
                            onMouseLeave={() => setHoveredMuscle(null)}
                            onClick={() => setSelectedMuscle(key)}
                        />
                    ))}
                </svg>
            </div>

            {/* Exercise Modal */}
            {selectedMuscle && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedMuscle(null)}
                >
                    <div
                        className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {muscleData[selectedMuscle].name}
                            </h3>
                            <button
                                onClick={() => setSelectedMuscle(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <h4 className="text-lg font-semibold text-gray-700 mb-4">Recommended Exercises:</h4>
                        <ul className="space-y-3">
                            {muscleData[selectedMuscle].exercises.map((exercise, index) => (
                                <li key={index} className="flex items-center text-gray-700">
                                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                                        {index + 1}
                                    </span>
                                    <span className="text-lg">{exercise}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => setSelectedMuscle(null)}
                            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
