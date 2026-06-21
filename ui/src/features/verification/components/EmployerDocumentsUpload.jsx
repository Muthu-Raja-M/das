import React, { useRef, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Avatar,
    Stack,
    Divider,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BadgeIcon from "@mui/icons-material/Badge";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import { useNavigate } from "react-router-dom";
import { submitEmployerVerification } from "../services/employerVerificationService";

const uploadCardStyle = {
    borderRadius: 4,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    height: "100%",
};

const previewBoxStyle = {
    width: "100%",
    height: 180,
    borderRadius: 3,
    border: "1px dashed #cbd5e1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#f8fafc",
};

function UploadCard({
    title,
    subtitle,
    icon,
    file,
    preview,
    onUpload,
    onRemove,
    accept = "image/*",
    isFace = false,
}) {
    const inputRef = useRef(null);

    return (
        <Card sx={uploadCardStyle}>
            <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: "#eaf4fb", color: "#1C6EA4", width: 44, height: 44 }}>
                        {icon}
                    </Avatar>
                    <Box>
                        <Typography fontWeight={700} fontSize={16}>
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={previewBoxStyle}>
                    {preview ? (
                        isFace ? (
                            <Avatar
                                src={preview}
                                alt={title}
                                sx={{ width: 130, height: 130, border: "3px solid #dbeafe" }}
                            />
                        ) : (
                            <Box
                                component="img"
                                src={preview}
                                alt={title}
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        )
                    ) : (
                        <Box sx={{ textAlign: "center", px: 2 }}>
                            <CloudUploadIcon sx={{ fontSize: 36, color: "#94a3b8", mb: 1 }} />
                            <Typography fontSize={14} color="text.secondary">
                                No image uploaded
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} mt={2}>
                    <input
                        ref={inputRef}
                        hidden
                        type="file"
                        accept={accept}
                        onChange={onUpload}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => inputRef.current?.click()}
                        sx={{
                            borderRadius: 2.5,
                            textTransform: "none",
                            fontWeight: 600,
                            backgroundColor: "#1C6EA4",
                            "&:hover": { backgroundColor: "#155a87" },
                        }}
                    >
                        {file ? "Change Image" : "Upload Image"}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={onRemove}
                        disabled={!file}
                        sx={{ borderRadius: 2.5, textTransform: "none", fontWeight: 600 }}
                    >
                        Remove
                    </Button>
                </Stack>

                {file && (
                    <Typography
                        variant="body2"
                        sx={{ mt: 1.5, color: "#334155", wordBreak: "break-word" }}
                    >
                        {file.name}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}

export default function EmployerDocumentsUpload() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        faceImage: null,
        aadharImage: null,
        panImage: null,
        licenceImage: null,
    });

    const [preview, setPreview] = useState({
        faceImage: "",
        aadharImage: "",
        panImage: "",
        licenceImage: "",
    });

    const [loading, setLoading] = useState(false);
    const [snack, setSnack] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // ✅ Read from localStorage using useState so it's captured on mount
    const [verificationStatus] = useState(
        () => localStorage.getItem("verification_status") || "not_submitted"
    );

    // ✅ Rejected = backend returned "rejected" status (synced from dashboard)
    const isRejected = verificationStatus === "rejected";

    const showSnack = (message, severity = "success") => {
        setSnack({ open: true, message, severity });
    };

    const getEmployerEmail = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            return user?.email || localStorage.getItem("email") || "";
        } catch {
            return localStorage.getItem("email") || "";
        }
    };

    const handleFileChange = (field) => (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const imageUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, [field]: file }));
        setPreview((prev) => ({ ...prev, [field]: imageUrl }));
    };

    const handleRemoveFile = (field) => () => {
        setFormData((prev) => ({ ...prev, [field]: null }));
        setPreview((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async () => {
        if (!formData.faceImage || !formData.aadharImage || !formData.panImage) {
            showSnack("Please upload face, Aadhaar and PAN images", "error");
            return;
        }

        try {
            setLoading(true);

            const employerEmail = getEmployerEmail();
            if (!employerEmail) {
                showSnack("Employer email missing. Please login again.", "error");
                return;
            }

            await submitEmployerVerification({
                employerEmail,
                faceFile: formData.faceImage,
                aadharFile: formData.aadharImage,
                panFile: formData.panImage,
                drivingFile: formData.licenceImage,
            });

            // ✅ After resubmit, set back to pending
            localStorage.setItem("verification_status", "pending");

            showSnack(
                isRejected
                    ? "Documents re-submitted successfully"
                    : "Documents submitted successfully",
                "success"
            );

            setTimeout(() => {
                navigate("/employerdashboard");
            }, 1200);
        } catch (error) {
            console.error("Verification submit error:", error);
            showSnack(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.message ||
                "Failed to submit verification documents",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                p: { xs: 2, md: 3 },
                backgroundColor: "#ffffff",
                borderRadius: 4,
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                maxWidth: 1200,
                mx: "auto",
                mt: 4,
            }}
        >
            <Box mb={2}>
                <Typography variant="h5" fontWeight={700} sx={{ color: "#0f172a", mb: 0.5 }}>
                    Employer Documents Upload
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Upload your verification documents. After submission, admin will review them.
                </Typography>
            </Box>

            {/* ✅ Show rejection warning banner */}
            {isRejected && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    Your documents were <strong>rejected</strong> by the admin. Please re-upload
                    correct documents and click <strong>Verify</strong> to resubmit.
                </Alert>
            )}

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <UploadCard
                        title="Employer Face Image"
                        subtitle="Upload clear profile face image"
                        icon={<FaceRetouchingNaturalIcon />}
                        file={formData.faceImage}
                        preview={preview.faceImage}
                        onUpload={handleFileChange("faceImage")}
                        onRemove={handleRemoveFile("faceImage")}
                        isFace
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <UploadCard
                        title="Aadhaar Card Image"
                        subtitle="Upload Aadhaar card image"
                        icon={<CreditCardIcon />}
                        file={formData.aadharImage}
                        preview={preview.aadharImage}
                        onUpload={handleFileChange("aadharImage")}
                        onRemove={handleRemoveFile("aadharImage")}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <UploadCard
                        title="PAN Card Image"
                        subtitle="Upload PAN card image"
                        icon={<BadgeIcon />}
                        file={formData.panImage}
                        preview={preview.panImage}
                        onUpload={handleFileChange("panImage")}
                        onRemove={handleRemoveFile("panImage")}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <UploadCard
                        title="Driving Licence Image"
                        subtitle="Required only for Driver role"
                        icon={<DriveEtaIcon />}
                        file={formData.licenceImage}
                        preview={preview.licenceImage}
                        onUpload={handleFileChange("licenceImage")}
                        onRemove={handleRemoveFile("licenceImage")}
                    />
                </Grid>
            </Grid>

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4, justifyContent: "flex-end" }}
            >
                <Button
                    variant="outlined"
                    onClick={() => navigate("/employerdashboard")}
                    sx={{ textTransform: "none", borderRadius: 2.5 }}
                    disabled={loading}
                >
                    Cancel
                </Button>

                {/* ✅ Button shows "Verify" when rejected, "Submit" otherwise */}
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        textTransform: "none",
                        borderRadius: 2.5,
                        backgroundColor: isRejected ? "#dc2626" : "#1C6EA4",
                        minWidth: 180,
                        "&:hover": {
                            backgroundColor: isRejected ? "#b91c1c" : "#155a87",
                        },
                    }}
                >
                    {loading ? (
                        <CircularProgress size={22} sx={{ color: "#fff" }} />
                    ) : isRejected ? (
                        "Verify"
                    ) : (
                        "Submit"
                    )}
                </Button>
            </Stack>

            <Snackbar
                open={snack.open}
                autoHideDuration={3000}
                onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
            >
                <Alert
                    severity={snack.severity}
                    onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
                    sx={{ width: "100%" }}
                >
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}