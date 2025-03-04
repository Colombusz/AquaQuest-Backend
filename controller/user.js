import User from '../models/User.js';
import cloudinary from 'cloudinary';
import { sendToken } from '../utils/jwtToken.js';
import { sendMail } from '../utils/mailer.js';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
    
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

// export const register = async (req, res, next) => {

//     try {
//         const { first_name, last_name, address, email, password } = req.body;

//         if (!first_name || !last_name || !address || !email || !password) {
//             return res.status(400).json({ message: "All fields are required." });
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists." });
//         }

//         let images = [];

//         if (req.files && req.files.length > 0) {
//             for (let i = 0; i < req.files.length; i++) {
//                 const data = await cloudinary.v2.uploader.upload(req.files[i].path);
//                 images.push({
//                     public_id: data.public_id,
//                     url: data.url,
//                 });
//             }
//         } else {
//             images = [{
//                 public_id: 'vvzvenkeapwpdwzbhugg',
//                 url: 'http://res.cloudinary.com/dlqclovym/image/upload/v1739675832/vvzvenkeapwpdwzbhugg.png'
//             }];
//         }

//         const user = await User.create({
//             first_name,
//             last_name,
//             address,
//             email,
//             password,
//             role: 'user',
//             images,
//         });

//         res.status(201).json({
//             message: "Account created successfully",
//             user,
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "System error occurred.",
//             success: false,
//         });
//     }
// };

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
//         // } else {`
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


// export const getUserProfile = async (req, res) => {
//     try {
//         console.log("User data from token:", req.user); // Debugging log

//         if (!req.user || !req.user.id) {
//             return res.status(401).json({ message: "Unauthorized, user not found" });
//         }

//         const user = await User.findById(req.user.id).select("-password");

//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.json({
//             first_name: user.first_name,
//             last_name: user.last_name,
//             address: user.address,
//             email: user.email,
//         });
//     } catch (error) {
//         console.error("Profile fetch error:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

export const getUserProfile = async (req, res) => {
    try {
        console.log("User data from token:", req.user); 

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized, user not found" });
        }

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            first_name: user.first_name,
            last_name: user.last_name,
            address: user.address,
            email: user.email,
            images: user.images ? user.images.url : null,  
        });

    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// export const updateUserProfile = async (req, res) => {
//     try {
//         if (!req.user || !req.user.id) {
//             return res.status(401).json({ message: "Unauthorized, user not found" });
//         }

//         const { first_name, last_name, address, email, password } = req.body;

//         const user = await User.findById(req.user.id);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         if (first_name) user.first_name = first_name;
//         if (last_name) user.last_name = last_name;
//         if (address) user.address = address;
//         if (email) user.email = email;

//         if (password && password.trim() !== "") {
//             user.password = password; 
//         }

//         await user.save(); 
//         res.json({ message: "Profile updated successfully", user });
//     } catch (error) {
//         console.error("Profile update error:", error);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };
export const updateUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized, user not found" });
        }

        const { first_name, last_name, address, email, password } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (address) user.address = address;
        if (email) user.email = email;

        // Handle password update
        if (password && password.trim() !== "") {
            user.password = password; 
        }

        // Handle profile image upload to Cloudinary
        if (req.file) {
            // If a previous image exists, delete it from Cloudinary
            if (user.images && user.images.public_id) {
                await cloudinary.v2.uploader.destroy(user.images.public_id);
            }

            // Upload new image
            const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path);

            // Save image data to user profile
            user.images = {
                public_id: uploadedImage.public_id,
                url: uploadedImage.secure_url,
            };
        }

        await user.save();
        res.json({ message: "Profile updated successfully", user });

    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.status === "verified") {
            return res.status(400).json({ message: "User is already verified." });
        }

        user.status = "verified";
        await user.save();

        res.status(200).json({ message: "Account successfully verified!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "System error occurred." });
    }
};

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
            status: "unverified"
        });

        // Generate verification link
        const verificationLink = `https://aqua-quest-backend-deployment.onrender.com/api/verify/${user._id}`;

        // Send verification email
        const subject = "Verify Your Aqua Quest Account";
        const text = `Hello ${first_name},\n\nClick the link below to verify your email:\n\n${verificationLink}`;
        const html = `
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; background: #ffffff; padding: 20px; border-radius: 10px; text-align: center;">
                    <img src="https://your-logo-url.com/logo.png" alt="Aqua Quest Logo" style="width: 100px; margin-bottom: 20px;">
                    <h2>Welcome to Aqua Quest, ${first_name}!</h2>
                    <p>You're almost there! Click the button below to verify your email and activate your account.</p>
                    <a href="${verificationLink}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Verify Your Email</a>
                    <p>If the button doesn’t work, click the link below:</p>
                    <p><a href="${verificationLink}">${verificationLink}</a></p>
                    <p style="font-size: 12px; color: #666;">If you did not create this account, please ignore this email.</p>
                </div>
            </body>
            </html>
        `;
        await sendMail(email, subject, text, html);

        res.status(201).json({
            message: "Account created successfully. Please check your email to verify your account.",
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

        if (user.status !== "verified") {
            return res.status(403).json({ message: "Please verify your email before logging in." });
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