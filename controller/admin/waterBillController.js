// filepath: c:\Users\Danniel\Documents\GitHub\AquaQuest-Backend\controller\admin\waterBillController.js
import WaterBill from "../../models/WaterBill.js";
import User from "../../models/User.js";
import Save from '../../models/Save.js';

export const getTotalWaterBills = async (req, res) => {
    try {
        const totalWaterBills = await WaterBill.countDocuments();
        res.json({ totalWaterBills });
    } catch (error) {
        console.error("Error fetching total water bills:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getTotalWaterBillsPerMonth = async (req, res) => {
    try {
        const billsByMonthYear = await WaterBill.aggregate([
            {
                $addFields: {
                    billDate: { $toDate: "$billDate" }, // Ensure billDate is a Date object
                },
            },
            {
                $group: {
                    _id: { month: { $month: "$billDate" }, year: { $year: "$billDate" } },
                    count: { $sum: 1 }, // Count the number of bills instead of summing amounts
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }, // Ensure sorted data
            },
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedData = billsByMonthYear.map((item) => ({
            year: item._id.year,
            month: monthNames[item._id.month - 1], // Convert month number to name
            count: item.count, // Number of bills
            label: `${item._id.year} - ${monthNames[item._id.month - 1]}`, // Label for frontend
        }));

        console.log("✅ Total Water Bills Count Per Month Data:", formattedData); // Debugging

        res.json(formattedData);
    } catch (error) {
        console.error("❌ Error fetching total water bills count per month:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getWaterBillCategories = async (req, res) => {
    try {
        const bills = await WaterBill.find({}, "billAmount"); // Get only the billAmount field

        let low = 0, medium = 0, high = 0;

        bills.forEach((bill) => {
            if (bill.billAmount <= 500) {
                low++;
            } else if (bill.billAmount <= 1200) {
                medium++;
            } else {
                high++;
            }
        });

        const billCategories = [
            { name: "Low (₱0-₱500)", value: low },
            { name: "Medium (₱501-₱1,200)", value: medium },
            { name: "High (₱1,201+)", value: high },
        ];

        res.json(billCategories);
    } catch (error) {
        console.error("Error fetching water bill categories:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getWaterConsumptionTrend = async (req, res) => {
    try {
        const consumptionByMonth = await WaterBill.aggregate([
            {
                $addFields: {
                    billDate: { $toDate: "$billDate" } // Ensure billDate is a Date object
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$billDate" }, year: { $year: "$billDate" } },
                    totalConsumption: { $sum: "$waterConsumption" }, // Total consumption
                    totalBills: { $sum: 1 } // Count of bills in that month
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort in chronological order
            }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedData = consumptionByMonth.map((item) => ({
            month: `${item._id.year} - ${monthNames[item._id.month - 1]}`, // Format "YYYY - MMM"
            averageConsumption: item.totalConsumption / item.totalBills, // Average consumption per bill
            totalBills: item.totalBills // Total number of bills
        }));

        console.log("✅ Water Consumption Trend Data:", formattedData); // Debugging

        res.json(formattedData);
    } catch (error) {
        console.error("❌ Error fetching water consumption trend:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getUserWaterBills = async (req, res) => {
    try {
        const { userId } = req.params;

        const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

        if (!userBills.length) {
            return res.json({ barChartData: [], lineChartData: [] });
        }

        // Format data for frontend charts
        const barChartData = userBills.map((bill) => ({
            month: new Date(bill.billDate).toLocaleString("default", { month: "short" }), // e.g., "Jan"
            amount: bill.billAmount || null,
        }));

        const lineChartData = userBills.map((bill) => ({
            date: bill.billDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
            consumption: bill.waterConsumption || null,
        }));

        res.json({ barChartData, lineChartData });
    } catch (error) {
        console.error("❌ Error fetching user water bills:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getAverageConsumption = async (req, res) => {
    try {
        const users = await User.find();

        let scatterData = [];
        let index = 1; // Start from 1 instead of 0 for better readability

        for (let user of users) {
            const bills = await WaterBill.find({ user: user._id });

            if (bills.length > 0) {
                const totalConsumption = bills.reduce((sum, bill) => sum + bill.waterConsumption, 0);
                const avgConsumption = totalConsumption / bills.length;

                scatterData.push({
                    id: index++, // Numeric X-axis
                    name: `${user.first_name} ${user.last_name}`, // Full name for Tooltip
                    avgConsumption: avgConsumption,
                });
            }
        }

        res.json({ scatterData });
    } catch (error) {
        console.error("Error fetching average consumption data:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getTopUsersWithMostSavedMoney = async (req, res) => {
    try {
        const topUsers = await Save.aggregate([
            {
                $group: {
                    _id: "$user",
                    totalSavedCost: { $sum: "$savedCost" }
                }
            },
            {
                $sort: { totalSavedCost: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$user._id",
                    userName: { $concat: ["$user.first_name", " ", "$user.last_name"] },
                    totalSavedCost: 1
                }
            }
        ]);

        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
