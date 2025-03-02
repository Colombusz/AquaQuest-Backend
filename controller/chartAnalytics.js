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
import WaterBill from "../models/WaterBill.js";
import mongoose from "mongoose";
import axios from "axios";

// OG 
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
// OG
// export const getMonthlyConsumption = async (req, res) => {
//     try {
//         const userId = req.user.id;

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

export const getMonthlyCost = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Aggregate the total cost per month
      const result = await WaterBill.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $project: {
            year: { $substr: ["$billDate", 6, 4] }, // Extract year
            month: { $substr: ["$billDate", 3, 2] }, // Extract month
            billAmount: 1,
          },
        },
        {
          $group: {
            _id: { 
              year: { $toInt: "$year" }, 
              month: { $toInt: "$month" },
            },
            totalCost: { $sum: "$billAmount" }, // Calculate total cost for the month
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by year and month
      ]);
  
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
      const formattedData = result.map((item) => ({
        year: item._id.year,
        month: monthNames[item._id.month - 1], // Convert month number to name
        totalCost: item.totalCost,
        label: `${item._id.year} - ${monthNames[item._id.month - 1]}`, // Label for frontend
      }));
  
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching monthly cost:", error);
      res.status(500).json({ error: "Failed to fetch monthly cost.", details: error.message });
    }
  };
  

  export const getMonthlyConsumption = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Aggregate the total water consumption per month
      const result = await WaterBill.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $project: {
            year: { $substr: ["$billDate", 6, 4] }, // Extract year
            month: { $substr: ["$billDate", 3, 2] }, // Extract month
            waterConsumption: 1,
          },
        },
        {
          $group: {
            _id: { 
              year: { $toInt: "$year" }, 
              month: { $toInt: "$month" },
            },
            totalConsumption: { $sum: "$waterConsumption" }, // Calculate total consumption for the month
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by year and month
      ]);
  
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
      const formattedData = result.map((item) => ({
        year: item._id.year,
        month: monthNames[item._id.month - 1], // Convert month number to name
        totalConsumption: item.totalConsumption,
        label: `${item._id.year} - ${monthNames[item._id.month - 1]}`, // Label for frontend
      }));
  
      res.json(formattedData);
    } catch (error) {
      console.error("Error fetching monthly consumption:", error);
      res.status(500).json({ error: "Failed to fetch monthly consumption.", details: error.message });
    }
  };
  

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
        const flaskResponse = await axios.post("https://aquaquest-flask.onrender.com/api/predict-cost", {
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
        const flaskResponse = await axios.post("https://aquaquest-flask.onrender.com/api/predict-consumption", {
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


// TRIAL AI
// export const getWaterSavingTips = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         // Check if Hugging Face API key exists
//         if (!process.env.HF_API_KEY) {
//             return res.status(500).json({ error: "Hugging Face API key is missing." });
//         }

//         // Fetch the user's last two water bills
//         const userBills = await WaterBill.find({ user: userId }).sort({ billDate: -1 }).limit(2);

//         if (userBills.length === 0) {
//             return res.status(400).json({ error: "No water bills found for this user." });
//         }

//         // Construct the prompt for AI model
//         const prompt = `Based on the following water consumption and cost history, suggest between 4 to 10 water-saving tips:\n\n`
//             + userBills.map(entry => `Month: ${entry.billDate}, Consumption: ${entry.waterConsumption}L, Cost: ${entry.billAmount} PHP`).join("\n")
//             + `\n\nGive concise, practical water-saving tips, numbered from 1 to 10.`; 

//         // Request water-saving tips from Hugging Face model (now using GPT-2)
//         const response = await axios.post(
//             "https://api-inference.huggingface.co/models/gpt2",  // Changed model URL to GPT-2
//             { inputs: prompt },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.HF_API_KEY}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         // Check if response data is valid
//         if (!response.data || !response.data[0]?.generated_text) {
//             throw new Error("Invalid response from Hugging Face API");
//         }

//         // Extract and process the tips from the generated text
//         const tips = response.data[0].generated_text.split("\n")
//             .filter(line => line.match(/^\d+\./))  // Filter out lines that start with numbers (i.e., tips)
//             .slice(0, 10);  // Get the first 10 tips

//         // If less than 4 tips are returned, return an error
//         if (tips.length < 4) {
//             return res.status(500).json({ error: "AI returned insufficient tips. Try again later." });
//         }

//         // Send the tips as the response
//         res.json({ tips });

//     } catch (error) {
//         console.error("Error fetching water-saving tips:", error.message);
//         res.status(500).json({ error: "Failed to fetch water-saving tips.", details: error.message });
//     }
// };
// export const getWaterSavingTips = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         // Check if Hugging Face API key exists
//         if (!process.env.HF_API_KEY) {
//             return res.status(500).json({ error: "Hugging Face API key is missing." });
//         }

//         // Fetch the user's last two water bills
//         const userBills = await WaterBill.find({ user: userId }).sort({ billDate: -1 }).limit(2);

//         if (userBills.length === 0) {
//             return res.status(400).json({ error: "No water bills found for this user." });
//         }

//         // Construct the prompt for AI model
//         const prompt = `Based on the following water consumption and cost history, suggest **at least 4 but no more than 10 tips** for saving water:\n\n`
//             + userBills.map(entry => `Month: ${entry.billDate}, Consumption: ${entry.waterConsumption}L, Cost: ${entry.billAmount} PHP`).join("\n")
//             + `\n\nGive **concise and practical water-saving tips**, numbered from 1 to 10. Ensure that the number of tips is between 4 and 10, inclusive.`; 

//         // Request water-saving tips from Hugging Face model (now using GPT-2)
//         const response = await axios.post(
//             "https://api-inference.huggingface.co/models/gpt2",  // Changed model URL to GPT-2
//             { inputs: prompt },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.HF_API_KEY}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         // Check if response data is valid
//         if (!response.data || !response.data[0]?.generated_text) {
//             throw new Error("Invalid response from Hugging Face API");
//         }

//         // Extract and process the tips from the generated text
//         const tips = response.data[0].generated_text.split("\n")
//             .filter(line => line.match(/^\d+\./))  // Filter out lines that start with numbers (i.e., tips)
//             .slice(0, 10);  // Get the first 10 tips (maximum)

//         // If less than 4 tips are returned, return an error
//         if (tips.length < 4) {
//             return res.status(500).json({ error: "AI returned insufficient tips. Try again later." });
//         }

//         // Send the tips as the response
//         res.json({ tips });

//     } catch (error) {
//         console.error("Error fetching water-saving tips:", error.message);
//         res.status(500).json({ error: "Failed to fetch water-saving tips.", details: error.message });
//     }
// };


export const getWaterSavingTips = async (req, res) => {
    try {
        const userId = req.user.id;

        // Validate that Hugging Face API key is available
        if (!process.env.HF_API_KEY) {
            return res.status(500).json({ error: "Hugging Face API key is missing." });
        }

        // Fetch the user's last two water bills
        const userBills = await WaterBill.find({ user: userId }).sort({ billDate: -1 }).limit(2);
        if (userBills.length === 0) {
            return res.status(400).json({ error: "No water bills found for this user." });
        }

        // Construct the prompt for AI model
        const prompt = `Based on the following water consumption and cost history, suggest at least 4 and no more than 10 practical and concise water-saving tips:\n\n`
            + userBills.map(entry => `Month: ${entry.billDate}, Consumption: ${entry.waterConsumption}L, Cost: ${entry.billAmount} PHP`).join("\n")
            + `\n\nGive actionable and practical water-saving tips, numbered from 1 to 10. Each tip should be short, clear, and easy to implement.`;

        // Request water-saving tips from Hugging Face model
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/gpt2",
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000  // Adding timeout in case the request takes too long
            }
        );

        // Ensure response is valid
        if (!response.data || !response.data[0]?.generated_text) {
            throw new Error("Invalid response from Hugging Face API");
        }

        // Extract and process the tips from the generated text
        const tips = response.data[0].generated_text.split("\n")
            .filter(line => line.match(/^\d+\./))  // Filter lines starting with numbers (i.e., tips)
            .slice(0, 10);  // Get up to the first 10 tips

        // If less than 4 tips are returned, return an error
        if (tips.length < 4) {
            return res.status(500).json({ error: "AI returned insufficient tips. Try again later." });
        }

        // Send the tips as the response
        res.json({ tips });

    } catch (error) {
        console.error("Error fetching water-saving tips:", error.message);
        
        // Error response with meaningful details
        res.status(500).json({
            error: "Failed to fetch water-saving tips.",
            details: error.message
        });
    }
};
