import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
    const { playerName } = useAuth();

    return (
        <ErrorBoundary>
            <div className="p-4 min-h-screen bg-white">
                <header className="mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Portal Maze Game</h1>
                    {playerName && (
                        <div className="text-sm text-gray-600 mt-1">
                            Playing as: <span className="font-semibold">{playerName}</span>
                        </div>
                    )}
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
        </ErrorBoundary>
    );
};
