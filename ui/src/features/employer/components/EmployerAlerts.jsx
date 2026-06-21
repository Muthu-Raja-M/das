import React, { useState, useEffect } from "react";
import {
    Badge,
    Box,
    IconButton,
    Paper,
    Popover,
    Typography,
    Button,
    Divider,
    Zoom,
    Stack,
    Chip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import API from "../../../api/axios";

export default function Employeralerts({ employer }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [alertData, setAlertData] = useState({
        status: "not_submitted",
        message: "",
        count: 0,
        created_at: null,
    });
    const [loading, setLoading] = useState(false);
    const [isRead, setIsRead] = useState(false);
    const [removed, setRemoved] = useState(false);

    const email = employer?.email || localStorage.getItem("email");

    const readKey = `employer_alert_read_${email}`;
    const removeKey = `employer_alert_removed_${email}`;

    const fetchEmployerAlert = async () => {
        try {
            if (!email) return;

            setLoading(true);

            const response = await API.get(
                `/verification/alerts/employer/?email=${encodeURIComponent(email)}`
            );

            const data = response?.data ? response.data : response;

            const finalData = {
                ...data,
                created_at: data?.created_at || data?.submitted_at || new Date().toISOString(),
            };

            setAlertData(finalData);

            const savedStatus = localStorage.getItem(readKey);
            const removedStatus = localStorage.getItem(removeKey);

            setIsRead(savedStatus === finalData?.status);
            setRemoved(removedStatus === finalData?.status);

            if (finalData?.status) {
                localStorage.setItem(`verification_status_${email}`, finalData.status);
            }
        } catch (error) {
            console.log("Employer alert fetch error:", error.response?.data || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployerAlert();
    }, [email]);

    const open = Boolean(anchorEl);

    const status = String(alertData?.status || "").toLowerCase();
    const message = alertData?.message || "";

    const hasAlert =
        (status === "approved" || status === "rejected") && !removed;

    const badgeCount = hasAlert && !isRead ? 1 : 0;

    const isRejected = status === "rejected";

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);

        if (hasAlert) {
            localStorage.setItem(readKey, status);
            setIsRead(true);
        }

        fetchEmployerAlert();
    };

    const handleRemoveAlert = () => {
        if (status) {
            localStorage.setItem(removeKey, status);
        }

        setRemoved(true);
        setAlertData({
            status: "not_submitted",
            message: "",
            count: 0,
            created_at: null,
        });
    };

    const formatDateTime = (dateValue) => {
        if (!dateValue) return "Just now";

        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return "Just now";

        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    transition: "0.3s ease",
                    "&:hover": {
                        transform: "scale(1.12) rotate(-5deg)",
                        backgroundColor: "#EAF4FB",
                    },
                }}
            >
                <Badge badgeContent={badgeCount} color="error">
                    <NotificationsIcon sx={{ color: "#1C6EA4", fontSize: 30 }} />
                </Badge>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        overflow: "hidden",
                    },
                }}
            >
                <Zoom in={open}>
                    <Paper
                        sx={{
                            width: 380,
                            p: 2.5,
                            borderRadius: 4,
                            boxShadow: "0 18px 45px rgba(0,0,0,0.20)",
                            background: "linear-gradient(180deg, #ffffff 0%, #f4f9ff 100%)",
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography fontWeight={900} fontSize={19}>
                                    Notifications
                                </Typography>

                                <Typography fontSize={13} color="text.secondary">
                                    Employer verification updates
                                </Typography>
                            </Box>

                            <Chip
                                label={badgeCount > 0 ? `${badgeCount} New` : "Seen"}
                                size="small"
                                color={badgeCount > 0 ? "error" : "default"}
                                sx={{ fontWeight: 700 }}
                            />
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {loading ? (
                            <Box sx={{ py: 3, textAlign: "center" }}>
                                <Typography fontSize={14}>Loading alerts...</Typography>
                            </Box>
                        ) : hasAlert ? (
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    border: `1px solid ${isRejected ? "#fecdd3" : "#bbf7d0"}`,
                                    background: isRejected
                                        ? "linear-gradient(135deg, #fff1f2, #ffffff)"
                                        : "linear-gradient(135deg, #ecfdf5, #ffffff)",
                                    transition: "0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-3px)",
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                                    },
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    {isRejected ? (
                                        <ErrorIcon sx={{ color: "#dc2626", fontSize: 30 }} />
                                    ) : (
                                        <CheckCircleIcon sx={{ color: "#15803d", fontSize: 30 }} />
                                    )}

                                    <Box>
                                        <Typography
                                            fontWeight={900}
                                            sx={{ color: isRejected ? "#dc2626" : "#15803d" }}
                                        >
                                            {isRejected
                                                ? "Verification Rejected"
                                                : "Verification Approved"}
                                        </Typography>

                                        <Stack direction="row" spacing={0.6} alignItems="center">
                                            <AccessTimeIcon sx={{ fontSize: 15, color: "#6b7280" }} />
                                            <Typography fontSize={12.5} color="text.secondary">
                                                {formatDateTime(alertData?.created_at)}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>

                                <Typography fontSize={14} sx={{ mt: 1.8, color: "#374151", lineHeight: 1.6 }}>
                                    {message ||
                                        (isRejected
                                            ? "Your verification was rejected by Admin."
                                            : "Your account has been verified by Admin.")}
                                </Typography>

                                {!isRejected && alertData?.employer_id && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 1.4,
                                            borderRadius: 2.5,
                                            backgroundColor: "#ffffff",
                                            border: "1px dashed #15803d",
                                        }}
                                    >
                                        <Typography fontSize={13} color="text.secondary">
                                            Your Employer ID
                                        </Typography>
                                        <Typography fontSize={17} fontWeight={900}>
                                            {alertData.employer_id}
                                        </Typography>
                                    </Box>
                                )}

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteOutlineIcon />}
                                    onClick={handleRemoveAlert}
                                    sx={{
                                        mt: 2,
                                        textTransform: "none",
                                        borderRadius: 3,
                                        fontWeight: 800,
                                    }}
                                >
                                    Remove Message
                                </Button>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    backgroundColor: "#f9fafb",
                                    textAlign: "center",
                                    border: "1px dashed #d1d5db",
                                }}
                            >
                                <Typography fontWeight={800}>No new alerts</Typography>
                                <Typography fontSize={13} color="text.secondary">
                                    You are all caught up.
                                </Typography>
                            </Box>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => setAnchorEl(null)}
                            sx={{
                                mt: 2,
                                textTransform: "none",
                                borderRadius: 3,
                                py: 1,
                                fontWeight: 800,
                                backgroundColor: "#1C6EA4",
                                "&:hover": {
                                    backgroundColor: "#155a87",
                                },
                            }}
                        >
                            Close
                        </Button>
                    </Paper>
                </Zoom>
            </Popover>
        </>
    );
}