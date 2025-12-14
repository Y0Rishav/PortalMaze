import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const MenuPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-8">
            <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Main Menu</h2>
                <p className="text-slate-500 text-lg">Choose your next move</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button
                    onClick={() => navigate('/levels')}
                    className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative">
                        <div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">Play Levels</h3>
                        <p className="text-slate-500 leading-relaxed">Challenge yourself with pre-designed puzzles. Test your logic and navigation skills in increasingly difficult mazes.</p>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/editor')}
                    className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative">
                        <div className="h-14 w-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Map Builder</h3>
                        <p className="text-slate-500 leading-relaxed">Unleash your creativity. Create your own impossible mazes using the editor and share them with others.</p>
                    </div>
                </button>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};
