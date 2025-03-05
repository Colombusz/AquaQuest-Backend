import PlayerStats from "../models/PlayerStats.js";
import PlayerInventory from "../models/PlayerInventory.js";
import User from "../models/User.js";

export const CreateStatFile = async (req, res) => {
    const { id } = req.params; // User ID
    const { PlayerStats: playerStatsData, PlayerInventory: playerInventoryData } = req.body;

    try {
        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Upsert (Update if exists, otherwise create)
        const updatedStats = await PlayerStats.findOneAndUpdate(
            { user: id },
            { ...playerStatsData, user: id },
            { new: true, upsert: true }
        );

        const updatedInventory = await PlayerInventory.findOneAndUpdate(
            { user: id },
            { ...playerInventoryData, user: id },
            { new: true, upsert: true }
        );

        res.status(201).json({ message: "SENTTTTT" });
    } catch (error) {
        console.error("Error saving player data:", error);
        res.status(500).json({ message: "Server error" });
    }

    
};
