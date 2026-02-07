
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section - Split Layout */}
            <section id="hero" className="min-h-screen flex items-center px-4 py-12 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Half - Content */}
                    <div className="space-y-8 text-left z-10" data-aos="fade-right">
                        <div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                                Recover Stronger with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Physio Friend</span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-lg">
                                Your personal AI assistant for smarter recovery. Track your progress,
                                receive personalized exercises, and correct your form in real-time.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link
                                to="/signup"
                                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200/50 text-lg flex justify-center items-center"
                            >
                                Start Recovery Now
                            </Link>
                            <a
                                href="#video"
                                className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 font-bold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all text-lg flex justify-center items-center"
                            >
                                Watch Demo
                            </a>
                        </div>

                        <div className="flex items-center gap-4 text-sm font-medium text-gray-500 pt-4">
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                AI Posture Analysis
                            </div>
                            <div className="flex items-center">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                Personalized Plans
                            </div>
                        </div>
                    </div>

                    {/* Right Half - Hero Image */}
                    <div className="relative lg:h-[600px] flex items-center justify-center p-4">
                        <div className="relative z-10 w-full max-w-md lg:max-w-full">
                            <img
                                src="/hero-image.jpg"
                                alt="Physiotherapy Exercise"
                                className="w-full h-auto object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>
                        {/* Decorative Background Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 rounded-full blur-3xl -z-10 opacity-60"></div>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section id="video" className="py-24 bg-gray-100 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">How It Works</h2>
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center">
                        <div className="text-white text-center p-8">
                            <svg className="w-20 h-20 mx-auto mb-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xl font-medium">Instructional Video Demo</p>
                            <p className="text-gray-400 mt-2">See how Physio Friend guides you through your exercises.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Posture Analyzer Section */}
            <section id="posture" className="py-24 px-4 bg-white">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">AI Posture Tracker</h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Our advanced computer vision technology checks your form in real-time.
                            Get immediate feedback on your posture to prevent injuries and maximize exercise effectiveness.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Real-time joint detection",
                                "Angle calculation for perfect form",
                                "Instant audio & visual corrective cues",
                                "Progress tracking metrics"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center text-gray-700">
                                    <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link to="/exercises" className="inline-block mt-10 px-8 py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                            Try Tracker Now
                        </Link>
                    </div>
                    <div className="bg-blue-50 rounded-3xl p-8 border-4 border-blue-100 shadow-inner">
                        <div className="aspect-square bg-gray-200 rounded-xl relative overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-400">
                            <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                                <div className="w-1/2 h-4/5 border-2 border-blue-500 rounded-full flex flex-col items-center justify-around p-4">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full"></div>
                                    <div className="w-1 h-32 bg-blue-500"></div>
                                    <div className="flex gap-12">
                                        <div className="w-1 h-24 bg-blue-500 rotate-12"></div>
                                        <div className="w-1 h-24 bg-blue-500 -rotate-12"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                                LIVE FORM CHECK
                            </div>
                            <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg shadow text-sm">
                                <p className="font-bold text-blue-600">Shoulder Angle: 172°</p>
                                <p className="text-gray-500 italic">"Keep your back straight"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer / CTA Section */}
            <section className="py-20 bg-blue-600 text-white text-center px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to improve your mobility?</h2>
                <Link
                    to="/signup"
                    className="inline-block px-10 py-5 bg-white text-blue-600 font-bold rounded-xl text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
                >
                    Join Physio Friend Today
                </Link>
            </section>
        </div>
    );
}
