import React from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ExerciseCard from '../components/ExerciseCard';
import { exercisesData } from '../data/exercisesData';

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function GymExercises() {
    return (
        <PageTransition className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl font-extrabold text-gray-900 mb-4"
                    >
                        Gym Exercises
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Comprehensive exercise library organized by muscle groups. Click "View Details" to see descriptions, demo videos, and analyze your form.
                    </motion.p>
                </div>

                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4">
                        Upper Body: Push & Pull
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <ExerciseCard muscleGroup={exercisesData.upperBody.shoulders} />
                        <ExerciseCard muscleGroup={exercisesData.upperBody.chest} />
                        <ExerciseCard muscleGroup={exercisesData.upperBody.lats} />
                        <ExerciseCard muscleGroup={exercisesData.upperBody.traps} />
                    </div>
                </motion.section>

                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-green-600 pl-4">
                        Arms & Forearms
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ExerciseCard muscleGroup={exercisesData.arms.biceps} />
                        <ExerciseCard muscleGroup={exercisesData.arms.triceps} />
                        <ExerciseCard muscleGroup={exercisesData.arms.forearms} />
                    </div>
                </motion.section>

                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-purple-600 pl-4">
                        Core & Lower Back
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ExerciseCard muscleGroup={exercisesData.core.abs} />
                        <ExerciseCard muscleGroup={exercisesData.core.obliques} />
                        <ExerciseCard muscleGroup={exercisesData.core.lowerBack} />
                    </div>
                </motion.section>

                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-12"
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-orange-600 pl-4">
                        Lower Body
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                        <ExerciseCard muscleGroup={exercisesData.lowerBody.glutes} />
                        <ExerciseCard muscleGroup={exercisesData.lowerBody.quads} />
                        <ExerciseCard muscleGroup={exercisesData.lowerBody.hamstrings} />
                        <ExerciseCard muscleGroup={exercisesData.lowerBody.calves} />
                    </div>
                </motion.section>
            </div>
        </PageTransition>
    );
}
