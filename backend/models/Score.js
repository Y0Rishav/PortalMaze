import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
    levelId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Level', 
        required: true 
    },
    playerName: { 
        type: String,
        required: true 
    },
    steps: { 
        type: Number,
        required: true 
    },
    time: { 
        type: Number,
        required: true 
    },
    efficiency: { 
        type: Number,
        required: true 
    }, 
    createdAt: { 
        type: Date,
        default: Date.now 
    }
});

export default mongoose.model('Score', scoreSchema);