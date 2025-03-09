// filepath: c:\Users\Danniel\Documents\GitHub\AquaQuest-Backend\controller\admin\authController.js
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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

        res.status(200).json({
            success: true,
            token,
            user: {
                id: admin._id,
                email: admin.email,
                firstName: admin.first_name,
                lastName: admin.last_name,
                role: admin.role,
            },
        });
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