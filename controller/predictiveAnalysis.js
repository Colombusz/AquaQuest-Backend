// OG CODE WAG BURAHIN
import axios from "axios";

export const getPrediction = async (req, res) => {
    try {
        const { past_data, months_ahead } = req.body;

        if (!past_data || past_data.length < 3) {
            return res.status(400).json({ error: "At least 3 months of data is required." });
        }

        // Send request to Python Flask API
        const response = await axios.post('http://127.0.0.1:5001/predict', {
            past_data,
            months_ahead
        });

        return res.json(response.data);
    } catch (error) {
        console.error("Python API Error:", error.message);
        return res.status(500).json({ error: "Prediction service unavailable. Please check the Python server." });
    }
};





// import axios from "axios";

// export const getPrediction = async (req, res) => {
//     try {
//         const { past_data, months_ahead } = req.body;

//         if (!past_data || past_data.length < 2) { // **Updated to 2 months**
//             return res.status(400).json({ error: "At least 2 months of data is required." });
//         }

//         // Send request to Python Flask API
//         const response = await axios.post('http://127.0.0.1:5001/predict', {
//             past_data,
//             months_ahead
//         });

//         return res.json(response.data);
//     } catch (error) {
//         console.error("Python API Error:", error.message);
//         return res.status(500).json({ error: "Prediction service unavailable. Please check the Python server." });
//     }
// };
