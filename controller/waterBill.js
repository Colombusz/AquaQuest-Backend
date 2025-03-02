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






// IF SAME NG BILLDATE DI NA PAPASOK SA DATABASE (WORKING)
// import WaterBill from "../models/WaterBill.js";
// import Tesseract from "tesseract.js";

// // OG CODE
// // export const extractBillDetails = (text) => {
// //     const amountMatch = text.match(/([\d,]+\.\d{2})/);
// //     const consumptionMatch = text.match(/(\d{1,5})\s?(m3|liters|cubic\s?meters|cons)/i);
// //     const dateMatch = text.match(/(\d{2})\s([A-Za-z]{3})\s(\d{4})/);

// //     return {
// //         billAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
// //         waterConsumption: consumptionMatch ? parseInt(consumptionMatch[1]) : 0,
// //         billDate: dateMatch ? `${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}` : "Unknown"
// //     };
// // };


// // ETO LATEST BEFORE OG
// // export const extractBillDetails = (text) => {
// //     const amountMatch = text.match(/([\d,]+\.\d{2})/);
// //     const consumptionMatch = text.match(/(\d{1,5})\s?(m3|liters|cubic\s?meters|cons)/i);
// //     const dateMatch = text.match(/(\d{2})\s([A-Za-z]{3})\s(\d{4})/);

// //     const monthMap = {
// //         Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
// //         Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
// //     };

// //     const billDateString = dateMatch ? `${dateMatch[1]}-${monthMap[dateMatch[2]]}-${dateMatch[3]}` : "01-01-1970"; 

// //     return {
// //         billAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
// //         waterConsumption: consumptionMatch ? parseInt(consumptionMatch[1]) : 0,
// //         billDate: billDateString 
// //     };
// // };


// // TRIAL
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
// // export const uploadAndAnalyze = async (req, res) => {
// //     console.log("Files received:", req.files);
// //     console.log("Request Body:", req.body);

// //     if (!req.files || req.files.length === 0) {
// //         return res.status(400).json({ error: "No files uploaded or incorrect field name." });
// //     }

// //     try {
// //         const bills = [];
// //         const userId = req.user.id;

// //         for (const file of req.files) {
// //             const imagePath = file.path;

// //             const { data: { text } } = await Tesseract.recognize(imagePath, "eng");

// //             console.log("Extracted Text:", text);

// //             const { billAmount, waterConsumption, billDate } = extractBillDetails(text);

// //             const existingBill = await WaterBill.findOne({ billDate, user: userId });
// //             if (existingBill) {
// //                 console.log(`Duplicate bill detected for date: ${billDate}, skipping insertion.`);
// //                 return res.json({ warning: `Duplicate bill detected for date: ${billDate}. Skipping insertion.` });
// //             }

// //             // const newBill = new WaterBill({
// //             //     imageUrl: imagePath,
// //             //     billAmount,
// //             //     waterConsumption,
// //             //     billDate: new Date(billDate),
// //             //     user: userId
// //             // });
// //             const [day, month, year] = billDate.split("-");
// //             const formattedDate = new Date(`${year}-${month}-${day}`); // Convert to YYYY-MM-DD

// //             const newBill = new WaterBill({
// //                 imageUrl: imagePath,
// //                 billAmount,
// //                 waterConsumption,
// //                 billDate: formattedDate,  // Store as a Date object
// //                 user: userId
// //             });


// //             await newBill.save();
// //             bills.push(newBill);
// //         }

// //         if (bills.length === 0) {
// //             console.log(`No new bills were inserted.`);
// //         }

// //         res.json({ success: true, bills });
// //     } catch (error) {
// //         res.status(500).json({ error: "OCR failed.", details: error.message });
// //     }
// // };

// // TRIAL
// export const uploadAndAnalyze = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No file uploaded." });
//         }

//         const imagePath = req.file.path;

//         // Use Tesseract to extract text from the image
//         const { data: { text } } = await Tesseract.recognize(imagePath, "eng");

//         // Extract bill details from the OCR text
//         const { billAmount, waterConsumption, billDate } = extractBillDetails(text);

//         // Ensure billDate is correctly stored as a Date object
//         const newBill = new WaterBill({
//             user: req.user.id,
//             billAmount,
//             waterConsumption,
//             billDate, // Now it's stored as a proper Date object
//             imagePath
//         });

//         // Save to MongoDB
//         await newBill.save();

//         res.status(201).json({ message: "Bill uploaded and analyzed successfully.", newBill });
//     } catch (error) {
//         console.error("Error processing bill:", error);
//         res.status(500).json({ error: "Error processing the bill." });
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
// // export const getLatestBill = async (req, res) => {
// //     try {
// //         const userId = req.user.id;

// //         const latestBill = await WaterBill.find({ user: userId })
// //                                           .sort({ billDate: -1 })  
// //                                           .limit(1);

// //         if (latestBill.length === 0) {
// //             return res.status(404).json({ message: "No bills found" });
// //         }

// //         res.json(latestBill[0]); 
// //     } catch (error) {
// //         console.error("Error fetching latest bill:", error);
// //         res.status(500).json({ message: "Server error", error: error.message });
// //     }
// // };

// // TRIAL
// export const getLatestBill = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const latestBill = await WaterBill.findOne({ user: userId })
//                                           .sort({ billDate: -1 }); // Get the most recent bill

//         if (!latestBill) {
//             return res.status(404).json({ message: "No bills found" });
//         }

//         res.json({
//             billAmount: latestBill.billAmount,
//             waterConsumption: latestBill.waterConsumption,
//             billDate: latestBill.billDate.toISOString(), // Ensures proper ISO format
//             imagePath: latestBill.imagePath
//         });
//     } catch (error) {
//         console.error("Error fetching latest bill:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


// TRIAL CODE
import WaterBill from "../models/WaterBill.js";
import Tesseract from "tesseract.js";

export const extractBillDetails = (text) => {
    const amountMatch = text.match(/([\d,]+\.\d{2})/);
    const consumptionMatch = text.match(/(\d{1,5})\s?(m3|liters|cubic\s?meters|cons)/i);
    const dateMatch = text.match(/(\d{2})\s([A-Za-z]{3})\s(\d{4})/);

    const monthMap = {
        Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
        Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    };

    let billDate = new Date("1970-01-01");

    if (dateMatch) {
        const day = dateMatch[1].padStart(2, "0");
        const month = monthMap[dateMatch[2]];
        const year = dateMatch[3];

        billDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);
    }

    return {
        billAmount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0,
        waterConsumption: consumptionMatch ? parseInt(consumptionMatch[1]) : 0,
        billDate
    };
};

export const uploadAndAnalyze = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const imagePath = req.file.path;

        const { data: { text } } = await Tesseract.recognize(imagePath, "eng");

        const { billAmount, waterConsumption, billDate } = extractBillDetails(text);

        const newBill = new WaterBill({
            user: req.user.id,
            billAmount,
            waterConsumption,
            billDate,
            imageUrl: imagePath
        });

        await newBill.save();

        res.status(201).json({ message: "Bill uploaded and analyzed successfully.", newBill });
    } catch (error) {
        console.error("Error processing bill:", error);
        res.status(500).json({ error: "Error processing the bill." });
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
        const latestBill = await WaterBill.findOne({ user: userId }).sort({ billDate: -1 });

        if (!latestBill) {
            return res.status(404).json({ message: "No bills found" });
        }

        res.json({
            billAmount: latestBill.billAmount,
            waterConsumption: latestBill.waterConsumption,
            billDate: latestBill.billDate.toISOString(),
            imageUrl: latestBill.imageUrl
        });
    } catch (error) {
        console.error("Error fetching latest bill:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
