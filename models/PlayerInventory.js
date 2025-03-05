import mongoose from "mongoose";
import User from "./User.js";

const PlayerInventoryModel = new mongoose.Schema({
    Relics: [{
        type: String,
        default: []
    }],
    Potions: [{
        type: String,
        default: []
    }],
    Woins: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

const PlayerInventory = mongoose.model('PlayerInventory', PlayerInventoryModel);
export default PlayerInventory;