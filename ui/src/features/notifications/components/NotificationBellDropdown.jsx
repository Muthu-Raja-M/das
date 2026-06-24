import React, { useState, useEffect } from "react";
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
    Drawer,
    Tooltip,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";
import CircleIcon from "@mui/icons-material/Circle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import WorkIcon from "@mui/icons-material/Work";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";

import {
    markAsRead,
    acceptHireRequest,
    rejectHireRequest,
    markAllAsRead,
} from "../services/notificationService";
import { fetchEmployerAlerts } from "../../../shared/services/alertService";

export default function NotificationBellDropdown({
    role,
    notifications = [],
    unreadCount = 0,
    onNotificationUpdate,
    onViewAll,
}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [anchorEl, setAnchorEl] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Micro-interactions state
    const [isRinging, setIsRinging] = useState(false);
    const [badgeAnimated, setBadgeAnimated] = useState(false);

    // Employer Verification Alert State
    const [verifAlert, setVerifAlert] = useState(null);

    // Toast state
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastSeverity, setToastSeverity] = useState("success");

    const email = localStorage.getItem("email");
    const readKey = `employer_alert_read_${email}`;
    const removeKey = `employer_alert_removed_${email}`;

    // Fetch verification alert (employer only)
    const loadVerifAlert = async () => {
        if (role !== "employer" || !email) return;
        try {
            const res = await fetchEmployerAlerts(email);
            const data = res?.data || res;
            const status = String(data?.status || "").toLowerCase();
            const removedStatus = localStorage.getItem(removeKey);

            const hasAlert = (status === "approved" || status === "rejected") && removedStatus !== status;
            if (hasAlert) {
                const isRead = localStorage.getItem(readKey) === status;
                setVerifAlert({
                    id: "verification_alert",
                    notification_type: "VERIFICATION_ALERT",
                    title: status === "approved" ? "Verification Approved" : "Verification Rejected",
                    message: data?.message || (status === "approved" ? "Your account has been verified by Admin." : "Your verification was rejected by Admin."),
                    status: status,
                    employer_id: data?.employer_id || null,
                    created_at: data?.created_at || data?.submitted_at || data?.approved_at || new Date().toISOString(),
                    is_read: isRead
                });
            } else {
                setVerifAlert(null);
            }
        } catch (err) {
            console.error("Failed to load verification alert", err);
        }
    };

    useEffect(() => {
        loadVerifAlert();
    }, [role, email]);

    // Animate badge count on changes
    useEffect(() => {
        if (unreadCount > 0) {
            setBadgeAnimated(true);
            const timer = setTimeout(() => setBadgeAnimated(false), 300);
            return () => clearTimeout(timer);
        }
    }, [unreadCount]);

    const handleClick = (event) => {
        setIsRinging(true);
        setTimeout(() => setIsRinging(false), 600);
        setAnchorEl(event.currentTarget);

        // Mark verification alert as read if opened
        if (verifAlert && !verifAlert.is_read) {
            localStorage.setItem(readKey, verifAlert.status);
            setVerifAlert(prev => prev ? { ...prev, is_read: true } : null);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const showToast = (message, severity = "success") => {
        setToastMsg(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            if (onNotificationUpdate) {
                await onNotificationUpdate();
            }
            await loadVerifAlert();
            showToast("Notifications refreshed", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to refresh notifications", "error");
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleMarkRead = async (e, id) => {
        e.stopPropagation();
        try {
            await markAsRead(id);
            if (onNotificationUpdate) onNotificationUpdate();
        } catch (err) {
            console.error("Failed to mark read", err);
            showToast("Failed to mark notification as read", "error");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
            if (onNotificationUpdate) onNotificationUpdate();
            showToast("All notifications marked as read", "success");
        } catch (err) {
            console.error("Failed to mark all read", err);
            showToast("Failed to mark all notifications as read", "error");
        }
    };

    const handleRemoveVerifAlert = (e) => {
        e.stopPropagation();
        if (verifAlert) {
            localStorage.setItem(removeKey, verifAlert.status);
            setVerifAlert(null);
            showToast("Verification alert removed", "info");
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

    const getRelativeTime = (dateValue) => {
        if (!dateValue) return "Just now";
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return "Just now";

        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHr / 24);

        if (diffSec < 10) return "Just now";
        if (diffSec < 60) return `${diffSec}s ago`;
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        if (diffDays === 1) return "Yesterday";
        return `${diffDays} days ago`;
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? "notification-popover" : undefined;

    // Merge database notifications and verification alerts
    const mergedNotifications = [];
    if (verifAlert) {
        mergedNotifications.push(verifAlert);
    }
    notifications.forEach((notif) => {
        mergedNotifications.push(notif);
    });

    // Chronological sort and slice to latest 10
    const sortedNotifications = [...mergedNotifications].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    const latestNotifications = sortedNotifications.slice(0, 10);

    const totalUnreadCount = unreadCount + (verifAlert && !verifAlert.is_read ? 1 : 0);

    const renderNotificationContent = () => (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%", maxHeight: isMobile ? "80vh" : 520, overflow: "hidden", backgroundColor: "#ffffff" }}>
            {/* Header Section */}
            <Box sx={{ p: 2.2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography fontWeight={900} fontSize={17} sx={{ color: "#0F172A" }}>
                        Notifications
                    </Typography>
                    {totalUnreadCount > 0 && (
                        <Chip
                            label={`${totalUnreadCount} New`}
                            size="small"
                            sx={{
                                fontWeight: 800,
                                fontSize: 11,
                                backgroundColor: "#e0f2fe",
                                color: "#0369a1",
                            }}
                        />
                    )}
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    {totalUnreadCount > 0 && (
                        <Button
                            size="small"
                            variant="text"
                            onClick={handleMarkAllRead}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: 12,
                                color: "#1C6EA4",
                                px: 1,
                                py: 0.5,
                                "&:hover": { backgroundColor: "#f0f7ff" }
                            }}
                        >
                            Mark All Read
                        </Button>
                    )}
                    <Tooltip title="Refresh">
                        <IconButton
                            size="small"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            sx={{ color: "#64748B" }}
                        >
                            {isRefreshing ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon sx={{ fontSize: 18 }} />}
                        </IconButton>
                    </Tooltip>
                    {isMobile && (
                        <IconButton size="small" onClick={handleClose} sx={{ color: "#64748B", ml: 0.5 }}>
                            <CloseIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    )}
                </Stack>
            </Box>

            {/* Notification Cards */}
            <Box sx={{ overflowY: "auto", flexGrow: 1, backgroundColor: "#f8fafc" }}>
                {latestNotifications.length === 0 ? (
                    <Box sx={{ py: 8, px: 4, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <NotificationsOffIcon sx={{ fontSize: 44, color: "#94a3b8", mb: 1.5 }} />
                        <Typography fontWeight={700} fontSize={14.5} color="text.primary">
                            No notifications available
                        </Typography>
                        <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5 }}>
                            You are all caught up for now.
                        </Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {latestNotifications.map((notif, idx) => {
                            const isUnread = !notif.is_read;
                            const isVerification = notif.notification_type === "VERIFICATION_ALERT";
                            const isHireRequest = notif.notification_type === "HIRE_REQUEST";
                            const isAccepted = notif.notification_type === "HIRE_ACCEPTED";
                            const isRejected = notif.notification_type === "HIRE_REJECTED";
                            const requestStatus = String(notif.hire_request_status || "").toLowerCase();
                            const isPending = requestStatus === "pending";

                            return (
                                <React.Fragment key={notif.id}>
                                    {idx > 0 && <Divider sx={{ borderColor: "#f1f5f9" }} />}
                                    <ListItem
                                        sx={{
                                            px: 2.5,
                                            py: 2,
                                            alignItems: "flex-start",
                                            backgroundColor: isUnread ? "#f4f9ff" : "#ffffff",
                                            borderLeft: isUnread ? "4px solid #1C6EA4" : "4px solid transparent",
                                            transition: "all 0.2s ease",
                                            "&:hover": {
                                                backgroundColor: isUnread ? "#ebf4ff" : "#f8fafc",
                                                transform: "translateY(-1px)",
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                                            },
                                        }}
                                    >
                                        <Stack direction="row" spacing={2} sx={{ width: "100%" }} alignItems="flex-start">
                                            {/* Icon Column */}
                                            <Box sx={{ mt: 0.5, flexShrink: 0 }}>
                                                {isVerification ? (
                                                    notif.status === "approved" ? (
                                                        <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 24 }} />
                                                    ) : (
                                                        <CancelIcon sx={{ color: "#ef4444", fontSize: 24 }} />
                                                    )
                                                ) : isHireRequest ? (
                                                    <WorkIcon sx={{ color: "#1C6EA4", fontSize: 24 }} />
                                                ) : isAccepted ? (
                                                    <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 24 }} />
                                                ) : isRejected ? (
                                                    <CancelIcon sx={{ color: "#ef4444", fontSize: 24 }} />
                                                ) : (
                                                    <NotificationsIcon sx={{ color: "#64748B", fontSize: 24 }} />
                                                )}
                                            </Box>

                                            {/* Details Column */}
                                            <Stack spacing={0.6} sx={{ width: "100%", minWidth: 0 }}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                                    <Typography
                                                        fontWeight={isUnread ? 800 : 700}
                                                        fontSize={13.5}
                                                        color="text.primary"
                                                        sx={{ pr: 2, wordBreak: "break-word", lineHeight: 1.3 }}
                                                    >
                                                        {isVerification ? (
                                                            notif.status === "approved" ? "✓ Verification Approved" : "✕ Verification Rejected"
                                                        ) : (
                                                            notif.title
                                                        )}
                                                    </Typography>
                                                    {isUnread && !isVerification && (
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => handleMarkRead(e, notif.id)}
                                                            title="Mark as Read"
                                                            sx={{
                                                                p: 0,
                                                                color: "#94a3b8",
                                                                "&:hover": { color: "#1C6EA4" }
                                                            }}
                                                        >
                                                            <CheckIcon sx={{ fontSize: 15 }} />
                                                        </IconButton>
                                                    )}
                                                </Stack>

                                                {/* Core message/body */}
                                                {isHireRequest ? (
                                                    <Stack spacing={0.5} sx={{ mt: 0.2 }}>
                                                        <Typography fontSize={13} color="text.primary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                            <PersonIcon sx={{ fontSize: 14, color: "#64748B" }} />
                                                            {notif.sender_name || "Client"}
                                                        </Typography>
                                                        <Typography fontSize={12} color="text.secondary">
                                                            Service: <strong>{notif.service_type || "Request"}</strong>
                                                        </Typography>
                                                        {notif.sender_location ? (
                                                            <Typography fontSize={12} color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                                                                <LocationOnIcon sx={{ fontSize: 13, color: "#64748B" }} />
                                                                {notif.sender_location}
                                                            </Typography>
                                                        ) : (
                                                            <Typography fontSize={12} color="text.secondary">
                                                                Location: <em>Not Specified</em>
                                                            </Typography>
                                                        )}
                                                        {notif.message && (
                                                            <Typography fontSize={12} color="text.secondary" sx={{ mt: 0.5, fontStyle: "italic", p: 1, backgroundColor: "#f1f5f9", borderRadius: 1.5 }}>
                                                                "{notif.message}"
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                ) : (
                                                    <Typography fontSize={12.5} color="text.secondary" sx={{ wordBreak: "break-word", lineHeight: 1.4 }}>
                                                        {notif.message}
                                                    </Typography>
                                                )}

                                                {/* Verification ID card */}
                                                {isVerification && notif.status === "approved" && notif.employer_id && (
                                                    <Box
                                                        sx={{
                                                            mt: 1,
                                                            p: 1.2,
                                                            borderRadius: 2,
                                                            backgroundColor: "#ffffff",
                                                            border: "1px dashed #22c55e",
                                                            display: "inline-block"
                                                        }}
                                                    >
                                                        <Typography fontSize={11} color="text.secondary">
                                                            Your Employer ID
                                                        </Typography>
                                                        <Typography fontSize={14} fontWeight={900} color="#15803d">
                                                            {notif.employer_id}
                                                        </Typography>
                                                    </Box>
                                                )}

                                                {/* Relative Time and Action Row */}
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
                                                    <Typography fontSize={11} color="text.secondary">
                                                        {getRelativeTime(notif.created_at)}
                                                    </Typography>
                                                    {isVerification && (
                                                        <Button
                                                            size="small"
                                                            color="error"
                                                            onClick={handleRemoveVerifAlert}
                                                            sx={{ textTransform: "none", fontSize: 11, fontWeight: 700, p: 0 }}
                                                        >
                                                            Remove Alert
                                                        </Button>
                                                    )}
                                                </Stack>

                                                {/* Accept/Reject buttons for Hire requests */}
                                                {role === "employer" && isHireRequest && (
                                                    <Box sx={{ mt: 1.5 }}>
                                                        {isPending ? (
                                                            <Stack direction="row" spacing={1}>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="success"
                                                                    disabled={actionLoadingId !== null}
                                                                    onClick={(e) => handleAccept(e, notif.id, notif.reference_id)}
                                                                    sx={{
                                                                        textTransform: "none",
                                                                        fontSize: 11,
                                                                        fontWeight: 700,
                                                                        borderRadius: 2,
                                                                        py: 0.5,
                                                                        px: 2,
                                                                        backgroundColor: "#22c55e",
                                                                        "&:hover": { backgroundColor: "#16a34a" }
                                                                    }}
                                                                >
                                                                    {actionLoadingId === notif.id ? <CircularProgress size={14} color="inherit" /> : "Accept"}
                                                                </Button>
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="error"
                                                                    disabled={actionLoadingId !== null}
                                                                    onClick={(e) => handleReject(e, notif.id, notif.reference_id)}
                                                                    sx={{
                                                                        textTransform: "none",
                                                                        fontSize: 11,
                                                                        fontWeight: 700,
                                                                        borderRadius: 2,
                                                                        py: 0.5,
                                                                        px: 2,
                                                                        backgroundColor: "#ef4444",
                                                                        "&:hover": { backgroundColor: "#dc2626" }
                                                                    }}
                                                                >
                                                                    {actionLoadingId === notif.id ? <CircularProgress size={14} color="inherit" /> : "Reject"}
                                                                </Button>
                                                            </Stack>
                                                        ) : (
                                                            <Chip
                                                                label={requestStatus}
                                                                color={requestStatus === "accepted" ? "success" : "error"}
                                                                size="small"
                                                                sx={{ fontWeight: 800, textTransform: "capitalize", height: 22, fontSize: 10.5 }}
                                                            />
                                                        )}
                                                    </Box>
                                                )}
                                            </Stack>
                                        </Stack>
                                    </ListItem>
                                </React.Fragment>
                            );
                        })}
                    </List>
                )}
            </Box>

            {/* View All Footer */}
            <Box sx={{ p: 1.5, borderTop: "1px solid #f1f5f9", textAlign: "center", backgroundColor: "#ffffff" }}>
                <Button
                    size="small"
                    fullWidth
                    onClick={() => {
                        handleClose();
                        if (onViewAll) onViewAll();
                    }}
                    sx={{
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: 13,
                        color: "#1C6EA4",
                        "&:hover": { backgroundColor: "#f0f7ff" }
                    }}
                >
                    View All Notifications &rarr;
                </Button>
            </Box>
        </Box>
    );

    return (
        <>
            <style>
                {`
                @keyframes bellRing {
                    0% { transform: rotate(0); }
                    15% { transform: rotate(12deg); }
                    30% { transform: rotate(-12deg); }
                    45% { transform: rotate(8deg); }
                    60% { transform: rotate(-8deg); }
                    75% { transform: rotate(4deg); }
                    85% { transform: rotate(-4deg); }
                    100% { transform: rotate(0); }
                }
                @keyframes badgeScale {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
                .bell-pulse-ring {
                    animation: bellRing 0.6s ease;
                }
                .badge-pulse {
                    animation: badgeScale 0.3s ease-in-out;
                }
                `}
            </style>

            <Tooltip title="Notifications">
                <IconButton
                    aria-describedby={popoverId}
                    onClick={handleClick}
                    className={isRinging ? "bell-pulse-ring" : ""}
                    sx={{
                        transition: "all 0.2s ease-in-out",
                        backgroundColor: totalUnreadCount > 0 ? "#eff6ff" : "#f1f5f9",
                        border: totalUnreadCount > 0 ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                        padding: "10px",
                        mr: 1, // spacing from profile avatar
                        "&:hover": {
                            backgroundColor: totalUnreadCount > 0 ? "#dbeafe" : "#e2e8f0",
                            transform: "scale(1.05)",
                        },
                    }}
                >
                    <Badge
                        badgeContent={totalUnreadCount}
                        color="error"
                        overlap="circular"
                        className={badgeAnimated ? "badge-pulse" : ""}
                        sx={{
                            "& .MuiBadge-badge": {
                                fontSize: 10,
                                height: 18,
                                minWidth: 18,
                                fontWeight: 800,
                                backgroundColor: "#ef4444"
                            }
                        }}
                    >
                        <NotificationsIcon sx={{ color: totalUnreadCount > 0 ? "#1C6EA4" : "#475569", fontSize: 20 }} />
                    </Badge>
                </IconButton>
            </Tooltip>

            {isMobile ? (
                <Drawer
                    anchor="bottom"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        sx: {
                            borderTopLeftRadius: 18,
                            borderTopRightRadius: 18,
                            overflow: "hidden",
                            maxHeight: "80vh"
                        }
                    }}
                >
                    {renderNotificationContent()}
                </Drawer>
            ) : (
                <Popover
                    id={popoverId}
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
                            width: 390,
                            maxHeight: 520,
                            borderRadius: 4,
                            boxShadow: "0 12px 36px rgba(15, 23, 42, 0.12)",
                            overflow: "hidden",
                            mt: 1.5,
                            border: "1px solid #e2e8f0"
                        },
                    }}
                >
                    {renderNotificationContent()}
                </Popover>
            )}

            <Snackbar
                open={toastOpen}
                autoHideDuration={4000}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setToastOpen(false)}
                    severity={toastSeverity}
                    sx={{ width: "100%", borderRadius: 3, fontSize: 12.5, fontWeight: 700 }}
                >
                    {toastMsg}
                </Alert>
            </Snackbar>
        </>
    );
}
