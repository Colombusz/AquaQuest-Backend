import mongoose from 'mongoose';

const WaterBillModel = new mongoose.Schema({
    imageUrl: { 
        type: String, 
        required: true 
    },

    billAmount: { 
        type: Number, 
        required: true 
    },

    waterConsumption: { 
        type: Number, 
        required: true 
    },
    billDate: { 
        type: String, 
        required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    }
    
}, { timestamps: true });


// Export the model using ES module syntax
const WaterBill = mongoose.model('WaterBill', WaterBillModel);
export default WaterBill;