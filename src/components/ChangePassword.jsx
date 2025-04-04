import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/Auth.css";

function ChangePassword() {
    const [step, setStep] = useState(1); // 1: current password, 2: OTP verification, 3: new password
    const [currentPassword, setCurrentPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const verifyCurrentPassword = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.post("/api/verify-password/", {
                current_password: currentPassword,
            });
            // If verification successful, send OTP
            await sendOTP();
            setStep(2);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                    "Failed to verify current password",
            );
        } finally {
            setLoading(false);
        }
    };

    const sendOTP = async () => {
        try {
            await axios.post("/api/change-password/request-otp/");
            setSuccess("OTP sent to your email");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
            throw err; // Propagate error to caller
        }
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.post("/api/change-password/verify-otp/", { otp });
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.error || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);

        try {
            await axios.post("/api/change-password/reset/", {
                new_password: newPassword,
                otp: otp,
            });
            setSuccess("Password changed successfully!");
            // Reset all fields
            setCurrentPassword("");
            setOtp("");
            setNewPassword("");
            setConfirmNewPassword("");
            setStep(1);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <h2>Change Password</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {step === 1 && (
                <form onSubmit={verifyCurrentPassword} className="auth-form">
                    <div className="form-group password-group">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <i
                            onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                            }
                            className={`fas fa-eye${
                                showCurrentPassword ? "-slash" : ""
                            }`}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Continue"}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={verifyOTP} className="auth-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={changePassword} className="auth-form">
                    <div className="form-group password-group">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <i
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className={`fas fa-eye${
                                showNewPassword ? "-slash" : ""
                            }`}
                        />
                    </div>
                    <div className="form-group password-group">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                            }
                            required
                        />
                        <i
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className={`fas fa-eye${
                                showConfirmPassword ? "-slash" : ""
                            }`}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Changing Password..." : "Change Password"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default ChangePassword;
