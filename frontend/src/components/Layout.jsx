import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
    const { playerName } = useAuth();

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
                <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Portal Maze</h1>
                            </div>
                            {playerName && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Playing as</span>
                                    <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                                        <span className="text-sm font-semibold text-slate-700">{playerName}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </main>
            </div>
        </ErrorBoundary>
    );
};
