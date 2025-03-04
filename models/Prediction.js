import mongoose from 'mongoose';

const PredictionlModel = new mongoose.Schema({
    predictedAmount: { 
        type: Number, 
        required: true 
    },
    predictedConsumption: { 
        type: Number, 
        required: true 
    },
    predictedMonth: { 
        type: Date, 
        required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    }
}, { timestamps: true });

const Prediction = mongoose.model('Prediction', PredictionlModel);
export default Prediction;