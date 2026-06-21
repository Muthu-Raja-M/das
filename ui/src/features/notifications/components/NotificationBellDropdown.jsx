import React, { useState } from "react";
import {
    Badge,
    Box,
    IconButton,
    Popover,
    Typography,
    Button,
    Divider,
    Stack,
    List,
    ListItem,
    CircularProgress,
    Snackbar,
    Alert,
    Chip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
    markAsRead,
    acceptHireRequest,
    rejectHireRequest,
} from "../services/notificationService";

export default function NotificationBellDropdown({
    role,
    notifications = [],
    unreadCount = 0,
    onNotificationUpdate,
    onViewAll,
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Toast state
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastSeverity, setToastSeverity] = useState("success");

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const showToast = (message, severity = "success") => {
        setToastMsg(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };

    const handleMarkRead = async (e, id) => {
        e.stopPropagation();
        try {
            await markAsRead(id);
            if (onNotificationUpdate) onNotificationUpdate();
        } catch (err) {
            console.error("Failed to mark read", err);
        }
    };

    const handleAccept = async (e, notificationId, referenceId) => {
        e.stopPropagation();
        if (!referenceId) return;

        const confirmAction = window.confirm("Are you sure you want to accept this request?");
        if (!confirmAction) return;

        setActionLoadingId(notificationId);
        try {
            await acceptHireRequest(referenceId);
            await markAsRead(notificationId);
            showToast("Hire request accepted successfully!", "success");
            if (onNotificationUpdate) onNotificationUpdate();
        } catch (err) {
            console.error("Failed to accept", err);
            showToast(err?.response?.data?.error || "Failed to accept request.", "error");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReject = async (e, notificationId, referenceId) => {
        e.stopPropagation();
        if (!referenceId) return;

        const confirmAction = window.confirm("Are you sure you want to reject this request?");
        if (!confirmAction) return;

        setActionLoadingId(notificationId);
        try {
            await rejectHireRequest(referenceId);
            await markAsRead(notificationId);
            showToast("Hire request rejected successfully.", "info");
            if (onNotificationUpdate) onNotificationUpdate();
        } catch (err) {
            console.error("Failed to reject", err);
            showToast(err?.response?.data?.error || "Failed to reject request.", "error");
        } finally {
            setActionLoadingId(null);
        }
    };

    const formatDateTime = (dateValue) => {
        if (!dateValue) return "Just now";
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return "Just now";
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const open = Boolean(anchorEl);
    const id = open ? "notification-popover" : undefined;

    // Cap display to latest 10 notifications
    const latestNotifications = notifications.slice(0, 10);

    return (
        <>
            <IconButton
                aria-describedby={id}
                onClick={handleClick}
                sx={{
                    transition: "0.2s ease",
                    backgroundColor: unreadCount > 0 ? "#eff6ff" : "#f1f5f9",
                    border: unreadCount > 0 ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                    "&:hover": {
                        backgroundColor: unreadCount > 0 ? "#dbeafe" : "#e2e8f0",
                    },
                }}
            >
                <Badge badgeContent={unreadCount} color="error" overlap="circular">
                    <NotificationsIcon sx={{ color: unreadCount > 0 ? "#1976D2" : "#0f172a" }} />
                </Badge>
            </IconButton>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                PaperProps={{
                    sx: {
                        width: 360,
                        maxHeight: 500,
                        borderRadius: 3,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                        mt: 1,
                    },
                }}
            >
                <Box sx={{ p: 2, pb: 1.5, backgroundColor: "#ffffff" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight={800} fontSize={16}>
                            Notifications
                        </Typography>
                        {unreadCount > 0 && (
                            <Chip
                                label={`${unreadCount} New`}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 700, fontSize: 11 }}
                            />
                        )}
                    </Stack>
                </Box>
                <Divider />

                <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
                    {latestNotifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: "center" }}>
                            <Typography fontSize={13} color="text.secondary" fontWeight={600}>
                                No notifications yet
                            </Typography>
                        </Box>
                    ) : (
                        <List disablePadding>
                            {latestNotifications.map((notif, idx) => {
                                const isUnread = !notif.is_read;
                                const isHireRequest = notif.notification_type === "HIRE_REQUEST";
                                const requestStatus = String(notif.hire_request_status || "").toLowerCase();
                                const isPending = requestStatus === "pending";

                                return (
                                    <React.Fragment key={notif.id}>
                                        {idx > 0 && <Divider />}
                                        <ListItem
                                            sx={{
                                                px: 2,
                                                py: 1.5,
                                                alignItems: "flex-start",
                                                backgroundColor: isUnread ? "#f4f9ff" : "#ffffff",
                                                transition: "background-color 0.2s",
                                                "&:hover": {
                                                    backgroundColor: isUnread ? "#ebf4ff" : "#f8fafc",
                                                },
                                            }}
                                        >
                                            <Stack spacing={0.5} sx={{ width: "100%" }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Stack direction="row" alignItems="center" spacing={0.8}>
                                                        {isUnread && (
                                                            <CircleIcon sx={{ color: "#1976D2", fontSize: 8 }} />
                                                        )}
                                                        <Typography fontWeight={800} fontSize={13.5} color={isUnread ? "#1976D2" : "text.primary"}>
                                                            {notif.title}
                                                        </Typography>
                                                    </Stack>
                                                    {isUnread && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => handleMarkRead(e, notif.id)}
                                                            title="Mark as Read"
                                                            sx={{ p: 0, color: "#64748B", "&:hover": { color: "#1976D2" } }}
                                                        >
                                                            <MarkEmailReadIcon sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    )}
                                                </Stack>
                                                <Typography fontSize={12.5} color="text.secondary" sx={{ pr: 1 }}>
                                                    {notif.message}
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 12, color: "#94a3b8" }} />
                                                    <Typography fontSize={11} color="text.secondary">
                                                        {formatDateTime(notif.created_at)}
                                                    </Typography>
                                                </Stack>

                                                {role === "employer" && isHireRequest && (
                                                    <Box sx={{ mt: 1.5, pt: 1, borderTop: "1px dashed #e2e8f0" }}>
                                                        {isPending ? (
                                                            <Stack direction="row" spacing={1}>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="success"
                                                                    disabled={actionLoadingId !== null}
                                                                    startIcon={actionLoadingId === notif.id ? <CircularProgress size={10} color="inherit" /> : <CheckCircleIcon sx={{ fontSize: 13 }} />}
                                                                    onClick={(e) => handleAccept(e, notif.id, notif.reference_id)}
                                                                    sx={{ textTransform: "none", fontSize: 11, fontWeight: 700, py: 0.4 }}
                                                                >
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="error"
                                                                    disabled={actionLoadingId !== null}
                                                                    startIcon={actionLoadingId === notif.id ? <CircularProgress size={10} color="inherit" /> : <CancelIcon sx={{ fontSize: 13 }} />}
                                                                    onClick={(e) => handleReject(e, notif.id, notif.reference_id)}
                                                                    sx={{ textTransform: "none", fontSize: 11, fontWeight: 700, py: 0.4 }}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </Stack>
                                                        ) : (
                                                            <Chip
                                                                label={requestStatus}
                                                                color={requestStatus === "accepted" ? "success" : "error"}
                                                                size="small"
                                                                sx={{ fontWeight: 700, textTransform: "capitalize", height: 20, fontSize: 10 }}
                                                            />
                                                        )}
                                                    </Box>
                                                )}
                                            </Stack>
                                        </ListItem>
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    )}
                </Box>

                <Divider />
                <Box sx={{ p: 1, textAlign: "center", backgroundColor: "#f8fafc" }}>
                    <Button
                        size="small"
                        fullWidth
                        onClick={() => {
                            handleClose();
                            if (onViewAll) onViewAll();
                        }}
                        sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: 12.5,
                            color: "#1976D2",
                        }}
                    >
                        View All Notifications
                    </Button>
                </Box>
            </Popover>

            <Snackbar
                open={toastOpen}
                autoHideDuration={4000}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setToastOpen(false)}
                    severity={toastSeverity}
                    sx={{ width: "100%", borderRadius: 2, fontSize: 12.5 }}
                >
                    {toastMsg}
                </Alert>
            </Snackbar>
        </>
    );
}
