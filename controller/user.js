import User from '../models/User.js';
import cloudinary from 'cloudinary';
import { sendToken } from '../utils/jwtToken.js';

export const saveToken = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.notificationToken = req.body.token;
        await user.save();
        res.json({
            message: "Notification token saved",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System error occurred.",
            success: false
        });
    }
}

export const register = async (req, res, next) => {
    try {
        const { first_name, last_name, address, email, password } = req.body;

        if (!first_name || !last_name || !address || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        let images = [];

        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const data = await cloudinary.v2.uploader.upload(req.files[i].path);
                images.push({
                    public_id: data.public_id,
                    url: data.url,
                });
            }
        } else {
            images = [{
                public_id: 'vvzvenkeapwpdwzbhugg',
                url: 'http://res.cloudinary.com/dlqclovym/image/upload/v1739675832/vvzvenkeapwpdwzbhugg.png'
            }];
        }

        const user = await User.create({
            first_name,
            last_name,
            address,
            email,
            password,
            role: 'user',
            images,
        });

        res.status(201).json({
            message: "Account created successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System error occurred.",
            success: false,
        });
    }
};

// TRIAL LOGIN IF MAG CCONNECT SA MONGODB
// export const login = async (req, res) => {
//     try {
//         // const { email, password } = req.body;
//         // const user = await
//         // User.findOne({ email });
//         // if (user && (await user.matchPassword(password))) {
//         //     res.json({
//         //         _id: user._id,
//         //         name: user.name,
//         //         email: user.email,
//         //         isAdmin: user.isAdmin,
//         //         token: generateToken(user._id),
//         //     });
//         // } else {
//         //     res.status(401);
//         //     throw new Error("Invalid email or password");
//         // }
//         res.json({
//                     message: "Connected Pare",
//                 });
//     } catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// };


// login running as api
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        sendToken(user, 200, res);

        // console.log(res);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "System error occurred.",
            success: false,
        });
    }
};