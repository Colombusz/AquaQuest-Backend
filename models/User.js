import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userModel = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First Name is required."],
        trim: true,
    },

    last_name: {
        type: String,
        required: [true, "Last Name is required."],
        trim: true,
    },

    gender: {
        type: String,
        required: true,
        trim: true,
    },

    address: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: [true, "Email is required."],
        trim: true,
    },

    password: {
        type: String,
        required: [true, "Password is required."],
        trim: true,
    },

    images: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        }
    },

    role: {
        type: String,
        default: 'user'
    },

    
    notificationToken: String,

    status: {
        type: String,
        enum: ['unverified', 'verified'],
        default: 'unverified'
    }
    
}, { timestamps: true });

// Encrypt password before saving to database
userModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// Method to generate JWT token
userModel.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
};

// COMPARE PASSWORD PAG NAG LLOGIN
userModel.methods.comparePassword = async function (inputtedPassword) {
    return await bcrypt.compare(inputtedPassword, this.password);
}

// Export the model using ES module syntax
const User = mongoose.model('User', userModel);
export default User;