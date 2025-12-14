import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Layout } from './components/Layout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { MenuPage } from './pages/MenuPage.jsx';
import { LevelSelectPage } from './pages/LevelSelectPage.jsx';
import { EditorPage } from './pages/EditorPage.jsx';
import { GamePage } from './pages/GamePage.jsx';

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
