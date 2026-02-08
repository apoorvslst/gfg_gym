
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
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/HLtpC1_O2OU?si=4opvNP5Objez5I3c"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
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
