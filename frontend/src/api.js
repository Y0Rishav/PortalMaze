import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
    
    // Levels
    getLevels: () => axios.get(`${API_BASE_URL}/levels`).then(res => res.data),

    createLevel: (level) => axios.post(`${API_BASE_URL}/levels`, level).then(res => res.data),

    // Scores
    getLeaderboard: (levelId) => axios.get(`${API_BASE_URL}/scores/${levelId}`).then(res => res.data),
    
    submitScore: (score) => axios.post(`${API_BASE_URL}/scores`, score).then(res => res.data),
};