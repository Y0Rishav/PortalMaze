import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export const HomePage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

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
        <div className="flex flex-col gap-4 max-w-sm w-full">
            <h2 className="text-xl font-semibold">{isRegistering ? 'Register' : 'Login'}</h2>
            {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-sm font-medium">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="border p-2 rounded"
                        placeholder="Enter username"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border p-2 rounded"
                        placeholder="Enter password"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
                    {isRegistering ? 'Create Account' : 'Login'}
                </button>
            </form>

            <div className="text-sm text-center">
                {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                <button 
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError('');
                    }}
                >
                    {isRegistering ? 'Login here' : 'Register here'}
                </button>
            </div>
        </div>
    );
};
