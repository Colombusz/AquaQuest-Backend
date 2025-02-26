// OG CODE
// import WaterBill from "../models/WaterBill.js";
// import mongoose from "mongoose";

// export const getMonthlyCost = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const result = await WaterBill.aggregate([
//             { $match: { user: new mongoose.Types.ObjectId(userId) } },
//             {
//                 $group: {
//                     _id: { $substr: ["$billDate", 3, 7] }, 
//                     totalCost: { $sum: "$billAmount" },
//                 },
//             },
//             { $sort: { "_id": 1 } } 
//         ]);

//         res.json(result);
//     } catch (error) {
//         console.error("Error fetching monthly cost:", error);
//         res.status(500).json({ error: "Failed to fetch monthly cost.", details: error.message });
//     }
// };

// export const getMonthlyConsumption = async (req, res) => {
//     try {
//         const userId = req.user.id;
// ``
//         const result = await WaterBill.aggregate([
//             { $match: { user: new mongoose.Types.ObjectId(userId) } },
//             {
//                 $group: {
//                     _id: { $substr: ["$billDate", 3, 7] }, 
//                     totalConsumption: { $sum: "$waterConsumption" },
//                 },
//             },
//             { $sort: { "_id": 1 } } 
//         ]);

//         res.json(result);
//     } catch (error) {
//         console.error("Error fetching monthly consumption:", error);
//         res.status(500).json({ error: "Failed to fetch monthly consumption.", details: error.message });
//     }
// };


    import WaterBill from "../models/WaterBill.js";
    import mongoose from "mongoose";
    import axios from "axios";

    // Get Monthly Cost
    export const getMonthlyCost = async (req, res) => {
        try {
            const userId = req.user.id;

            const result = await WaterBill.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: { $substr: ["$billDate", 3, 7] }, 
                        totalCost: { $sum: "$billAmount" },
                    },
                },
                { $sort: { "_id": 1 } } 
            ]);

            res.json(result);
        } catch (error) {
            console.error("Error fetching monthly cost:", error);
            res.status(500).json({ error: "Failed to fetch monthly cost.", details: error.message });
        }
    };

    // Get Monthly Consumption
    export const getMonthlyConsumption = async (req, res) => {
        try {
            const userId = req.user.id;

            const result = await WaterBill.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: { $substr: ["$billDate", 3, 7] }, 
                        totalConsumption: { $sum: "$waterConsumption" },
                    },
                },
                { $sort: { "_id": 1 } } 
            ]);

            res.json(result);
        } catch (error) {
            console.error("Error fetching monthly consumption:", error);
            res.status(500).json({ error: "Failed to fetch monthly consumption.", details: error.message });
        }
    };

    // Get Predicted Cost
    export const getPredictedCost = async (req, res) => {
        try {
            const userId = req.user.id;

            // Fetch user's water bills
            const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

            if (userBills.length === 0) {
                return res.status(400).json({ error: "No water bills found for this user." });
            }

            // Prepare data for Flask API
            const pastData = userBills.map(entry => ({
                month: entry.billDate,
                cost: entry.billAmount,
            }));

            // Request prediction from Flask
            const flaskResponse = await axios.post("http://127.0.0.1:5001/api/predict-cost", {
                past_data: pastData,
                months_ahead: 1 
            });

            return res.json({
                predictedCost: flaskResponse.data.predicted_costs[0]
            });

        } catch (error) {
            console.error("Error fetching predicted cost:", error.message);
            res.status(500).json({ error: "Failed to fetch predicted cost.", details: error.message });
        }
    };

    // Get Predicted Consumption
    export const getPredictedConsumption = async (req, res) => {
        try {
            const userId = req.user.id;

            // Fetch user's water bills
            const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

            if (userBills.length === 0) {
                return res.status(400).json({ error: "No water bills found for this user." });
            }

            // Prepare data for Flask API
            const pastData = userBills.map(entry => ({
                month: entry.billDate,
                consumption: entry.waterConsumption,
            }));

            // Request prediction from Flask
            const flaskResponse = await axios.post("http://127.0.0.1:5001/api/predict-consumption", {
                past_data: pastData,
                months_ahead: 1 
            });

            return res.json({
                predictedConsumption: flaskResponse.data.predicted_consumptions[0]
            });

        } catch (error) {
            console.error("Error fetching predicted consumption:", error.message);
            res.status(500).json({ error: "Failed to fetch predicted consumption.", details: error.message });
        }
    };

