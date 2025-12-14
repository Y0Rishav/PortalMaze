import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', (await import('./routes/auth.js')).default);
app.use('/api/levels', (await import('./routes/levels.js')).default);

app.use('/api/scores', (await import('./routes/scores.js')).default);

export default app;
