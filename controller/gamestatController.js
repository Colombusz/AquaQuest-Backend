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
        await PlayerStats.findOneAndUpdate(
            { user: id },
            { ...playerStatsData, user: id },
            { new: true, upsert: true }
        );

        await PlayerInventory.findOneAndUpdate(
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

export const GetStatFile = async (req, res) => {
    const { id } = req.params; // User ID

    try {
        const playerStats = await PlayerStats.findOne({ user: id });
        const playerInventory = await PlayerInventory.findOne({ user: id });
        res.status(200).json({ playerStats, playerInventory });
    } catch (error) {
        console.error("Error fetching player data:", error);
        res.status(500).json({ message: "Server error" });
    }
}


export const getLeaderboard = async (req, res) => {
  try {
    const players = await User.find().lean();

    const leaderboard = await Promise.all(
      players.map(async (player) => {
        const inventory = await PlayerInventory.findOne({ user: player._id });
        const stats = await PlayerStats.findOne({ user: player._id });

        return {
          id: player._id,
          name: `${player.first_name} ${player.last_name}`,
          woins: inventory?.Woins || 0,
          email: player.email,  
          kills: {
            KanalGoblin: stats?.Kills.KanalGoblin.TotalKills || 0,
            ElNiño: stats?.Kills.ElNiño.TotalKills || 0,
            PinsalangKinamada: stats?.Kills.PinsalangKinamada.TotalKills || 0,
          },
          overallKills: stats?.Kills.OverallKills || 0,
          powerLevel: stats?.PlayerAttributes.CalculatedPowerLevel || 0,
        };
      })
    );

    leaderboard.sort((a, b) => b.powerLevel - a.powerLevel);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error fetching leaderboard data." });
  }
};
