// WORKING PERO WALANG USER NA KASAMA
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
// // export const extractBillDetails = (text) => {
// //     const amountMatch = text.match(/([\d,]+\.\d{2})/);
// //     const consumptionMatch = text.match(/(\d{1,5})\s?(m3|liters|cubic\s?meters|consumption|cubic\s?meters|cons)/i);
// //     const dateMatch = text.match(/(\d{2})\s([A-Za-z]{3})\s(\d{4})/);

// //     return {
// //         billAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
// //         waterConsumption: consumptionMatch ? parseInt(consumptionMatch[1]) : 0,
// //         billDate: dateMatch ? `${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}` : "Unknown"
// //     };
// // };


// // export const uploadAndAnalyze = async (req, res) => {
// //     console.log("File received:", req.file);
// //     console.log("Request Body:", req.body);

// //     if (!req.file) {
// //         return res.status(400).json({ error: "No file uploaded or incorrect field name." });
// //     }

// //     const imagePath = req.file.path;

// //     try {
// //         const { data: { text } } = await Tesseract.recognize(imagePath, "eng");

// //         console.log("Extracted Text:", text);

// //         const { billAmount, waterConsumption, billDate } = extractBillDetails(text);

// //         const newBill = new WaterBill({
// //             imageUrl: imagePath,
// //             billAmount,
// //             waterConsumption,
// //             billDate
// //         });

// //         await newBill.save();
// //         res.json({ success: true, bill: newBill });

// //     } catch (error) {
// //         res.status(500).json({ error: "OCR failed.", details: error.message });
// //     }
// // };
// export const uploadAndAnalyze = async (req, res) => {
//     console.log("Files received:", req.files);
//     console.log("Request Body:", req.body);

//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ error: "No files uploaded or incorrect field name." });
//     }

//     try {
//         const bills = [];

//         // Process each uploaded image
//         for (const file of req.files) {
//             const imagePath = file.path;

//             // Perform OCR
//             const { data: { text } } = await Tesseract.recognize(imagePath, "eng");

//             console.log("Extracted Text:", text);

//             // Extract bill details from text
//             const { billAmount, waterConsumption, billDate } = extractBillDetails(text);

//             // Create new bill entry
//             const newBill = new WaterBill({
//                 imageUrl: imagePath,
//                 billAmount,
//                 waterConsumption,
//                 billDate
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
//         const bills = await WaterBill.find();
//         res.json(bills);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch data." });
//     }
// };




// WORKING WITH USER UPLOAD
import WaterBill from "../models/WaterBill.js";
import Tesseract from "tesseract.js";

export const extractBillDetails = (text) => {
    const amountMatch = text.match(/([\d,]+\.\d{2})/);
    const consumptionMatch = text.match(/(\d{1,5})\s?(m3|liters|cubic\s?meters|cons)/i);
    const dateMatch = text.match(/(\d{2})\s([A-Za-z]{3})\s(\d{4})/);

    return {
        billAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
        waterConsumption: consumptionMatch ? parseInt(consumptionMatch[1]) : 0,
        billDate: dateMatch ? `${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}` : "Unknown"
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
        const userId = req.user.id; // Extract logged-in user's ID from the JWT token

        for (const file of req.files) {
            const imagePath = file.path;

            const { data: { text } } = await Tesseract.recognize(imagePath, "eng");

            console.log("Extracted Text:", text);

            const { billAmount, waterConsumption, billDate } = extractBillDetails(text);

            
            const newBill = new WaterBill({
                imageUrl: imagePath,
                billAmount,
                waterConsumption,
                billDate,
                user: userId 
            });

            await newBill.save();
            bills.push(newBill);
        }

        res.json({ success: true, bills });

    } catch (error) {
        res.status(500).json({ error: "OCR failed.", details: error.message });
    }
};

// Fetch all water bills for the authenticated user
export const getAllBills = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID

        // Find all water bills associated with the logged-in user
        const bills = await WaterBill.find({ user: userId });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data." });
    }
};
