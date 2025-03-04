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
import mongoose from "mongoose";
import axios from "axios";
import { Groq } from "groq-sdk";

export const getMonthlyCost = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await WaterBill.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $substr: ["$billDate", 0, 7] },
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

export const getMonthlyConsumption = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await WaterBill.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: { $substr: ["$billDate", 0, 7] },
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

        return res.json({ predictedCost: flaskResponse.data.predicted_costs[0] });

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

        return res.json({ predictedConsumption: flaskResponse.data.predicted_consumptions[0] });

    } catch (error) {
        console.error("Error fetching predicted consumption:", error);
        res.status(500).json({ error: "Failed to fetch predicted consumption.", details: error.message });
    }
};

// WORKING NALABAS NA SA CONSOLE RESPONSE NI GROQ
const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

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
        const prompt = `You are a water conservation expert. Based on this data, provide 4 actionable tips to save water:\n\n${userBills
            .map(entry => `Month: ${entry._id}, Consumption: ${entry.totalConsumption}L, Cost: ${entry.totalCost} PHP`)
            .join("\n")}`;

        console.log("Prompt sent to Groq:", prompt);

        // Retry mechanism for temporary failures
        let response;
        let maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                response = await groqClient.chat.completions.create({
                    model: "llama3-70b-8192",
                    messages: [
                        { role: "system", content: "You are a helpful assistant providing water-saving tips." },
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 700, // Increased to reduce truncation risk
                    temperature: 0.7,
                });

                console.log("Full Groq API Response:", JSON.stringify(response, null, 2));

                if (response.choices?.[0]?.message?.content) {
                    break; // Successful response
                }
            } catch (error) {
                console.error(`Error on attempt ${attempt}:`, error);

                // Retry only if it's a temporary error
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

        // const tips = tipsText
        // .split("\n")
        // .filter(line => /^\d+\./.test(line) || /^•/.test(line) || /^\*\*Tip \d+:/.test(line)) // Added regex for "**Tip X:**"
        // .map(line => line.replace(/^\*\*Tip \d+:?\*\*\s*/, "")) // Remove "**Tip X:**" to get clean tips
        // .slice(0, 4);

        // console.log("Extracted Tips:", tips);

        const tips = [];
        const tipsTextArray = tipsText.split("\n");

        let currentTip = "";

        tipsTextArray.forEach(line => {
            if (/^\*\*Tip \d+:/.test(line)) { // Detects a new tip
                if (currentTip) {
                    tips.push(currentTip.trim()); // Push previous tip to array before starting new one
                }
                currentTip = line.trim(); // Start new tip section
            } else if (currentTip) {
                currentTip += " " + line.trim(); // Append details to the current tip
            }
        });

        if (currentTip) {
            tips.push(currentTip.trim()); // Push the last tip
        }

        tips.slice(0, 4); // Get only the first 4 tips

        console.log("Extracted Tips:", tips);

        if (tips.length === 0) {
            console.warn("Groq returned no valid tips. Using fallback tips.");
            return res.json({
                tips: [
                    "Reduce shower time",
                    "Fix leaking pipes",
                    "Use water-efficient appliances",
                    "Collect rainwater for gardening"
                ]
            });
        }

        return res.json({ tips });

    } catch (error) {
        console.error("Error fetching water-saving tips:", error);
        res.status(500).json({ error: "Failed to fetch water-saving tips.", details: error.message });
    }
};
