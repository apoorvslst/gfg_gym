import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = React.useState('');

    async function handleLogout() {
        setError('');
        try {
            await logout();
            navigate('/login');
        } catch {
            setError('Failed to log out');
        }
    }

    const isHome = location.pathname === '/';

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-black tracking-tighter text-blue-600">
                            PHYSIO<span className="text-gray-900">FRIEND</span>
                        </Link>

                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            {isHome ? (
                                <>
                                    <a href="#video" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">How it Works</a>
                                    <a href="#posture" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Analyzer</a>
                                </>
                            ) : (
                                <Link to="/" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Home</Link>
                            )}
                            <Link to="/physio" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Physio</Link>
                            <Link to="/exercises" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Exercises</Link>
                            <Link to="/tracker" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Tracker</Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <span className="text-gray-600 text-sm hidden lg:block">{currentUser.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-6 rounded-full transition-all"
                                >
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-semibold px-4">Log In</Link>
                                <Link
                                    to="/signup"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-full transition-all shadow-md active:scale-95"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
