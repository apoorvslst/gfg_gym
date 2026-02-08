import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { physioData } from '../data/physioData';
import PageTransition from '../components/PageTransition';
import { ArrowLeft, Play, Clock, Target } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Physio() {
    const navigate = useNavigate();
    const [selectedMuscle, setSelectedMuscle] = useState(null);

    if (selectedMuscle) {
        return (
            <PageTransition className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => {
                            setSelectedMuscle(null);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Muscle Groups
                    </button>

                    <div className="mb-10 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black text-gray-900 mb-4"
                        >
                            {selectedMuscle.name}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-600 max-w-2xl mx-auto"
                        >
                            {selectedMuscle.focus}
                        </motion.p>
                    </div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {selectedMuscle.exercises.map((exercise, index) => (
                            <motion.div
                                key={index}
                                variants={item}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                            >
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

                                        <div className="flex items-start">
                                            <div className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0 text-blue-500">
                                                👥
                                            </div>
                                            <div className="ml-3">
                                                <span className="text-sm font-semibold text-gray-500 block">Age Range</span>
                                                <span className="text-gray-900">{exercise.ageRange || 'All Ages'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-700 text-sm leading-relaxed">{exercise.description}</p>
                                    </div>

                                    {/* Inline Tracker */}
                                    {/* Tracker Button */}
                                    <div className="mt-6">
                                        <button
                                            onClick={() => navigate(`/pose-estimation/${encodeURIComponent(exercise.name)}`, { state: { mode: 'physio' } })}
                                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                        >
                                            🎯 Start Advanced Tracker
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
                    >
                        Physiotherapy <span className="text-blue-600">Library</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Select a muscle group to view prescribed rehabilitation exercises, demonstrations, and guidelines.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {physioData.map((muscle) => (
                        <motion.button
                            key={muscle.id}
                            variants={item}
                            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedMuscle(muscle)}
                            className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden text-left border border-gray-100 h-80 w-full"
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
                        </motion.button>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    );
}
