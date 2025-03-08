import WaterBill from "../models/WaterBill.js";
import Prediction from "../models/Prediction.js";
import Save from "../models/Save.js"; 
import mongoose from "mongoose";
// WORKING
// export const savePredictedVsActual = async (req, res) => {
//     try {
//         const userId = req.user.id; // Assuming user is authenticated via middleware

//         if (!userId) {
//             return res.status(400).json({ message: "User ID is required." });
//         }

//         // Fetch all water bills of the logged-in user
//         const waterBills = await WaterBill.find({ user: userId });

//         for (const bill of waterBills) {
//             // Extract year and month from billDate
//             const billDate = new Date(bill.billDate);
//             const billYear = billDate.getUTCFullYear();
//             const billMonth = billDate.getUTCMonth(); // 0-based index

//             // Construct the start and end range for the month in UTC
//             const monthStart = new Date(Date.UTC(billYear, billMonth, 1));
//             const monthEnd = new Date(Date.UTC(billYear, billMonth + 1, 1)); // Start of next month

//             // Find the corresponding prediction for the same user and exact month
//             const prediction = await Prediction.findOne({
//                 user: userId,
//                 predictedMonth: { $gte: monthStart, $lt: monthEnd } // Matches any day within the same month
//             });

//             if (!prediction) {
//                 console.log(`❌ No matching prediction found for WaterBill ID: ${bill._id} with date ${billDate.toISOString().slice(0, 10)}`);
//                 continue;
//             }

//             // Calculate savings
//             const savedCost = bill.billAmount - prediction.predictedAmount;
//             const savedConsumption = bill.waterConsumption - prediction.predictedConsumption;

//             // Save the data in the Save model
//             const newSave = new Save({
//                 month: monthStart, // Ensure it is stored as a UTC date
//                 savedCost,
//                 savedConsumption,
//                 waterBill: bill._id,
//                 user: userId,
//                 prediction: prediction._id
//             });

//             await newSave.save();
//             console.log(`✅ Saved record for WaterBill ID: ${bill._id} for month: ${monthStart.toISOString().slice(0, 7)}`);
//         }

//         res.status(200).json({ message: "All matching records processed." });

//     } catch (error) {
//         console.error("❗ Error saving predicted vs actual data:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// };

export const savePredictedVsActual = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // Fetch all water bills of the logged-in user
        const waterBills = await WaterBill.find({ user: userId });

        for (const bill of waterBills) {
            const billDate = new Date(bill.billDate);
            const billYear = billDate.getUTCFullYear();
            const billMonth = billDate.getUTCMonth();

            // Construct the start and end range for the month
            const monthStart = new Date(Date.UTC(billYear, billMonth, 1));
            const monthEnd = new Date(Date.UTC(billYear, billMonth + 1, 1));

            // Find if the record already exists in `Save` model
            const existingSave = await Save.findOne({
                user: userId,
                month: monthStart, // Ensuring it's checking by month
                waterBill: bill._id
            });

            if (existingSave) {
                console.log(`⚠️ Skipping duplicate entry for WaterBill ID: ${bill._id} for month: ${monthStart.toISOString().slice(0, 7)}`);
                continue; // Skip insertion
            }

            // Find the corresponding prediction
            const prediction = await Prediction.findOne({
                user: userId,
                predictedMonth: { $gte: monthStart, $lt: monthEnd }
            });

            if (!prediction) {
                console.log(`❌ No matching prediction found for WaterBill ID: ${bill._id} with date ${billDate.toISOString().slice(0, 10)}`);
                continue;
            }

            // Calculate savings
            const savedCost = bill.billAmount - prediction.predictedAmount;
            const savedConsumption = bill.waterConsumption - prediction.predictedConsumption;

            // Save the data in the Save model
            const newSave = new Save({
                month: monthStart,
                savedCost,
                savedConsumption,
                waterBill: bill._id,
                user: userId,
                prediction: prediction._id
            });

            await newSave.save();
            console.log(`✅ Saved record for WaterBill ID: ${bill._id} for month: ${monthStart.toISOString().slice(0, 7)}`);
        }

        res.status(200).json({ message: "All matching records processed." });

    } catch (error) {
        console.error("❗ Error saving predicted vs actual data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
};


export const getMonthlySaved = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await Save.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $substr: ["$month", 0, 7] },
                    totalCost: { $sum: "$savedCost" },
                },
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json(result);
    } catch (error) {
        console.error("Error fetching monthly saved cost:", error);
        res.status(500).json({ error: "Failed to fetch monthly saved cost.", details: error.message });
    }
};