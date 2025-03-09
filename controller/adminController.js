// import User from '../models/User.js';
// import WaterBill from "../models/WaterBill.js";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import Save from '../models/Save.js';
// import PlayerStats from "../models/PlayerStats.js";
// import Prediction from "../models/Prediction.js";

// dotenv.config();

// export const getPredictionAccuracy = async (req, res) => {
//     try {
//         // Fetch all predictions
//         const predictions = await Prediction.find().populate("user");
//         const waterBills = await WaterBill.find().populate("user");

//         let correct = 0;
//         let overestimated = 0;
//         let underestimated = 0;

//         // Map predictions to actual water consumption
//         predictions.forEach(pred => {
//             const actualBill = waterBills.find(wb => 
//                 wb.user.toString() === pred.user.toString() && 
//                 new Date(wb.billDate).getMonth() === new Date(pred.predictedMonth).getMonth()
//             );

//             if (actualBill) {
//                 const actual = actualBill.waterConsumption;
//                 const predicted = pred.predictedConsumption;
//                 const tolerance = actual * 0.1; // 10% margin

//                 if (Math.abs(predicted - actual) <= tolerance) {
//                     correct++;
//                 } else if (predicted > actual + tolerance) {
//                     overestimated++;
//                 } else if (predicted < actual - tolerance) {
//                     underestimated++;
//                 }
//             }
//         });

//         res.json({
//             correct,
//             overestimated,
//             underestimated
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// export const getPlayerKillStats = async (req, res) => {
//   try {
//       // Fetch all player stats and populate user data
//       const playerStats = await PlayerStats.find().populate("user", "first_name last_name");

//       // Format data for the stacked bar graph
//       const formattedData = playerStats.map((player) => ({
//           playerName: `${player.user.first_name} ${player.user.last_name}`,
//           kanalGoblinKills: player.Kills.KanalGoblin.TotalKills,
//           elNinoKills: player.Kills.ElNiño.TotalKills,
//           pinsalangKinamadaKills: player.Kills.PinsalangKinamada.TotalKills,
//           overallKills: player.Kills.OverallKills, // Can be used for sorting
//       }));

//       // Sort by overall kills in descending order (most kills first)
//       formattedData.sort((a, b) => b.overallKills - a.overallKills);

//       res.status(200).json(formattedData);
//   } catch (error) {
//       res.status(500).json({ message: "Error fetching player stats", error });
//   }
// };

// export const getTotalSavedCost = async (req, res) => {
//   try {
//     const totalSavedCost = await Save.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalSavedCost: { $sum: '$savedCost' },
//         },
//       },
//     ]);

//     const roundedTotalSavedCost = totalSavedCost[0]?.totalSavedCost
//       ? parseFloat(totalSavedCost[0].totalSavedCost.toFixed(2))
//       : 0;

//     res.json({ totalSavedCost: roundedTotalSavedCost });
//   } catch (error) {
//     console.error('❌ Error fetching total saved cost:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// export const getAvgSavingsPerUser = async (req, res) => {
//   try {
//     const userSavings = await Save.aggregate([
//       {
//         $group: {
//           _id: '$user',
//           avgSavedCost: { $avg: '$savedCost' },
//         },
//       },
//     ]);

//     const totalAvgSavings = userSavings.reduce((acc, user) => acc + user.avgSavedCost, 0);
//     const avgSavingsPerUser = totalAvgSavings / userSavings.length;

//     const roundedAvgSavingsPerUser = parseFloat(avgSavingsPerUser.toFixed(2));

//     res.json({ avgSavingsPerUser: roundedAvgSavingsPerUser });
//   } catch (error) {
//     console.error('❌ Error fetching average savings per user:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// export const getTotalMoneySavedOverTime = async (req, res) => {
//   try {
//     const totalMoneySavedOverTime = await Save.aggregate([
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m", date: "$month" } },
//           totalSavedCost: { $sum: "$savedCost" },
//         },
//       },
//       {
//         $sort: { _id: 1 },
//       },
//     ]);

//     const formattedData = totalMoneySavedOverTime.map((item) => ({
//       month: item._id,
//       totalSavedCost: parseFloat(item.totalSavedCost.toFixed(2)),
//     }));

//     res.json(formattedData);
//   } catch (error) {
//     console.error("❌ Error fetching total money saved over time:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required." });
//     }

//     const admin = await User.findOne({ email, role: "admin" }).select("+password");

//     if (!admin) {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     const isPasswordValid = await admin.comparePassword(password);

//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid email or password." });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_TIME,
//     });

//     res.status(200).json({
//       success: true,
//       token,
//       user: {
//         id: admin._id,
//         email: admin.email,
//         firstName: admin.first_name,
//         lastName: admin.last_name,
//         role: admin.role,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "System error occurred.", success: false });
//   }
// };

// export const adminLogout = async (req, res) => {
//   try {
//     res.status(200).json({ success: true, message: "Admin logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "System error occurred." });
//   }
// };

// export const getTotalWaterBills = async (req, res) => {
//   try {
//     const totalWaterBills = await WaterBill.countDocuments();
//     res.json({ totalWaterBills });
//   } catch (error) {
//     console.error("Error fetching total water bills:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const getTotalUsers = async () => {
//   try {
//     const totalUsers = await User.countDocuments();
//     return totalUsers;
//   } catch (error) {
//     console.error('Error fetching total users:', error);
//     throw error;
//   }
// };

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find()
//       .select("first_name last_name email role status createdAt updatedAt")
//       .sort({ createdAt: -1 });

//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getTotalWaterBillsPerMonth = async (req, res) => {
//   try {
//     const billsByMonthYear = await WaterBill.aggregate([
//       {
//         $addFields: {
//           billDate: { $toDate: "$billDate" }, // Ensure billDate is a Date object
//         },
//       },
//       {
//         $group: {
//           _id: { month: { $month: "$billDate" }, year: { $year: "$billDate" } },
//           count: { $sum: 1 }, // Count the number of bills instead of summing amounts
//         },
//       },
//       {
//         $sort: { "_id.year": 1, "_id.month": 1 }, // Ensure sorted data
//       },
//     ]);

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     const formattedData = billsByMonthYear.map((item) => ({
//       year: item._id.year,
//       month: monthNames[item._id.month - 1], // Convert month number to name
//       count: item.count, // Number of bills
//       label: `${item._id.year} - ${monthNames[item._id.month - 1]}`, // Label for frontend
//     }));

//     console.log("✅ Total Water Bills Count Per Month Data:", formattedData); // Debugging

//     res.json(formattedData);
//   } catch (error) {
//     console.error("❌ Error fetching total water bills count per month:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const updateUserStatus = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { status } = req.body;

//     if (!["verified", "unverified"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status value" });
//     }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { status },
//       { new: true, runValidators: true }
//     ).select("first_name last_name email role status createdAt updatedAt");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "User status updated", user });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getWaterBillCategories = async (req, res) => {
//   try {
//     const bills = await WaterBill.find({}, "billAmount"); // Get only the billAmount field

//     let low = 0, medium = 0, high = 0;

//     bills.forEach((bill) => {
//       if (bill.billAmount <= 500) {
//         low++;
//       } else if (bill.billAmount <= 1200) {
//         medium++;
//       } else {
//         high++;
//       }
//     });

//     const billCategories = [
//       { name: "Low (₱0-₱500)", value: low },
//       { name: "Medium (₱501-₱1,200)", value: medium },
//       { name: "High (₱1,201+)", value: high },
//     ];

//     res.json(billCategories);
//   } catch (error) {
//     console.error("Error fetching water bill categories:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const getWaterConsumptionTrend = async (req, res) => {
//   try {
//     const consumptionByMonth = await WaterBill.aggregate([
//       {
//         $addFields: {
//           billDate: { $toDate: "$billDate" } // Ensure billDate is a Date object
//         }
//       },
//       {
//         $group: {
//           _id: { month: { $month: "$billDate" }, year: { $year: "$billDate" } },
//           totalConsumption: { $sum: "$waterConsumption" }, // Total consumption
//           totalBills: { $sum: 1 } // Count of bills in that month
//         }
//       },
//       {
//         $sort: { "_id.year": 1, "_id.month": 1 } // Sort in chronological order
//       }
//     ]);

//     const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//     const formattedData = consumptionByMonth.map((item) => ({
//       month: `${item._id.year} - ${monthNames[item._id.month - 1]}`, // Format "YYYY - MMM"
//       averageConsumption: item.totalConsumption / item.totalBills, // Average consumption per bill
//       totalBills: item.totalBills // Total number of bills
//     }));

//     console.log("✅ Water Consumption Trend Data:", formattedData); // Debugging

//     res.json(formattedData);
//   } catch (error) {
//     console.error("❌ Error fetching water consumption trend:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const getPlayerEngagement = async (req, res) => {
//   try {
//     const engagementData = await User.aggregate([
//       {
//         $group: {
//           _id: {
//             year: { $year: "$createdAt" },
//             month: { $month: "$createdAt" },
//             day: { $dayOfMonth: "$createdAt" }
//           },
//           players: { $sum: 1 }
//         }
//       },
//       {
//         $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
//       }
//     ]);

//     const formattedData = engagementData.map(entry => ({
//       date: `${entry._id.year}-${entry._id.month}-${entry._id.day}`,
//       players: entry.players
//     }));

//     res.status(200).json(formattedData);
//   } catch (error) {
//     console.error("Error fetching player engagement:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// export const getUserWaterBills = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const userBills = await WaterBill.find({ user: userId }).sort({ billDate: 1 });

//     if (!userBills.length) {
//       return res.json({ barChartData: [], lineChartData: [] });
//     }

//     // Format data for frontend charts
//     const barChartData = userBills.map((bill) => ({
//       month: new Date(bill.billDate).toLocaleString("default", { month: "short" }), // e.g., "Jan"
//       amount: bill.billAmount || null,
//     }));

//     const lineChartData = userBills.map((bill) => ({
//       date: bill.billDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
//       consumption: bill.waterConsumption || null,
//     }));

//     res.json({ barChartData, lineChartData });
//   } catch (error) {
//     console.error("❌ Error fetching user water bills:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// export const getAverageConsumption = async (req, res) => {
//   try {
//     const users = await User.find();

//     let scatterData = [];
//     let index = 1; // Start from 1 instead of 0 for better readability

//     for (let user of users) {
//       const bills = await WaterBill.find({ user: user._id });

//       if (bills.length > 0) {
//         const totalConsumption = bills.reduce((sum, bill) => sum + bill.waterConsumption, 0);
//         const avgConsumption = totalConsumption / bills.length;

//         scatterData.push({
//           id: index++, // Numeric X-axis
//           name: `${user.first_name} ${user.last_name}`, // Full name for Tooltip
//           avgConsumption: avgConsumption,
//         });
//       }
//     }

//     res.json({ scatterData });
//   } catch (error) {
//     console.error("Error fetching average consumption data:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

export * from './admin/authController.js';
export * from './admin/predictionController.js';
export * from './admin/statsController.js';
export * from './admin/userController.js';
export * from './admin/waterBillController.js';