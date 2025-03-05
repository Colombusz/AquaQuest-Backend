import mongoose from "mongoose";


const PlayerStatsModel = new mongoose.Schema({
    Relics: {
        Health: {
            Name: { type: String, default: "" },
            ItemEffect: { type: Number, default: 0 }
        },
        Damage: {
            Name: { type: String, default: "" },
            ItemEffect: { type: Number, default: 0 }
        },
        Defense: {
            Name: { type: String, default: "" },
            ItemEffect: { type: Number, default: 0 }
        },
        Speed: {
            Name: { type: String, default: "" },
            ItemEffect: { type: Number, default: 0.0 }
        }
    },
    PlayerAttributes: {
        TotalHealth: { type: Number, default: 200 },
        TotalDamage: { type: Number, default: 20 },
        TotalDefense: { type: Number, default: 0 },
        TotalSpeed: { type: Number, default: 10.0 },
        CalculatedPowerLevel: { type: Number, default: 0.0 }
    },
    Kills: {
        KanalGoblin: {
            TotalKills: { type: Number, default: 0 }
        },
        ElNiño: {
            TotalKills: { type: Number, default: 0 }
        },
        PinsalangKinamada: {
            TotalKills: { type: Number, default: 0 }
        },
        OverallKills: { type: Number, default: 0 }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});


const PlayerStats = mongoose.model('PlayerStats', PlayerStatsModel);
export default PlayerStats;