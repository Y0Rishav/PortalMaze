import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../api.js';

export const HomePage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/menu" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            if (isRegistering) {
                await api.register({ username, password });
                //auto login after register
                const data = await api.login({ username, password });
                login(data);
                navigate('/menu');
            } else {
                const data = await api.login({ username, password });
                login(data);
                navigate('/menu');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between min-h-[calc(100vh-8rem)] gap-12">
            {/* Hero Section */}
            <div className="flex-1 max-w-2xl text-center lg:text-left space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Master the Maze. <br />
                        <span className="text-indigo-600">Break the Walls.</span>
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                        Experience a new dimension of puzzle solving.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="font-semibold text-slate-900 mb-1">Strategic Gameplay</div>
                        <p className="text-sm text-slate-500">Plan your moves carefully to escape.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <div className="font-semibold text-slate-900 mb-1">Level Editor</div>
                        <p className="text-sm text-slate-500">Create and challenge your own maps.</p>
                    </div>
                </div>
            </div>

            {/* Auth Section */}
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8">
                        <div className="mb-8 text-center">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {isRegistering ? 'Create Account' : 'Welcome Back'}
                            </h2>
                            <p className="text-slate-500 text-sm mt-2">
                                {isRegistering ? 'Start your journey today' : 'Enter your credentials to continue'}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
                                <div className="text-red-500 mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="text-sm text-red-700 font-medium">{error}</div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-semibold text-slate-700">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="Enter your username"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {isRegistering ? 'Sign Up' : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-center items-center gap-2">
                        <span className="text-sm text-slate-600">
                            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        </span>
                        <button
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                            }}
                        >
                            {isRegistering ? 'Log in' : 'Register'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
