import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail } from '../mailtrap/emails.js';

export const signup = async (req, res) => {
    const { email, password, name } = req.body
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required")
        }

        const userAlreadyExists = await User.findOne({ email })
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(Math.random() * 1000000).toString()

        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        })
        await newUser.save()

        //jwt
        generateTokenAndSetCookie(res, newUser._id);

        sendVerificationEmail(newUser.email, verificationToken)

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...newUser._doc,
                password: undefined,
            }
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.name, user.email)

        res.json({
            success: false,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("error in verifyEmail", error)
        res.status(400).json({ success: false, message: "Server Error" })
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetPasswordExpiresAt = new Date() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken
        user.resetPasswordTokenExpiresAt = resetPasswordExpiresAt
        await user.save()

        //send email
        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // update password
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect password" })
        }

        generateTokenAndSetCookie(res, user._id)

        user.lastLogin = new Date()
        await user.save()

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            },
        });
    } catch (error) {
        console.log("error in login", error)
        res.status(400).json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logged out successfully" })
}