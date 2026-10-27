
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const router = express.Router();
const db = require("../config/db");

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const frontendUrl = (
    process.env.FRONTEND_URL || "http://localhost:5173"
).replace(/\/$/, "");

// Register a new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: "Please fill in all fields."
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long."
        });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();

        db.query(
            "SELECT id FROM users WHERE email = ?",
            [normalizedEmail],
            async (err, results) => {
                if (err) {
                    console.error("Registration database error:", err);
                    return res.status(500).json({
                        message: "Database error. Please try again."
                    });
                }

                if (results.length > 0) {
                    return res.status(409).json({
                        message: "This email is already registered."
                    });
                }

                try {
                    const hashedPassword = await bcrypt.hash(password, 12);

                    db.query(
                        `INSERT INTO users (name, email, password)
                         VALUES (?, ?, ?)`,
                        [name.trim(), normalizedEmail, hashedPassword],
                        (insertError) => {
                            if (insertError) {
                                console.error("User creation error:", insertError);
                                return res.status(500).json({
                                    message: "Could not create your account."
                                });
                            }

                            return res.status(201).json({
                                message: "Registration successful! Please log in."
                            });
                        }
                    );
                } catch (hashError) {
                    console.error("Password hashing error:", hashError);
                    return res.status(500).json({
                        message: "Could not process your registration."
                    });
                }
            }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
});

// Request a password-reset email
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
            message: "Please enter your email address."
        });
    }

    // Do not attempt to send email until SMTP is configured
    if (
        !process.env.SMTP_HOST ||
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASS ||
        !process.env.SMTP_FROM
    ) {
        return res.status(503).json({
            message: "Email service is not configured yet."
        });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();

        db.query(
            "SELECT id, email FROM users WHERE email = ?",
            [normalizedEmail],
            async (err, results) => {
                if (err) {
                    console.error("Password-reset lookup error:", err);
                    return res.status(500).json({
                        message: "Unable to process your request."
                    });
                }

                // Use the same response for unknown email addresses
                if (results.length === 0) {
                    return res.json({
                        message: "If that account exists, a reset email will be sent."
                    });
                }

                try {
                    // Generate a secure, random, single-use token
                    const resetToken = crypto.randomBytes(32).toString("hex");
                    const tokenHash = crypto
                        .createHash("sha256")
                        .update(resetToken)
                        .digest("hex");

                    // Token expires in 15 minutes
                    db.query(
                        `UPDATE users
                         SET reset_token = ?,
                             reset_token_expiry = DATE_ADD(NOW(), INTERVAL 15 MINUTE)
                         WHERE id = ?`,
                        [tokenHash, results[0].id],
                        async (updateError) => {
                            if (updateError) {
                                console.error("Reset-token database error:", updateError);
                                return res.status(500).json({
                                    message: "Unable to process your request."
                                });
                            }

                            const resetLink =
                                `${frontendUrl}/reset-password?token=${resetToken}`;

                            try {
                                await transporter.sendMail({
                                    from: process.env.SMTP_FROM,
                                    to: results[0].email,
                                    subject: "Reset your Adaptive Minds password",
                                    text:
                                        `We received a request to reset your password.\n\n` +
                                        `Open this link within 15 minutes:\n${resetLink}\n\n` +
                                        `If you did not request this, you can ignore this email.`,
                                    html: `
                                        <p>We received a request to reset your Adaptive Minds password.</p>
                                        <p>This link expires in <strong>15 minutes</strong>.</p>
                                        <p><a href="${resetLink}">Reset my password</a></p>
                                        <p>If you did not request this, you can ignore this email.</p>
                                    `
                                });

                                return res.json({
                                    message: "If that account exists, a reset email will be sent."
                                });
                            } catch (mailError) {
                                console.error("Password-reset email error:", mailError);

                                // Invalidate the token if the email could not be sent
                                db.query(
                                    `UPDATE users
                                     SET reset_token = NULL,
                                         reset_token_expiry = NULL
                                     WHERE id = ?`,
                                    [results[0].id],
                                    () => {}
                                );

                                return res.status(503).json({
                                    message: "Could not send the reset email. Please try again later."
                                });
                            }
                        }
                    );
                } catch (tokenError) {
                    console.error("Reset-token generation error:", tokenError);
                    return res.status(500).json({
                        message: "Unable to process your request."
                    });
                }
            }
        );
    } catch (error) {
        console.error("Forgot-password error:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
});

// Complete the password reset
router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;

    if (
        typeof token !== "string" ||
        typeof password !== "string" ||
        !token ||
        !password
    ) {
        return res.status(400).json({
            message: "Reset token and new password are required."
        });
    }

    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long."
        });
    }

    try {
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        db.query(
            `SELECT id FROM users
             WHERE reset_token = ?
               AND reset_token_expiry > NOW()`,
            [tokenHash],
            async (err, results) => {
                if (err) {
                    console.error("Reset-token verification error:", err);
                    return res.status(500).json({
                        message: "Unable to reset your password."
                    });
                }

                if (results.length === 0) {
                    return res.status(400).json({
                        message: "This reset link is invalid or has expired."
                    });
                }

                try {
                    const hashedPassword = await bcrypt.hash(password, 12);

                    db.query(
                        `UPDATE users
                         SET password = ?,
                             reset_token = NULL,
                             reset_token_expiry = NULL
                         WHERE id = ?`,
                        [hashedPassword, results[0].id],
                        (updateError, result) => {
                            if (updateError) {
                                console.error("Password update error:", updateError);
                                return res.status(500).json({
                                    message: "Could not update your password."
                                });
                            }

                            if (result.affectedRows === 0) {
                                return res.status(400).json({
                                    message: "Unable to reset your password. Please try again."
                                });
                            }

                            return res.json({
                                message: "Password reset successful. You can now log in."
                            });
                        }
                    );
                } catch (hashError) {
                    console.error("New password hashing error:", hashError);
                    return res.status(500).json({
                        message: "Could not update your password."
                    });
                }
            }
        );
    } catch (error) {
        console.error("Reset-password error:", error);
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
});

module.exports = router;
