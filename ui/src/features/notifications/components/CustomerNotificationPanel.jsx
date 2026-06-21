import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    Stack,
    Chip,
    CircularProgress,
    IconButton,
    Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
    getCustomerNotifications,
    markAsRead,
} from "../services/notificationService";

export default function CustomerNotificationPanel({ onNotificationUpdate }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchNotifications = async (showLoader = true) => {
        if (showLoader) setLoading(true);
        try {
            const data = await getCustomerNotifications();
            setNotifications(Array.isArray(data) ? data : []);
            if (onNotificationUpdate) {
                onNotificationUpdate();
            }
        } catch (err) {
            console.error("Error fetching customer notifications:", err);
            setError("Failed to load notifications. Please try again.");
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Polling interval: 30 seconds
        const timer = setInterval(() => {
            fetchNotifications(false);
        }, 30000);
        return () => clearInterval(timer);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            fetchNotifications(false);
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
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
        <Box sx={{ maxWidth: 800, mx: "auto", py: 2 }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    mb: 3,
                    background: "#ffffff",
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <NotificationsIcon sx={{ color: "#1C6EA4", fontSize: 28 }} />
                        <Typography variant="h6" fontWeight={800}>
                            Notification Panel
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {notifications.filter((n) => !n.is_read).length} Unread
                    </Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {error && (
                    <Box sx={{ mb: 2 }}>
                        <Typography color="error" variant="body2" fontWeight={600}>
                            ⚠️ {error}
                        </Typography>
                    </Box>
                )}

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress size={40} sx={{ color: "#1C6EA4" }} />
                    </Box>
                ) : notifications.length === 0 ? (
                    <Box sx={{ py: 8, textAlign: "center", backgroundColor: "#f8fafc", borderRadius: 3 }}>
                        <Typography variant="body1" fontWeight={700} color="text.secondary">
                            No notifications yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            All updates regarding your hire requests will appear here.
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {notifications.map((notif) => {
                            const isUnread = !notif.is_read;

                            return (
                                <Card
                                    key={notif.id}
                                    elevation={0}
                                    sx={{
                                        border: isUnread ? "1px solid #BFDAF2" : "1px solid #E2E8F0",
                                        borderRadius: 3,
                                        backgroundColor: isUnread ? "#F8FBFF" : "#FFFFFF",
                                        position: "relative",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
                                            transform: "translateY(-1px)",
                                        },
                                    }}
                                >
                                    <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    {isUnread && (
                                                        <CircleIcon sx={{ color: "#1C6EA4", fontSize: 10 }} />
                                                    )}
                                                    <Typography variant="subtitle1" fontWeight={800} color={isUnread ? "#1C6EA4" : "text.primary"}>
                                                        {notif.title}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                                                    {notif.message}
                                                </Typography>
                                                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDateTime(notif.created_at)}
                                                    </Typography>
                                                </Stack>
                                            </Stack>

                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                {isUnread && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleMarkAsRead(notif.id)}
                                                        title="Mark as Read"
                                                        sx={{ color: "#64748B", "&:hover": { color: "#1C6EA4" } }}
                                                    >
                                                        <MarkEmailReadIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                )}
                                                {isUnread ? (
                                                    <Chip label="New" size="small" color="primary" sx={{ fontWeight: 700, fontSize: 10, height: 20 }} />
                                                ) : (
                                                    <Chip label="Read" size="small" variant="outlined" sx={{ fontWeight: 600, fontSize: 10, height: 20 }} />
                                                )}
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Stack>
                )}
            </Paper>
        </Box>
    );
}
