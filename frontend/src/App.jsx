import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { LevelSelectPage } from './pages/LevelSelectPage';
import { EditorPage } from './pages/EditorPage';
import { GamePage } from './pages/GamePage';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    
                    <Route path="/menu" element={
                        <ProtectedRoute>
                            <MenuPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/levels" element={
                        <ProtectedRoute>
                            <LevelSelectPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/editor" element={
                        <ProtectedRoute>
                            <EditorPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/play" element={
                        <ProtectedRoute>
                            <GamePage />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
