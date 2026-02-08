import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExerciseCard({ muscleGroup }) {
    const [expandedExercise, setExpandedExercise] = useState(null);
    const navigate = useNavigate();

    const toggleExpand = (exerciseName) => {
        setExpandedExercise(expandedExercise === exerciseName ? null : exerciseName);
    };

    const handleAnalyzeClick = (exerciseName) => {
        navigate(`/pose-estimation/${encodeURIComponent(exerciseName)}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{muscleGroup.name}</h3>

            <div className="space-y-3">
                {muscleGroup.exercises.map((exercise, index) => (
                    <div key={index} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold text-gray-800">{exercise.name}</h4>
                            <button
                                onClick={() => toggleExpand(exercise.name)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                            >
                                {expandedExercise === exercise.name ? 'Hide Details' : 'View Details'}
                            </button>
                        </div>

                        {expandedExercise === exercise.name && (
                            <div className="mt-4 space-y-4 animate-fadeIn">
                                <p className="text-gray-600 leading-relaxed">{exercise.description}</p>

                                {/* Demo Video */}
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={exercise.videoUrl}
                                        title={exercise.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>

                                {/* Analyze Button */}
                                <button
                                    onClick={() => handleAnalyzeClick(exercise.name)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                                >
                                    🎯 Analyze My Form
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
