// filepath: c:\Users\Danniel\Documents\GitHub\AquaQuest-Backend\controller\admin\statsController.js
import PlayerStats from "../../models/PlayerStats.js";
import PlayerInventory from "../../models/PlayerInventory.js";
import User from "../../models/User.js";
import Save from "../../models/Save.js";

export const getPlayerKillStats = async (req, res) => {
    try {
        // Fetch all player stats and populate user data
        const playerStats = await PlayerStats.find().populate("user", "first_name last_name");

        // Format data for the stacked bar graph
        const formattedData = playerStats.map((player) => ({
            playerName: `${player.user.first_name} ${player.user.last_name}`,
            kanalGoblinKills: player.Kills.KanalGoblin.TotalKills,
            elNinoKills: player.Kills.ElNiño.TotalKills,
            pinsalangKinamadaKills: player.Kills.PinsalangKinamada.TotalKills,
            overallKills: player.Kills.OverallKills, // Can be used for sorting
        }));

        // Sort by overall kills in descending order (most kills first)
        formattedData.sort((a, b) => b.overallKills - a.overallKills);

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching player stats", error });
    }
};

export const getTotalSavedCost = async (req, res) => {
    try {
        const totalSavedCost = await Save.aggregate([
            {
                $group: {
                    _id: null,
                    totalSavedCost: { $sum: '$savedCost' },
                },
            },
        ]);

        const roundedTotalSavedCost = totalSavedCost[0]?.totalSavedCost
            ? parseFloat(totalSavedCost[0].totalSavedCost.toFixed(2))
            : 0;

        res.json({ totalSavedCost: roundedTotalSavedCost });
    } catch (error) {
        console.error('❌ Error fetching total saved cost:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getAvgSavingsPerUser = async (req, res) => {
    try {
        const userSavings = await Save.aggregate([
            {
                $group: {
                    _id: '$user',
                    avgSavedCost: { $avg: '$savedCost' },
                },
            },
        ]);

        const totalAvgSavings = userSavings.reduce((acc, user) => acc + user.avgSavedCost, 0);
        const avgSavingsPerUser = totalAvgSavings / userSavings.length;

        const roundedAvgSavingsPerUser = parseFloat(avgSavingsPerUser.toFixed(2));

        res.json({ avgSavingsPerUser: roundedAvgSavingsPerUser });
    } catch (error) {
        console.error('❌ Error fetching average savings per user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getTotalMoneySavedOverTime = async (req, res) => {
    try {
        const totalMoneySavedOverTime = await Save.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$month" } },
                    totalSavedCost: { $sum: "$savedCost" },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        const formattedData = totalMoneySavedOverTime.map((item) => ({
            month: item._id,
            totalSavedCost: parseFloat(item.totalSavedCost.toFixed(2)),
        }));

        res.json(formattedData);
    } catch (error) {
        console.error("❌ Error fetching total money saved over time:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getTotalWoins = async (req, res) => {
    try {
        const totalWoins = await PlayerInventory.aggregate([
            { $group: { _id: null, total: { $sum: "$Woins" } } }
        ]);
        
        res.status(200).json({ totalWoins: totalWoins[0]?.total || 0 });
    } catch (error) {
        res.status(500).json({ message: "Error fetching total Woins", error });
    }
};


export const getTotalRelics = async (req, res) => {
    try {
        const totalRelics = await PlayerInventory.aggregate([
            { $unwind: "$Relics" },  // Flatten the array
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        res.status(200).json({ totalRelics: totalRelics[0]?.count || 0 });
    } catch (error) {
        res.status(500).json({ message: "Error fetching total relics", error });
    }
};


export const getTotalPotions = async (req, res) => {
    try {
        const totalPotions = await PlayerInventory.aggregate([
            { $unwind: "$Potions" },  // Flatten the array
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        res.status(200).json({ totalPotions: totalPotions[0]?.count || 0 });
    } catch (error) {
        res.status(500).json({ message: "Error fetching total potions", error });
    }
};

export const getPlayerInventoryList = async (req, res) => {
    try {
        // Fetch player inventory and populate user data
        const playerInventories = await PlayerInventory.find()
            .populate("user", "first_name last_name") // Retrieve first & last name
            .lean();

        // Format the response to include full name
        const formattedData = playerInventories.map((inventory) => ({
            playerName: inventory.user 
                ? `${inventory.user.first_name} ${inventory.user.last_name}` 
                : "Unknown", // Fixing the "Unknown" issue
            woins: inventory.Woins || 0,
            relics: inventory.Relics?.join(", ") || "None",
            potions: inventory.Potions?.join(", ") || "None",
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching player inventory list", error });
    }
};

export const getPlayerInventoryStats = async (req, res) => {
    try {
        // Fetch top 5 players sorted by Power Level
        const topPlayers = await PlayerStats.find()
            .populate("user", "first_name last_name") // Get player names
            .sort({ "PlayerAttributes.CalculatedPowerLevel": -1 }) // Sort by Power Level
            .limit(5); // Get top 5 players

        // Fetch inventory data for these players
        const playerIds = topPlayers.map(player => player.user._id);
        const inventories = await PlayerInventory.find({ user: { $in: playerIds } });

        // Map inventory data into Radar Chart format
        const stats = topPlayers.map(player => {
            const inventory = inventories.find(inv => inv.user.toString() === player.user._id.toString()) || { Relics: [], Potions: [] };

            return {
                name: `${player.user.first_name} ${player.user.last_name}`,
                Relics: inventory.Relics.length || 0,
                Potions: inventory.Potions.length || 0,
            };
        });

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Error fetching top player inventory stats", error });
    }
};

export const getWoinsDistribution = async (req, res) => {
    try {
        const players = await PlayerInventory.find();
        const bins = { "0-100": 0, "101-500": 0, "501-1000": 0, "1001-5000": 0, "5001+": 0 };

        players.forEach(player => {
            const woins = player.Woins || 0;
            if (woins <= 100) bins["0-100"]++;
            else if (woins <= 500) bins["101-500"]++;
            else if (woins <= 1000) bins["501-1000"]++;
            else if (woins <= 5000) bins["1001-5000"]++;
            else bins["5001+"]++;
        });

        const formattedData = Object.keys(bins).map(range => ({ range, count: bins[range] }));
        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching Woins distribution", error });
    }
};
