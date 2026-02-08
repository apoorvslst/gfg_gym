import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { physioData } from '../data/physioData';
import { ArrowLeft, Play, Clock, Target } from 'lucide-react';

export default function Physio() {
    const [selectedMuscle, setSelectedMuscle] = useState(null);
    const navigate = useNavigate();

    const handleAnalyzeClick = (exerciseName) => {
        navigate(`/pose-estimation/${encodeURIComponent(exerciseName)}`);
    };


    if (selectedMuscle) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => setSelectedMuscle(null)}
                        className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Muscle Groups
                    </button>

                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-black text-gray-900 mb-4">{selectedMuscle.name}</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">{selectedMuscle.focus}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {selectedMuscle.exercises.map((exercise, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                <div className="relative aspect-video bg-gray-900">
                                    <iframe
                                        src={`${exercise.videoUrl}?modestbranding=1&rel=0&showinfo=0&controls=1`}
                                        title={exercise.name}
                                        className="absolute top-0 left-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>

                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{exercise.name}</h3>
                                        <span className="flex items-center text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800 uppercase tracking-wide">
                                            Exercise {index + 1}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-start">
                                            <Target className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                            <div className="ml-3">
                                                <span className="text-sm font-semibold text-gray-500 block">Target</span>
                                                <span className="text-gray-900">{exercise.target}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <Clock className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <div className="ml-3">
                                                <span className="text-sm font-semibold text-gray-500 block">Prescription</span>
                                                <span className="text-gray-900 font-mono text-sm">{exercise.prescription}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <p className="text-gray-700 text-sm leading-relaxed">{exercise.description}</p>
                                    </div>

                                    {/* Analyze Button */}
                                    <button
                                        onClick={() => handleAnalyzeClick(exercise.name)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                                    >
                                        🎯 Analyze My Form
                                    </button>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        Physiotherapy <span className="text-blue-600">Library</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Select a muscle group to view prescribed rehabilitation exercises, demonstrations, and guidelines.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {physioData.map((muscle) => (
                        <button
                            key={muscle.id}
                            onClick={() => setSelectedMuscle(muscle)}
                            className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden text-left border border-gray-100 hover:-translate-y-1 h-80 w-full"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={muscle.image}
                                    alt={muscle.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <h3 className="text-2xl font-bold text-white mb-2">{muscle.name}</h3>
                                <p className="text-gray-300 text-sm line-clamp-2 mb-4">{muscle.focus}</p>
                                <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300 transition-colors">
                                    View Exercises
                                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
