import User from '../models/User.js';
import WaterBill from "../models/WaterBill.js"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const admin = await User.findOne({ email, role: "admin" }).select("+password");

        if (!admin) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate JWT
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_TIME,
        });

        res.status(200).json({ success: true, token, user: { id: admin._id, email: admin.email, role: admin.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "System error occurred.", success: false });
    }
};
export const adminLogout = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Admin logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "System error occurred." });
    }
};


export const getTotalWaterBills = async (req, res) => {
  try {
    const totalWaterBills = await WaterBill.countDocuments();
    res.json({ totalWaterBills });
  } catch (error) {
    console.error("Error fetching total water bills:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getTotalUsers = async () => {
    try {
        const totalUsers = await User.countDocuments();
        return totalUsers;
    } catch (error) {
        console.error('Error fetching total users:', error);
        throw error;
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("first_name last_name email role createdAt updatedAt");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getTotalWaterBillsPerMonth = async (req, res) => {
  try {
    const billsByMonthYear = await WaterBill.aggregate([
      {
        $addFields: {
          billDate: { $toDate: "$billDate" } // Ensure billDate is a Date object
        }
      },
      {
        $group: {
          _id: { month: { $month: "$billDate" }, year: { $year: "$billDate" } }, 
          total: { $sum: "$billAmount" } // Use billAmount instead of amount
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // Ensure sorted data
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const formattedData = billsByMonthYear.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1], // Convert month number to name
      amount: item.total, // Use correct field
      label: `${item._id.year} - ${monthNames[item._id.month - 1]}`, // Label for frontend
    }));

    console.log("✅ Total Water Bills Per Month Data:", formattedData); // Debugging

    res.json(formattedData);
  } catch (error) {
    console.error("❌ Error fetching total water bills per month:", error);
    res.status(500).json({ error: "Server error" });
  }
};




export const getWaterBillCategories = async (req, res) => {
        try {
          const bills = await WaterBill.find({}, "billAmount"); // Get only the billAmount field
      
          let low = 0, medium = 0, high = 0;
      
          bills.forEach((bill) => {
            if (bill.billAmount <= 1000) {
              low++;
            } else if (bill.billAmount <= 2000) {
              medium++;
            } else {
              high++;
            }
          });
      
          const billCategories = [
            { name: "Low (₱0-₱1,000)", value: low },
            { name: "Medium (₱1,001-₱2,000)", value: medium },
            { name: "High (₱2,001+)", value: high },
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
    