import Prediction from "../../models/Prediction.js";
import WaterBill from "../../models/WaterBill.js";
import mongoose from 'mongoose';

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getPredictionAccuracy = async (req, res) => {
    try {
        // Fetch all predictions
        const predictions = await Prediction.find().populate("user");
        const waterBills = await WaterBill.find().populate("user");

        let correct = 0;
        let overestimated = 0;
        let underestimated = 0;

        // Map predictions to actual water consumption
        predictions.forEach(pred => {
            const actualBill = waterBills.find(wb => 
                wb.user.toString() === pred.user.toString() && 
                new Date(wb.billDate).getMonth() === new Date(pred.predictedMonth).getMonth()
            );

            if (actualBill) {
                const actual = actualBill.waterConsumption;
                const predicted = pred.predictedConsumption;
                const tolerance = actual * 0.1; // 10% margin

                if (Math.abs(predicted - actual) <= tolerance) {
                    correct++;
                } else if (predicted > actual + tolerance) {
                    overestimated++;
                } else if (predicted < actual - tolerance) {
                    underestimated++;
                }
            }
        });

        res.json({
            correct,
            overestimated,
            underestimated
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPredictionAccuracyForCost = async (req, res) => {
    try {
        // Fetch all predictions
        const predictions = await Prediction.find().populate("user");
        const waterBills = await WaterBill.find().populate("user");

        let correct = 0;
        let overestimated = 0;
        let underestimated = 0;

        // Map predictions to actual bill amounts
        predictions.forEach(pred => {
            const actualBill = waterBills.find(wb => 
                wb.user.toString() === pred.user.toString() && 
                new Date(wb.billDate).getMonth() === new Date(pred.predictedMonth).getMonth()
            );

            if (actualBill) {
                const actual = actualBill.billAmount;
                const predicted = pred.predictedAmount;
                const tolerance = actual * 0.1; // 10% margin

                if (Math.abs(predicted - actual) <= tolerance) {
                    correct++;
                } else if (predicted > actual + tolerance) {
                    overestimated++;
                } else if (predicted < actual - tolerance) {
                    underestimated++;
                }
            }
        });

        res.json({
            correct,
            overestimated,
            underestimated
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const compareActualVsPredictedConsumption = async (req, res) => {
    try {
        // Aggregate predictions grouped by user, month, and year
        const predictions = await Prediction.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $group: {
                    _id: { user: "$user._id", year: { $year: { $toDate: "$predictedMonth" } }, month: { $month: { $toDate: "$predictedMonth" } } },
                    totalPredictedConsumption: { $sum: "$predictedConsumption" },
                    user: { $first: "$user" }
                }
            }
        ]);

        // Aggregate actual water bills grouped by user, month, and year
        const waterBills = await WaterBill.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $group: {
                    _id: { user: "$user._id", year: { $year: { $toDate: "$billDate" } }, month: { $month: { $toDate: "$billDate" } } },
                    totalWaterConsumption: { $sum: "$waterConsumption" },
                    user: { $first: "$user" }
                }
            }
        ]);

        // Convert arrays to objects for easy lookup
        const predictionMap = new Map(predictions.map(p => [`${p._id.user}-${p._id.year}-${p._id.month}`, p]));
        const billMap = new Map(waterBills.map(wb => [`${wb._id.user}-${wb._id.year}-${wb._id.month}`, wb]));

        // Merge data into a single array for the chart
        const result = [];
        const uniqueKeys = new Set([...predictionMap.keys(), ...billMap.keys()]);

        uniqueKeys.forEach(key => {
            const [user, year, month] = key.split('-').map((v, i) => i === 0 ? v : Number(v));
            const predictedConsumption = predictionMap.get(key)?.totalPredictedConsumption || 0;
            const actualConsumption = billMap.get(key)?.totalWaterConsumption || 0;
            const userName = predictionMap.get(key)?.user?.first_name + " " + predictionMap.get(key)?.user?.last_name || billMap.get(key)?.user?.first_name + " " + billMap.get(key)?.user?.last_name || "Unknown";

            if (predictedConsumption !== 0 && actualConsumption !== 0) {
                result.push({
                    user,
                    userName,
                    year,
                    month: monthNames[month - 1], // Convert month number to month name
                    predictedConsumption,
                    actualConsumption
                });
            }
        });

        // Sort data by user, year, and month
        result.sort((a, b) => a.user.localeCompare(b.user) || a.year - b.year || monthNames.indexOf(a.month) - monthNames.indexOf(b.month));

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const compareActualVsPredictedBillAmount = async (req, res) => {
    try {
        // Aggregate predictions grouped by user, month, and year
        const predictions = await Prediction.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $group: {
                    _id: { user: "$user._id", year: { $year: { $toDate: "$predictedMonth" } }, month: { $month: { $toDate: "$predictedMonth" } } },
                    totalPredictedAmount: { $sum: "$predictedAmount" },
                    user: { $first: "$user" }
                }
            }
        ]);

        // Aggregate actual water bills grouped by user, month, and year
        const waterBills = await WaterBill.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $group: {
                    _id: { user: "$user._id", year: { $year: { $toDate: "$billDate" } }, month: { $month: { $toDate: "$billDate" } } },
                    totalBillAmount: { $sum: "$billAmount" },
                    user: { $first: "$user" }
                }
            }
        ]);

        // Convert arrays to objects for easy lookup
        const predictionMap = new Map(predictions.map(p => [`${p._id.user}-${p._id.year}-${p._id.month}`, p]));
        const billMap = new Map(waterBills.map(wb => [`${wb._id.user}-${wb._id.year}-${wb._id.month}`, wb]));

        // Merge data into a single array for the chart
        const result = [];
        const uniqueKeys = new Set([...predictionMap.keys(), ...billMap.keys()]);

        uniqueKeys.forEach(key => {
            const [user, year, month] = key.split('-').map((v, i) => i === 0 ? v : Number(v));
            const predictedAmount = predictionMap.get(key)?.totalPredictedAmount || 0;
            const actualAmount = billMap.get(key)?.totalBillAmount || 0;
            const userName = predictionMap.get(key)?.user?.first_name + " " + predictionMap.get(key)?.user?.last_name || billMap.get(key)?.user?.first_name + " " + billMap.get(key)?.user?.last_name || "Unknown";

            if (predictedAmount !== 0 && actualAmount !== 0) {
                result.push({
                    user,
                    userName,
                    year,
                    month: monthNames[month - 1], // Convert month number to month name
                    predictedAmount,
                    actualAmount
                });
            }
        });

        // Sort data by user, year, and month
        result.sort((a, b) => a.user.localeCompare(b.user) || a.year - b.year || monthNames.indexOf(a.month) - monthNames.indexOf(b.month));

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};