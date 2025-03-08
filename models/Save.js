import mongoose from 'mongoose';

const SaveModel = new mongoose.Schema({
    month: { 
        type: Date, 
        required: true,
    },
    savedCost: { 
        type: Number, 
        required: true,
    },
    savedConsumption: { 
        type: Number, 
        required: true,
    },
    waterBill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WaterBill',
        required: true, 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    prediction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prediction',
        required: true, 
    },
    claimed: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Save = mongoose.model('Save', SaveModel);
export default Save;