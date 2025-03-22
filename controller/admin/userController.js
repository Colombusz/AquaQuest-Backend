// filepath: c:\Users\Danniel\Documents\GitHub\AquaQuest-Backend\controller\admin\userController.js
import User from '../../models/User.js';

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
      const users = await User.find()
          .select("first_name last_name email role status gender createdAt updatedAt")
          .sort({ createdAt: -1 });

      res.status(200).json(users);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!["verified", "unverified"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true, runValidators: true }
        ).select("first_name last_name email role status createdAt updatedAt");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User status updated", user });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getPlayerEngagement = async (req, res) => {
  try {
    const engagementData = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          players: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]);

    const formattedData = engagementData.map(entry => ({
      date: `${entry._id.year}-${entry._id.month}-${entry._id.day}`,
      players: entry.players
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching player engagement:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getLastFiveUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .sort({ createdAt: -1 }) // Sort by newest first
            .limit(5) // Get only the last 5 users
            .select('first_name last_name email createdAt'); // Select relevant fields

        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
