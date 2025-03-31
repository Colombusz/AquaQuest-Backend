// WORKING WITH USER UPLOAD (latest na ginagamit ko as of 02-25-24)
// import WaterBill from "../models/WaterBill.js";
// import Tesseract from "tesseract.js";

// export const extractBillDetails = (text) => {
//     const amountMatch = text.match(/([\d,]+\.\d{2})/);
//     const consumptionMatch = text.match(/(\d{1,5})\s?(m3|liters|cubic\s?meters|cons)/i);
//     const dateMatch = text.match(/(\d{2})\s([A-Za-z]{3})\s(\d{4})/);

//     return {
//         billAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
//         waterConsumption: consumptionMatch ? parseInt(consumptionMatch[1]) : 0,
//         billDate: dateMatch ? `${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}` : "Unknown"
//     };
// };

// export const uploadAndAnalyze = async (req, res) => {
//     console.log("Files received:", req.files);
//     console.log("Request Body:", req.body);

//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ error: "No files uploaded or incorrect field name." });
//     }

//     try {
//         const bills = [];
//         const userId = req.user.id; // Extract logged-in user's ID from the JWT token

//         for (const file of req.files) {
//             const imagePath = file.path;

//             const { data: { text } } = await Tesseract.recognize(imagePath, "eng");

//             console.log("Extracted Text:", text);

//             const { billAmount, waterConsumption, billDate } = extractBillDetails(text);

            
//             const newBill = new WaterBill({
//                 imageUrl: imagePath,
//                 billAmount,
//                 waterConsumption,
//                 billDate,
//                 user: userId 
//             });

//             await newBill.save();
//             bills.push(newBill);
//         }

//         res.json({ success: true, bills });

//     } catch (error) {
//         res.status(500).json({ error: "OCR failed.", details: error.message });
//     }
// };


// export const getAllBills = async (req, res) => {
//     try {
//         const userId = req.user.id; // Get the logged-in user's ID

//         // Find all water bills associated with the logged-in user
//         const bills = await WaterBill.find({ user: userId });
//         res.json(bills);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch data." });
//     }
// };




import WaterBill from "../models/WaterBill.js";
import Prediction from "../models/Prediction.js";
import Tesseract from "tesseract.js";
import axios from "axios";

export const extractBillDetails = (text) => {
    const amountMatch = text.match(/([\d,]+\.\d{2})/);
    const consumptionMatch = text.match(/(\d{1,5})\s?(m3|liters|cubic\s?meters|cons)/i);
    const dateMatch = text.match(/(\d{2})\s([A-Za-z]{3})\s(\d{4})/); // Extracts format "04 Jan 2025"

    const monthMap = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    };

    let billDate = null;
    let billAmount = null;
    let waterConsumption = null;

    if (dateMatch && monthMap[dateMatch[2]]) {
        const day = dateMatch[1].padStart(2, "0"); // Ensure two-digit day
        const month = monthMap[dateMatch[2]]; // Convert month abbreviation to number
        const year = dateMatch[3];

        // Convert to proper ISO Date format
        billDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    }

    if (amountMatch) {
        billAmount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    if (consumptionMatch) {
        waterConsumption = parseInt(consumptionMatch[1]);
    }

    // Check if we have non-zero values for bill amount and water consumption
    // or if any required fields are missing
    const hasNonZeroValues = 
        billAmount !== null && billAmount > 0 && 
        waterConsumption !== null && waterConsumption > 0;
    
    const isValidBill = billDate !== null && hasNonZeroValues;

    return {
        billAmount: billAmount || 0,
        waterConsumption: waterConsumption || 0,
        billDate: billDate || new Date("1970-01-01"),
        isValidBill
    };
};

export const uploadAndAnalyze = async (req, res) => {
    console.log("Files received:", req.files);
    console.log("Request Body:", req.body);

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded or incorrect field name." });
    }

    try {
        const bills = [];
        const userId = req.user.id;

        for (const file of req.files) {
            const imagePath = file.path;

            const { data: { text } } = await Tesseract.recognize(imagePath, "eng");

            console.log("Extracted Text:", text);

            const { billAmount, waterConsumption, billDate, isValidBill } = extractBillDetails(text);

            // Log the extracted values for debugging
            console.log("Extracted values:", {
                billAmount,
                waterConsumption,
                billDate,
                isValidBill
            });

            if (!isValidBill) {
                console.log("Invalid water bill: Could not extract valid information or values are all zero");
                return res.status(400).json({ 
                    error: "Invalid water bill", 
                    message: "Invalid water Bill. Please try again." 
                });
            }

            const existingBill = await WaterBill.findOne({ 
                billDate: new Date(billDate), 
                user: userId 
            });
            
            if (existingBill) {
                console.log(`Duplicate bill detected for date: ${billDate}, skipping insertion.`);
                return res.json({ warning: `Duplicate bill detected for date: ${billDate}. Skipping insertion.` });
            }

            const newBill = new WaterBill({
                imageUrl: imagePath,
                billAmount,
                waterConsumption,
                billDate: new Date(billDate),
                user: userId
            });
            
            await newBill.save();
            bills.push(newBill);
        }

        if (bills.length === 0) {
            console.log(`No new bills were inserted.`);
            return res.status(400).json({ 
                error: "No bills inserted", 
                message: "The system could not process the uploaded bill." 
            });
        }

        res.json({ success: true, bills });
    } catch (error) {
        console.error("OCR processing error:", error);
        res.status(500).json({ error: "OCR failed.", details: error.message });
    }
};

export const getAllBills = async (req, res) => {
    try {
        const userId = req.user.id; 

        const bills = await WaterBill.find({ user: userId });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data." });
    }
};

export const getLatestBill = async (req, res) => {
    try {
        const userId = req.user.id;

        const latestBill = await WaterBill.find({ user: userId })
                                          .sort({ billDate: -1 })  
                                          .limit(1);

        if (latestBill.length === 0) {
            return res.status(404).json({ message: "No bills found" });
        }

        res.json(latestBill[0]); 
    } catch (error) {
        console.error("Error fetching latest bill:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// IF SAME NG BILLDATE DI NA PAPASOK SA DATABASE (WORKING) OG CODEEE (3-31-25)
// import WaterBill from "../models/WaterBill.js";
// import Tesseract from "tesseract.js";
// import WaterBill from "../models/WaterBill.js";
// import Prediction from "../models/Prediction.js";
// import Tesseract from "tesseract.js";
// import axios from "axios";

// export const extractBillDetails = (text) => {
//     const amountMatch = text.match(/([\d,]+\.\d{2})/);
//     const consumptionMatch = text.match(/(\d{1,5})\s?(m3|liters|cubic\s?meters|cons)/i);
//     const dateMatch = text.match(/(\d{2})\s([A-Za-z]{3})\s(\d{4})/); // Extracts format "04 Jan 2025"

//     const monthMap = {
//         Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
//         Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
//     };

//     let billDate = new Date("1970-01-01"); // Default date in case extraction fails

//     if (dateMatch) {
//         const day = dateMatch[1].padStart(2, "0"); // Ensure two-digit day
//         const month = monthMap[dateMatch[2]]; // Convert month abbreviation to number
//         const year = dateMatch[3];

//         // Convert to proper ISO Date format
//         billDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
//     }

//     return {
//         billAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
//         waterConsumption: consumptionMatch ? parseInt(consumptionMatch[1]) : 0,
//         billDate // Now it's a proper Date object
//     };
// };

// // OG CODE
// export const uploadAndAnalyze = async (req, res) => {
//     console.log("Files received:", req.files);
//     console.log("Request Body:", req.body);

//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ error: "No files uploaded or incorrect field name." });
//     }

//     try {
//         const bills = [];
//         const userId = req.user.id;

//         for (const file of req.files) {
//             const imagePath = file.path;

//             const { data: { text } } = await Tesseract.recognize(imagePath, "eng");

//             console.log("Extracted Text:", text);

//             const { billAmount, waterConsumption, billDate } = extractBillDetails(text);

//             const existingBill = await WaterBill.findOne({ billDate, user: userId });
//             if (existingBill) {
//                 console.log(`Duplicate bill detected for date: ${billDate}, skipping insertion.`);
//                 return res.json({ warning: `Duplicate bill detected for date: ${billDate}. Skipping insertion.` });
//             }

//             const newBill = new WaterBill({
//                 imageUrl: imagePath,
//                 billAmount,
//                 waterConsumption,
//                 billDate: new Date(billDate),
//                 user: userId
//             });
            


//             await newBill.save();
//             bills.push(newBill);
//         }

//         if (bills.length === 0) {
//             console.log(`No new bills were inserted.`);
//         }

//         res.json({ success: true, bills });
//     } catch (error) {
//         res.status(500).json({ error: "OCR failed.", details: error.message });
//     }
// };

// export const getAllBills = async (req, res) => {
//     try {
//         const userId = req.user.id; 

//         const bills = await WaterBill.find({ user: userId });
//         res.json(bills);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch data." });
//     }
// };

// // OG
// export const getLatestBill = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const latestBill = await WaterBill.find({ user: userId })
//                                           .sort({ billDate: -1 })  
//                                           .limit(1);

//         if (latestBill.length === 0) {
//             return res.status(404).json({ message: "No bills found" });
//         }

//         res.json(latestBill[0]); 
//     } catch (error) {
//         console.error("Error fetching latest bill:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
