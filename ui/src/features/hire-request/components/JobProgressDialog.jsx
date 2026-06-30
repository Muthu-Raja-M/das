import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    TextField,
    CircularProgress,
    Stack,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Divider,
    LinearProgress,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import API from "../../../api/axios";

const formatDateTime = (dateValue) => {
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).replace(",", "");
};

export default function JobProgressDialog({ open, onClose, hireRequestId, role, otherPartyName, jobRole, requestDate, currentRequestStatus }) {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Online");

    const fetchProgress = async () => {
        if (!hireRequestId) return;
        setLoading(true);
        setError("");
        try {
            const data = await API.get(`/hirerequest/progress/${hireRequestId}/`);
            setProgress(data);
        } catch (err) {
            console.error("Error loading progress:", err);
            setError(err?.response?.data?.error || "Failed to load job progress details");
        } finally {
            setProgress((prev) => prev); // fallback trigger refresh state
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchProgress();
            setOtpInput("");
            setPaymentAmount("");
            setPaymentMethod("Online");
        }
    }, [open, hireRequestId]);

    const handleVerifyOtp = async () => {
        if (!otpInput.trim()) return;
        setActionLoading(true);
        setError("");
        try {
            const data = await API.post(`/hirerequest/progress/${hireRequestId}/verify-otp/`, {
                otp: otpInput.trim(),
            });
            setProgress(data);
            setOtpInput("");
        } catch (err) {
            setError(err?.response?.data?.error || "Invalid OTP. Verification failed.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCompleteWork = async () => {
        setActionLoading(true);
        setError("");
        try {
            const data = await API.post(`/hirerequest/progress/${hireRequestId}/update/`, {
                step: 3,
            });
            setProgress(data);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to complete work");
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubmitPayment = async () => {
        if (!paymentAmount || parseInt(paymentAmount) <= 0) {
            setError("Please enter a valid payment amount");
            return;
        }
        setActionLoading(true);
        setError("");
        try {
            const data = await API.post(`/hirerequest/progress/${hireRequestId}/submit-payment/`, {
                payment_amount: parseInt(paymentAmount),
                payment_method: paymentMethod,
            });
            setProgress(data);
        } catch (err) {
            setError(err?.response?.data?.error || "Failed to submit payment");
        } finally {
            setActionLoading(false);
        }
    };

    // Calculate percentage based on current step
    const getProgressPercent = () => {
        if (!progress) return 0;
        if (progress.step === 1) return 25;
        if (progress.step === 2) return 50;
        if (progress.step === 3) return 75;
        if (progress.step === 4) return 100;
        return 0;
    };

    const CustomStepIcon = ({ index, active }) => {
        const stepNum = index + 1;
        const isCompleted = progress ? progress.step > stepNum || progress.step === 4 : false;
        const isActive = progress ? progress.step === stepNum : false;

        if (isCompleted || (stepNum === 1 && progress?.step >= 1)) {
            return (
                <Box
                    sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: "#1C6EA4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        boxShadow: "0 2px 8px rgba(28,110,164,0.4)",
                    }}
                >
                    <CheckIcon sx={{ fontSize: 16 }} />
                </Box>
            );
        }

        if (isActive) {
            return (
                <Box
                    sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        border: "2px solid #1C6EA4",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#1C6EA4",
                        fontWeight: 700,
                        fontSize: 12,
                    }}
                >
                    {stepNum}
                </Box>
            );
        }

        return (
            <Box
                sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2px solid #cbd5e1",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#64748b",
                    fontWeight: 700,
                    fontSize: 12,
                }}
            >
                {stepNum}
            </Box>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 4, overflow: "hidden" }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2.5, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1C6EA4", color: "#fff" }}>
                <Box>
                    <Typography variant="h6" fontWeight={700}>
                        Job Progress Tracker
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85 }}>
                        {role === "customer" ? "Employer" : "Customer"}: {otherPartyName}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <IconButton onClick={fetchProgress} size="small" sx={{ color: "#fff" }} disabled={loading}>
                        <RefreshIcon />
                    </IconButton>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ p: 3, backgroundColor: "#f8fafc" }}>
                {loading && !progress ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box>
                        {/* Header Details */}
                        <Box sx={{ mb: 3, p: 2, borderRadius: 3, backgroundColor: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Service Category
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} color="#1e293b">
                                        {jobRole || "-"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Request Date
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} color="#1e293b">
                                        {formatDateTime(requestDate).split(" ")[0] || "-"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Current Status
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        sx={{
                                            textTransform: "capitalize",
                                            color: String(currentRequestStatus).toLowerCase() === "accepted" || String(currentRequestStatus).toLowerCase() === "completed" ? "#22C55E" : "#ef4444",
                                        }}
                                    >
                                        {currentRequestStatus || "-"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Overall Progress
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} color="#1e293b">
                                        {getProgressPercent()}% Completed
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={getProgressPercent()}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: "#e2e8f0",
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor: "#1C6EA4",
                                            borderRadius: 4,
                                            transition: "transform 0.4s ease",
                                        }
                                    }}
                                />
                            </Box>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Timeline / Stepper */}
                        <Stepper
                            orientation="vertical"
                            activeStep={progress ? progress.step - 1 : 0}
                            sx={{
                                "& .MuiStepConnector-line": {
                                    borderColor: "#1C6EA4",
                                    borderWidth: 2,
                                    minHeight: 30,
                                },
                            }}
                        >
                            {/* Step 1: Work Accepted */}
                            <Step completed={progress ? progress.step > 1 : false}>
                                <StepLabel StepIconComponent={(props) => <CustomStepIcon index={0} {...props} />}>
                                    <Typography fontWeight={700} color={progress?.step >= 1 ? "#1e293b" : "#64748b"}>
                                        Work Accepted
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Accepted on: {progress ? formatDateTime(progress.accepted_at) : "-"}
                                    </Typography>
                                </StepLabel>
                                <StepContent>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Job request has been approved. The worker is preparing to travel to the location.
                                    </Typography>
                                </StepContent>
                            </Step>

                            {/* Step 2: Location Arrived */}
                            <Step completed={progress ? progress.step > 2 : false}>
                                <StepLabel StepIconComponent={(props) => <CustomStepIcon index={1} {...props} />}>
                                    <Typography fontWeight={700} color={progress?.step >= 2 ? "#1e293b" : "#64748b"}>
                                        Location Arrived
                                    </Typography>
                                    {progress?.arrived_at && (
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Arrived on: {formatDateTime(progress.arrived_at)}
                                        </Typography>
                                    )}
                                    {progress && progress.step === 1 && (
                                        <Box sx={{ mt: 1 }}>
                                            {role === "employer" ? (
                                                <Stack spacing={1.5} sx={{ maxWidth: 280 }}>
                                                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                                                        Enter OTP from customer to verify arrival:
                                                    </Typography>
                                                    <Stack direction="row" spacing={1}>
                                                        <TextField
                                                            size="small"
                                                            placeholder="Enter 6-Digit OTP"
                                                            value={otpInput}
                                                            onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                            disabled={actionLoading}
                                                            sx={{ backgroundColor: "#fff" }}
                                                        />
                                                        <Button
                                                            variant="contained"
                                                            onClick={handleVerifyOtp}
                                                            disabled={actionLoading || otpInput.length !== 6}
                                                            sx={{ textTransform: "none", fontWeight: 700, backgroundColor: "#1C6EA4" }}
                                                        >
                                                            {actionLoading ? <CircularProgress size={16} color="inherit" /> : "Verify"}
                                                        </Button>
                                                    </Stack>
                                                </Stack>
                                            ) : (
                                                <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", display: "inline-block" }}>
                                                    <Typography variant="body2" fontWeight={700} color="#1e3a8a">
                                                        OTP for Arrival: {progress.otp}
                                                    </Typography>
                                                    <Typography variant="caption" color="#1e3a8a" sx={{ opacity: 0.85 }}>
                                                        Provide this OTP to the employer when they arrive.
                                                    </Typography>
                                                    <Typography variant="caption" display="block" fontWeight={600} color="#0369a1" sx={{ mt: 0.5 }}>
                                                        OTP Status: {progress.otp_status.toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </StepLabel>
                                <StepContent>
                                    <Typography variant="body2" color="text.secondary">
                                        Worker arrived at location and verification was successfully completed.
                                    </Typography>
                                </StepContent>
                            </Step>

                            {/* Step 3: Work Completed */}
                            <Step completed={progress ? progress.step > 3 : false}>
                                <StepLabel StepIconComponent={(props) => <CustomStepIcon index={2} {...props} />}>
                                    <Typography fontWeight={700} color={progress?.step >= 3 ? "#1e293b" : "#64748b"}>
                                        Work Completed
                                    </Typography>
                                    {progress?.completed_at && (
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Completed on: {formatDateTime(progress.completed_at)}
                                        </Typography>
                                    )}
                                    {progress && progress.step === 2 && (
                                        <Box sx={{ mt: 1 }}>
                                            {role === "employer" ? (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handleCompleteWork}
                                                    disabled={actionLoading}
                                                    sx={{ textTransform: "none", fontWeight: 700 }}
                                                >
                                                    {actionLoading ? <CircularProgress size={16} color="inherit" /> : "Complete Work"}
                                                </Button>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                                    Waiting for worker to mark job completed.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </StepLabel>
                                <StepContent>
                                    <Typography variant="body2" color="text.secondary">
                                        Worker completed the tasks. Waiting for payment submission.
                                    </Typography>
                                </StepContent>
                            </Step>

                            {/* Step 4: Payment Completed */}
                            <Step completed={progress ? progress.step === 4 : false}>
                                <StepLabel StepIconComponent={(props) => <CustomStepIcon index={3} {...props} />}>
                                    <Typography fontWeight={700} color={progress?.step === 4 ? "#1e293b" : "#64748b"}>
                                        Payment Completed
                                    </Typography>
                                    {progress && progress.step === 4 && (
                                        <Box sx={{ mt: 1.5, p: 2, borderRadius: 2, backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", width: "100%", maxWidth: 360 }}>
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" fontWeight={700} color="#166534">
                                                    Payment Amount: ₹{progress.payment_amount}
                                                </Typography>
                                                <Typography variant="body2" color="#166534">
                                                    Status: <strong>Paid</strong>
                                                </Typography>
                                                <Typography variant="body2" color="#166534">
                                                    Time: {formatDateTime(progress.paid_at)}
                                                </Typography>
                                                {progress.payment_method && (
                                                    <Typography variant="body2" color="#166534">
                                                        Method: {progress.payment_method}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </Box>
                                    )}
                                    {progress && progress.step === 3 && (
                                        <Box sx={{ mt: 1.5 }}>
                                            {role === "employer" ? (
                                                <Stack spacing={1.5} sx={{ maxWidth: 280 }}>
                                                    <TextField
                                                        size="small"
                                                        label="Payment Amount (₹)"
                                                        type="number"
                                                        value={paymentAmount}
                                                        onChange={(e) => setPaymentAmount(e.target.value.replace(/\D/g, ""))}
                                                        disabled={actionLoading}
                                                        sx={{ backgroundColor: "#fff" }}
                                                    />
                                                    <FormControl size="small" fullWidth sx={{ backgroundColor: "#fff" }}>
                                                        <InputLabel>Payment Method</InputLabel>
                                                        <Select
                                                            value={paymentMethod}
                                                            label="Payment Method"
                                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                                            disabled={actionLoading}
                                                        >
                                                            <MenuItem value="Online">Online Payment</MenuItem>
                                                            <MenuItem value="Cash">Cash</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleSubmitPayment}
                                                        disabled={actionLoading || !paymentAmount}
                                                        sx={{ textTransform: "none", fontWeight: 700, backgroundColor: "#1C6EA4" }}
                                                    >
                                                        {actionLoading ? <CircularProgress size={16} color="inherit" /> : "Submit Payment"}
                                                    </Button>
                                                </Stack>
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                                                    Waiting for payment verification and receipt.
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </StepLabel>
                            </Step>
                        </Stepper>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}
