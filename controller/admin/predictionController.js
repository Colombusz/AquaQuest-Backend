// filepath: c:\Users\Danniel\Documents\GitHub\AquaQuest-Backend\controller\admin\predictionController.js
import Prediction from "../../models/Prediction.js";
import WaterBill from "../../models/WaterBill.js";

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