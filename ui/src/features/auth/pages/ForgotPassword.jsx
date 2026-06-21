import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    LinearProgress,
    CircularProgress,
} from "@mui/material";
import {
    EmailOutlined,
    LockOutlined,
    Visibility,
    VisibilityOff,
    Refresh,
    VerifiedUserOutlined,
} from "@mui/icons-material";
import {
    sendOtpService,
    verifyOtpService,
    resetPasswordService,
} from "../services/password";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
    const [form, setForm] = useState({
        new_password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [timer, setTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const otpRefs = useRef([]);

    const otp = otpValues.join("");

    const navigate = useNavigate();
    useEffect(() => {
        let interval;

        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timer]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
    };

    const clearMessage = () => {
        setMessage({ type: "", text: "" });
    };

    const getStepProgress = () => {
        if (step === 1) return 33;
        if (step === 2) return 66;
        return 100;
    };

    const validateEmail = (value) => {
        return /\S+@\S+\.\S+/.test(value);
    };

    const handleSendOtp = async () => {
        clearMessage();

        if (!email.trim()) {
            showMessage("error", "Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            showMessage("error", "Please enter a valid email address");
            return;
        }

        try {
            setLoading(true);

            const res = await sendOtpService({
                email: email.trim().toLowerCase(),
            });

            showMessage("success", res?.message || "OTP sent successfully to your email");
            setStep(2);
            setTimer(RESEND_SECONDS);
            setOtpValues(Array(OTP_LENGTH).fill(""));

            setTimeout(() => {
                otpRefs.current[0]?.focus();
            }, 100);
        } catch (error) {
            showMessage(
                "error",
                error?.response?.data?.error || error?.message || "Failed to send OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        clearMessage();

        if (otp.length !== OTP_LENGTH) {
            showMessage("error", "Please enter the complete 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await verifyOtpService({
                email: email.trim().toLowerCase(),
                otp,
            });

            showMessage("success", res?.message || "OTP verified successfully");
            setStep(3);
        } catch (error) {
            showMessage(
                "error",
                error?.response?.data?.error || error?.message || "Invalid OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        clearMessage();

        if (!form.new_password || !form.confirm_password) {
            showMessage("error", "Please fill all password fields");
            return;
        }

        if (form.new_password.length < 6) {
            showMessage("error", "Password must be at least 6 characters");
            return;
        }

        if (form.new_password !== form.confirm_password) {
            showMessage("error", "Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const res = await resetPasswordService({
                email: email.trim().toLowerCase(),
                new_password: form.new_password,
                confirm_password: form.confirm_password,
            });

            showMessage("success", res?.message || "Password reset successfully");

            setTimeout(() => {
                // Reset state
                setStep(1);
                setEmail("");
                setOtpValues(Array(OTP_LENGTH).fill(""));
                setForm({
                    new_password: "",
                    confirm_password: "",
                });
                setTimer(0);

                // 🔥 Redirect to login page
                navigate("/login");
            }, 1500);
        } catch (error) {
            showMessage(
                "error",
                error?.response?.data?.error ||
                error?.message ||
                "Failed to reset password"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;

        clearMessage();

        try {
            setLoading(true);

            const res = await sendOtpService({
                email: email.trim().toLowerCase(),
            });

            showMessage("success", res?.message || "OTP resent successfully");
            setTimer(RESEND_SECONDS);
            setOtpValues(Array(OTP_LENGTH).fill(""));

            setTimeout(() => {
                otpRefs.current[0]?.focus();
            }, 100);
        } catch (error) {
            showMessage(
                "error",
                error?.response?.data?.error || error?.message || "Failed to resend OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        const cleanValue = value.replace(/\D/g, "");

        if (!cleanValue) {
            const newOtp = [...otpValues];
            newOtp[index] = "";
            setOtpValues(newOtp);
            return;
        }

        const newOtp = [...otpValues];
        newOtp[index] = cleanValue.slice(-1);
        setOtpValues(newOtp);

        if (index < OTP_LENGTH - 1) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

        if (!pastedData) return;

        const newOtp = Array(OTP_LENGTH).fill("");
        pastedData.split("").forEach((char, i) => {
            newOtp[i] = char;
        });

        setOtpValues(newOtp);

        const focusIndex = Math.min(pastedData.length, OTP_LENGTH) - 1;
        if (focusIndex >= 0) {
            otpRefs.current[focusIndex]?.focus();
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card
                sx={{
                    borderRadius: 5,
                    overflow: "hidden",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(25, 118, 210, 0.08)",
                }}
            >
                <Box
                    sx={{
                        px: 4,
                        pt: 4,
                        pb: 2,
                        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <VerifiedUserOutlined sx={{ color: "#1976d2" }} />
                        <Typography variant="h4" fontWeight={800}>
                            Forgot Password
                        </Typography>
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Secure your account with email OTP verification
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={getStepProgress()}
                        sx={{
                            height: 8,
                            borderRadius: 10,
                            backgroundColor: "#e3f2fd",
                        }}
                    />

                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Typography variant="caption" fontWeight={step >= 1 ? 700 : 500} color={step >= 1 ? "primary" : "text.secondary"}>
                            Email
                        </Typography>
                        <Typography variant="caption" fontWeight={step >= 2 ? 700 : 500} color={step >= 2 ? "primary" : "text.secondary"}>
                            OTP Verify
                        </Typography>
                        <Typography variant="caption" fontWeight={step >= 3 ? 700 : 500} color={step >= 3 ? "primary" : "text.secondary"}>
                            Reset
                        </Typography>
                    </Stack>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    {message.text && (
                        <Alert severity={message.type || "info"} sx={{ mb: 3, borderRadius: 2 }}>
                            {message.text}
                        </Alert>
                    )}

                    {step === 1 && (
                        <Box>
                            <Typography variant="h6" fontWeight={700} mb={1}>
                                Enter your email
                            </Typography>

                            <Typography variant="body2" color="text.secondary" mb={3}>
                                We’ll send a 6-digit OTP to your registered email address.
                            </Typography>

                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                placeholder="Enter your registered email"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSendOtp}
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: "15px",
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                            </Button>
                        </Box>
                    )}

                    {step === 2 && (
                        <Box>
                            <Typography variant="h6" fontWeight={700} mb={1}>
                                Verify OTP
                            </Typography>

                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Enter the 6-digit OTP sent to{" "}
                                <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
                                    {email}
                                </Box>
                            </Typography>

                            <Stack direction="row" spacing={1.2} justifyContent="center" mb={3} onPaste={handleOtpPaste}>
                                {otpValues.map((value, index) => (
                                    <TextField
                                        key={index}
                                        inputRef={(el) => (otpRefs.current[index] = el)}
                                        value={value}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        inputProps={{
                                            maxLength: 1,
                                            style: {
                                                textAlign: "center",
                                                fontSize: "22px",
                                                fontWeight: 700,
                                                padding: "12px 0",
                                            },
                                        }}
                                        sx={{
                                            width: { xs: 44, sm: 52 },
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 3,
                                            },
                                        }}
                                    />
                                ))}
                            </Stack>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: "15px",
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
                            </Button>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={1.5}
                                mt={2.5}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {timer > 0 ? `Resend OTP in ${timer}s` : "Didn’t receive the OTP?"}
                                </Typography>

                                <Button
                                    startIcon={<Refresh />}
                                    onClick={handleResendOtp}
                                    disabled={timer > 0 || loading}
                                    sx={{ textTransform: "none", fontWeight: 700 }}
                                >
                                    Resend OTP
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    {step === 3 && (
                        <Box>
                            <Typography variant="h6" fontWeight={700} mb={1}>
                                Create new password
                            </Typography>

                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Your OTP is verified. Set a strong new password.
                            </Typography>

                            <TextField
                                fullWidth
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                value={form.new_password}
                                onChange={(e) =>
                                    setForm({ ...form, new_password: e.target.value })
                                }
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={form.confirm_password}
                                onChange={(e) =>
                                    setForm({ ...form, confirm_password: e.target.value })
                                }
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlined color="primary" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleResetPassword}
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    fontSize: "15px",
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ForgotPassword;