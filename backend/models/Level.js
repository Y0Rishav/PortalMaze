import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true 
    },
    description: { 
        type: String,
        required: true 
    },
    creator: { 
        type: String,
        required: true 
    },
    maze: { 
        type: [[Object]],
        required: true 
    },
    k: { 
        type: Number,
        required: true 
    }, 
    parNWB: { 
        type: Number,
        required: true 
    },
    parWB: { 
        type: Number,
        required: true 
    },
    createdAt: { 
        type: Date,
        default: Date.now 
    }
});

export default mongoose.model('Level', levelSchema);