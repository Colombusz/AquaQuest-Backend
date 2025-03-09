// OG CODE W/O PREDICTIVE
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





// W/ PREDICTIVE
// import WaterBill from "../models/WaterBill.js";
// import mongoose from "mongoose";
// import axios from "axios";

// // OG 
// export const getMonthlyCost = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const result = await WaterBill.aggregate([
//             { $match: { user: new mongoose.Types.ObjectId(userId) } },
//             {
//                 $group: {
//                     // palitan 6, 4 if ever masira
//                     _id: { $substr: ["$billDate", 0, 7] },
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
// // OG
// export const getMonthlyConsumption = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const result = await WaterBill.aggregate([
//             { $match: { user: new mongoose.Types.ObjectId(userId) } },
//             {
//                 $group: {
//                     // palitan 6, 4 if ever masira
//                     _id: { $substr: ["$billDate", 0, 7] },
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

// export const getPredictedCost = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         // Fetch user's water bills
//         const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

//         if (userBills.length === 0) {
//             return res.status(400).json({ error: "No water bills found for this user." });
//         }

//         // Prepare data for Flask API
//         const pastData = userBills.map(entry => ({
//             month: entry.billDate,
//             cost: entry.billAmount,
//         }));

//         // Request prediction from Flask
//         const flaskResponse = await axios.post("https://aquaquest-flask.onrender.com/api/predict-cost", {
//             past_data: pastData,
//             months_ahead: 1
//         });

//         return res.json({
//             predictedCost: flaskResponse.data.predicted_costs[0]
//         });

//     } catch (error) {
//         console.error("Error fetching predicted cost:", error.message);
//         res.status(500).json({ error: "Failed to fetch predicted cost.", details: error.message });
//     }
// };

// export const getPredictedConsumption = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         // Fetch user's water bills
//         const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

//         if (userBills.length === 0) {
//             return res.status(400).json({ error: "No water bills found for this user." });
//         }

//         // Prepare data for Flask API
//         const pastData = userBills.map(entry => ({
//             month: entry.billDate,
//             consumption: entry.waterConsumption,
//         }));

//         // Request prediction from Flask
//         const flaskResponse = await axios.post("https://aquaquest-flask.onrender.com/api/predict-consumption", {
//             past_data: pastData,
//             months_ahead: 1
//         });

//         return res.json({
//             predictedConsumption: flaskResponse.data.predicted_consumptions[0]
//         });

//     } catch (error) {
//         console.error("Error fetching predicted consumption:", error.message);
//         res.status(500).json({ error: "Failed to fetch predicted consumption.", details: error.message });
//     }
// };




// TRIAL USING GROQ
import WaterBill from "../models/WaterBill.js";
import Prediction from "../models/Prediction.js";
import mongoose from "mongoose";
import axios from "axios";
import { Groq } from "groq-sdk";

// // OG
export const getMonthlyCost = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await WaterBill.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $substr: ["$billDate", 0, 10] },
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

// // OG
export const getMonthlyConsumption = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await WaterBill.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $substr: ["$billDate", 0, 10] },
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

// OG
// export const getPredictedCost = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

//         if (userBills.length === 0) {
//             return res.status(404).json({ error: "No water bills found for this user." });
//         }

//         const pastData = userBills.map(entry => ({
//             month: entry.billDate,
//             cost: entry.billAmount,
//         }));

//         const flaskResponse = await axios.post("https://aquaquest-flask.onrender.com/api/predict-cost", {
//             past_data: pastData,
//             months_ahead: 1
//         });

//         return res.json({ predictedCost: flaskResponse.data.predicted_costs[0] });

//     } catch (error) {
//         console.error("Error fetching predicted cost:", error);
//         res.status(500).json({ error: "Failed to fetch predicted cost.", details: error.message });
//     }
// };

const getNextMonthDate = (lastBillDate) => {
    const currentDate = new Date(lastBillDate);
    currentDate.setMonth(currentDate.getMonth() + 1);

    // Format as YYYY-MM-DD
    return currentDate.toISOString().split("T")[0];
};

export const getPredictedCost = async (req, res) => {
    try {
        const userId = req.user.id;
        const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

        if (userBills.length === 0) {
            return res.status(404).json({ error: "No water bills found for this user." });
        }

        const pastData = userBills.map(entry => ({
            month: entry.billDate,
            cost: entry.billAmount,
        }));

        const flaskResponse = await axios.post("https://aquaquest-flask.onrender.com/api/predict-cost", {
            past_data: pastData,
            months_ahead: 1
        });

        const lastBillDate = new Date(userBills[userBills.length - 1].billDate);
        const nextMonth = getNextMonthDate(lastBillDate);

        return res.json({
            month: nextMonth,
            predictedCost: flaskResponse.data.predicted_costs[0]
        });

    } catch (error) {
        console.error("Error fetching predicted cost:", error);
        res.status(500).json({ error: "Failed to fetch predicted cost.", details: error.message });
    }
};

export const getPredictedConsumption = async (req, res) => {
    try {
        const userId = req.user.id;
        const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

        if (userBills.length === 0) {
            return res.status(404).json({ error: "No water bills found for this user." });
        }

        const pastData = userBills.map(entry => ({
            month: entry.billDate,
            consumption: entry.waterConsumption,
        }));

        const flaskResponse = await axios.post("https://aquaquest-flask.onrender.com/api/predict-consumption", {
            past_data: pastData,
            months_ahead: 1
        });

        const lastBillDate = new Date(userBills[userBills.length - 1].billDate);
        const nextMonth = getNextMonthDate(lastBillDate);

        return res.json({
            month: nextMonth,
            predictedConsumption: flaskResponse.data.predicted_consumptions[0]
        });

    } catch (error) {
        console.error("Error fetching predicted consumption:", error);
        res.status(500).json({ error: "Failed to fetch predicted consumption.", details: error.message });
    }
};

//OG
// export const getPredictedConsumption = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

//         if (userBills.length === 0) {
//             return res.status(404).json({ error: "No water bills found for this user." });
//         }

//         const pastData = userBills.map(entry => ({
//             month: entry.billDate,
//             consumption: entry.waterConsumption,
//         }));

//         const flaskResponse = await axios.post("https://aquaquest-flask.onrender.com/api/predict-consumption", {
//             past_data: pastData,
//             months_ahead: 1
//         });

//         return res.json({ predictedConsumption: flaskResponse.data.predicted_consumptions[0] });

//     } catch (error) {
//         console.error("Error fetching predicted consumption:", error);
//         res.status(500).json({ error: "Failed to fetch predicted consumption.", details: error.message });
//     }
// };

// WORKING NALABAS NA SA CONSOLE RESPONSE NI GROQ
const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


// // OG
export const getWaterSavingTips = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!process.env.GROQ_API_KEY) {
            console.error("Error: Groq API key is missing.");
            return res.status(500).json({ error: "Groq API key is missing." });
        }

        // Fetch user's water bill data
        const userBills = await WaterBill.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $substr: ["$billDate", 0, 7] },
                    totalCost: { $sum: "$billAmount" },
                    totalConsumption: { $sum: "$waterConsumption" }
                }
            },
            { $sort: { "_id": -1 } },
        ]);

        if (userBills.length === 0) {
            console.warn(`Warning: No water bills found for user ${userId}`);
            return res.status(404).json({ error: "No water bills found for this user." });
        }

        // Construct prompt
        // const prompt = `You are a water conservation expert. Based on this data, provide at least 10 clear and actionable water-saving tips:\n\n${userBills
        //     .map(entry => `Month: ${entry._id}, Consumption: ${entry.totalConsumption}L, Cost: ${entry.totalCost} PHP`)
        //     .join("\n")}`;

        // console.log("Prompt sent to Groq:", prompt);

        let previousConsumption = null;

const prompt = `You are a water conservation expert. Based on this historical water usage data, analyze the trends and provide at least 10 clear and actionable water-saving tips. Also, highlight possible causes for increased consumption (e.g., leaking faucet, seasonal changes):\n\n${userBills
    .map((entry, index) => {
        const comparison = previousConsumption !== null
            ? ` (${entry.totalConsumption > previousConsumption ? '↑ Increase' : '↓ Decrease'} of ${Math.abs(entry.totalConsumption - previousConsumption)}L)`
            : '';
        const result = `Month: ${entry._id}, Consumption: ${entry.totalConsumption}L${comparison}, Cost: ${entry.totalCost} PHP`;
        previousConsumption = entry.totalConsumption;
        return result;
    })
    .join("\n")}`;

console.log("Prompt sent to Groq:", prompt);


        // Retry mechanism
        let response;
        const maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                response = await groqClient.chat.completions.create({
                    model: "llama3-70b-8192",
                    messages: [
                        { role: "system", content: "You are a helpful assistant providing water-saving tips." },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 700,
                    temperature: 0.7,
                });

                if (response.choices?.[0]?.message?.content) break;
            } catch (error) {
                console.error(`Error on attempt ${attempt}:`, error);
                if (attempt === maxRetries || !error.message.includes("ECONNRESET")) {
                    return res.status(500).json({ error: "Failed to fetch water-saving tips.", details: error.message });
                }
                console.warn(`Retrying... (${attempt}/${maxRetries})`);
            }
        }

        if (!response || !response.choices?.[0]?.message?.content) {
            console.error("Error: Groq API response is empty or malformed.");
            return res.status(500).json({ error: "Failed to generate water-saving tips." });
        }

        const tipsText = response.choices[0].message.content;
        console.log("Raw Groq Tips Response:", tipsText);

        // Extract tips
        const tips = [];
        const lines = tipsText.split("\n");
        let currentTip = "";

        lines.forEach(line => {
            if (/^\*\*Tip \d+:/.test(line) || /^\d+\./.test(line.trim())) {
                if (currentTip) tips.push(currentTip.trim());
                currentTip = line.trim();
            } else if (currentTip) {
                currentTip += " " + line.trim();
            }
        });

        if (currentTip) tips.push(currentTip.trim());

        // Filter only first 10 tips
        const finalTips = tips.filter(tip => tip).slice(0, 10);

        if (finalTips.length >= 10) {
            console.log("Extracted Tips:", finalTips);
            return res.json({ tips: finalTips });
        }

        // If not enough tips extracted, fallback to full text split by numbered lines
        const backupTips = tipsText
            .split(/\n(?=\d+\.)/)
            .map(line => line.trim())
            .filter(tip => tip)
            .slice(0, 10);

        if (backupTips.length >= 10) {
            console.log("Backup Extracted Tips:", backupTips);
            return res.json({ tips: backupTips });
        }

        // Fallback to hardcoded tips if still less than 10
        console.warn("Groq returned insufficient tips. Using fallback tips.");
        return res.json({
            tips: [
                "Reduce shower time to under 5 minutes.",
                "Fix all leaking faucets and pipes immediately.",
                "Use a broom instead of a hose to clean driveways.",
                "Collect rainwater for watering plants.",
                "Install water-saving showerheads and faucets.",
                "Run washing machines with full loads only.",
                "Turn off the tap while brushing teeth.",
                "Water plants early in the morning or late evening.",
                "Use a pail instead of a running hose when washing cars.",
                "Check your meter regularly to detect hidden leaks."
            ]
        });

    } catch (error) {
        console.error("Error fetching water-saving tips:", error);
        res.status(500).json({ error: "Failed to fetch water-saving tips.", details: error.message });
    }
};



export const savePredictedData = async (req, res) => {
    try {
        // Extract data from request body
        const { user, predictedAmount, predictedConsumption, predictedMonth } = req.body;

        if (!user || !predictedAmount || !predictedConsumption || !predictedMonth) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // Check if a prediction for the same month and user already exists
        const existingPrediction = await Prediction.findOne({ user, predictedMonth });

        if (existingPrediction) {
            console.log(`⚠️ Duplicate prediction detected for ${predictedMonth}. Skipping insertion.`);
            return res.status(409).json({ warning: `Prediction for ${predictedMonth} already exists. Skipping insertion.` });
        }

        // Create and save new prediction
        const prediction = new Prediction({
            user,
            predictedAmount,
            predictedConsumption,
            predictedMonth,
        });

        await prediction.save();

        console.log("✅ Prediction saved successfully:", prediction);
        return res.status(201).json({ message: "Prediction saved successfully!", prediction });
    } catch (error) {
        console.error("❌ Error saving predicted data:", error);
        return res.status(500).json({ error: "Failed to save prediction." });
    }
};

export const getPredictedCostAndConsumption = async (req, res) => {
    try {
        const userId = req.user.id;
        const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

        if (userBills.length === 0) {
            return res.status(404).json({ error: "No water bills found for this user." });
        }

        const pastData = userBills.map(entry => ({
            month: entry.billDate,
            cost: entry.billAmount,
            consumption: entry.waterConsumption
        }));

        const flaskResponse = await axios.post("https://aquaquest-flask.onrender.com/api/predict", {
            past_data: pastData,
            months_ahead: 1
        });

        const lastBillDate = new Date(userBills[userBills.length - 1].billDate);
        const nextMonth = getNextMonthDate(lastBillDate);

        const predictedCost = flaskResponse.data.predicted_costs[0];
        const predictedConsumption = flaskResponse.data.predicted_consumptions[0];

        // Save the predictions in the database
        await savePredictedData(userId, predictedCost, predictedConsumption, nextMonth);

        return res.json({
            month: nextMonth,
            predictedCost,
            predictedConsumption
        });

    } catch (error) {
        console.error("Error fetching predicted cost and consumption:", error);
        res.status(500).json({ error: "Failed to fetch predicted cost and consumption.", details: error.message });
    }
};

export const getMonthlyPredictedCost = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await Prediction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $substr: ["$predictedMonth", 0, 10] },
                    predictedCost: { $sum: "$predictedAmount" },
                },
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json(result);
    } catch (error) {
        console.error("Error fetching all predicted monthly cost:", error);
        res.status(500).json({ error: "Failed to fetch predicted monthly cost.", details: error.message });
    }
};

export const getMonthlyPredictedConsumption = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await Prediction.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $substr: ["$predictedMonth", 0, 10] },
                    predictedConsumption: { $sum: "$predictedConsumption" },
                },
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json(result);
    } catch (error) {
        console.error("Error fetching all predicted monthly consumption:", error);
        res.status(500).json({ error: "Failed to fetch predicted monthly consumption.", details: error.message });
    }
};  
