import React, { useMemo } from "react";
import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    Stack,
    Divider,
    LinearProgress,
    IconButton,
    Tooltip,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import ConstructionIcon from "@mui/icons-material/Construction";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// --- Color Palette ---
const COLORS = {
    primary: { main: "#1C6EA4", light: "#eff6ff", dark: "#155a87", text: "#1e3a8a" },
    success: { main: "#10b981", light: "#ecfdf5", dark: "#047857", text: "#065f46" },
    warning: { main: "#f97316", light: "#fff7ed", dark: "#c2410c", text: "#7c2d12" },
    purple: { main: "#8b5cf6", light: "#f5f3ff", dark: "#6d28d9", text: "#4c1d95" },
    neutral: { border: "#e2e8f0", background: "#f8fafc", textSecondary: "#64748b" },
};

// --- Custom Reusable Circular Progress (SVG) ---
function CircularProgressGauge({ value, size = 64, strokeWidth = 6, color = COLORS.primary.main }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

    return (
        <Box sx={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth={strokeWidth}
                />
                {/* Foreground circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                />
            </svg>
            <Box sx={{ position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="caption" fontWeight={700} fontSize={12} color="text.primary">
                    {Math.round(value)}%
                </Typography>
            </Box>
        </Box>
    );
}

// --- Skeleton Card Component ---
function SkeletonCard() {
    return (
        <Card sx={{ borderRadius: 4, border: `1px solid ${COLORS.neutral.border}`, boxShadow: "none", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ height: 16, width: 80, bgcolor: "#e2e8f0", borderRadius: 1, animation: "pulse 1.5s infinite" }} />
                    <Box sx={{ height: 40, width: 40, borderRadius: "50%", bgcolor: "#e2e8f0", animation: "pulse 1.5s infinite" }} />
                </Box>
                <Box sx={{ height: 28, width: 50, bgcolor: "#e2e8f0", borderRadius: 1, animation: "pulse 1.5s infinite", mb: 1 }} />
                <Box sx={{ height: 12, width: 110, bgcolor: "#e2e8f0", borderRadius: 0.5, animation: "pulse 1.5s infinite" }} />
            </CardContent>
        </Card>
    );
}

export default function EmployerStatsCards({
    totalJobs = 0,
    completedJobs = 0,
    pendingRequests = 0,
    acceptedRequests = 0,
    recentRequests = [],
    isLoading = false,
}) {
    const stats = [
        {
            title: "Total Jobs",
            value: totalJobs,
            icon: <WorkIcon sx={{ fontSize: 24 }} />,
            bg: COLORS.primary.light,
            color: COLORS.primary.main,
            trend: "+8% vs last month",
            trendType: "up",
        },
        {
            title: "Completed Jobs",
            value: completedJobs,
            icon: <AssignmentTurnedInIcon sx={{ fontSize: 24 }} />,
            bg: COLORS.success.light,
            color: COLORS.success.main,
            trend: "+12% this week",
            trendType: "up",
        },
        {
            title: "Pending Requests",
            value: pendingRequests,
            icon: <NotificationsActiveIcon sx={{ fontSize: 24 }} />,
            bg: COLORS.warning.light,
            color: COLORS.warning.main,
            trend: "Awaiting approval",
            trendType: "neutral",
        },
        {
            title: "Accepted Requests",
            value: acceptedRequests,
            icon: <DoneAllIcon sx={{ fontSize: 24 }} />,
            bg: COLORS.purple.light,
            color: COLORS.purple.main,
            trend: "+4% vs last week",
            trendType: "up",
        },
    ];

    const latestRequest = recentRequests?.length > 0 ? recentRequests[0] : null;

    const report = useMemo(() => {
        const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
        const acceptanceRate = totalJobs > 0 ? Math.round((acceptedRequests / totalJobs) * 100) : 0;
        const pendingRate = totalJobs > 0 ? Math.round((pendingRequests / totalJobs) * 100) : 0;

        return {
            completionRate,
            acceptanceRate,
            pendingRate,
        };
    }, [totalJobs, completedJobs, acceptedRequests, pendingRequests]);

    const chartBars = [
        { label: "Completed", value: completedJobs, color: COLORS.success.main, bg: COLORS.success.light },
        { label: "Pending", value: pendingRequests, color: COLORS.warning.main, bg: COLORS.warning.light },
        { label: "Accepted", value: acceptedRequests, color: COLORS.purple.main, bg: COLORS.purple.light },
    ];

    const getRequestName = (req) =>
        req?.customer_name ||
        req?.customerName ||
        req?.customer_email ||
        req?.customerEmail ||
        "Customer";

    const getRequestRole = (req) =>
        req?.job_role || req?.jobRole || req?.role || "Worker Request";

    const getRequestMessage = (req) =>
        req?.message || "A new request has been received.";

    const getRequestTime = (req) => {
        if (!req?.created_at && !req?.createdAt) return "Just now";
        const date = new Date(req.created_at || req.createdAt);
        return isNaN(date.getTime()) ? "Just now" : date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // --- Loading State Render ---
    if (isLoading) {
        return (
            <Box sx={{ width: "100%" }}>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4].map((i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <SkeletonCard />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    // --- Empty State Render ---
    if (totalJobs === 0 && recentRequests.length === 0) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    py: 8,
                    px: 3,
                    borderRadius: 4,
                    border: `1px dashed ${COLORS.neutral.border}`,
                    bgcolor: COLORS.neutral.background,
                    mt: 2
                }}
            >
                <WorkIcon sx={{ fontSize: 64, color: COLORS.neutral.textSecondary, mb: 2, opacity: 0.5 }} />
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    No Activity Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", mb: 3 }}>
                    Your employer account is active. When customers send you hire requests, your performance statistics, charts, and activity will appear here.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", animation: "fadeIn 0.4s ease-in-out" }}>
            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
                `}
            </style>

            {/* STATISTICS SECTION */}
            <Grid container spacing={3}>
                {stats.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.title}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                border: "1px solid",
                                borderColor: "rgba(0,0,0,0.04)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                height: "100%",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                                    borderColor: item.color,
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                                    <Typography variant="body2" fontWeight={600} color="text.secondary">
                                        {item.title}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 3,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: item.bg,
                                            color: item.color,
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                </Stack>

                                <Typography variant="h4" fontWeight={800} color="text.primary" sx={{ mb: 1, letterSpacing: "-0.5px" }}>
                                    {item.value}
                                </Typography>

                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    {item.trendType === "up" && (
                                        <Typography variant="caption" fontWeight={700} sx={{ color: COLORS.success.main, display: "flex", alignItems: "center" }}>
                                            ▲
                                        </Typography>
                                    )}
                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                        {item.trend}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* PERFORMANCE & ANALYTICS ROW */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
                {/* Performance Section */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            border: `1px solid ${COLORS.neutral.border}`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                                <Box>
                                    <Typography variant="h6" fontWeight={800}>
                                        Performance Overview
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Technical activity evaluation
                                    </Typography>
                                </Box>
                                <IconButton size="small">
                                    <InfoOutlinedIcon sx={{ fontSize: 20, color: COLORS.neutral.textSecondary }} />
                                </IconButton>
                            </Stack>

                            <Stack spacing={3}>
                                {/* Completion Rate Circle */}
                                <Stack direction="row" alignItems="center" spacing={2.5}>
                                    <CircularProgressGauge value={report.completionRate} color={COLORS.success.main} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" fontWeight={700}>
                                            Completion Rate
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Ratio of successfully completed jobs
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={report.completionRate}
                                            sx={{
                                                mt: 1,
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: "#f1f5f9",
                                                "& .MuiLinearProgress-bar": { backgroundColor: COLORS.success.main }
                                            }}
                                        />
                                    </Box>
                                </Stack>

                                {/* Acceptance Rate Circle */}
                                <Stack direction="row" alignItems="center" spacing={2.5}>
                                    <CircularProgressGauge value={report.acceptanceRate} color={COLORS.purple.main} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" fontWeight={700}>
                                            Acceptance Rate
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Ratio of accepted hire requests
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={report.acceptanceRate}
                                            sx={{
                                                mt: 1,
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: "#f1f5f9",
                                                "& .MuiLinearProgress-bar": { backgroundColor: COLORS.purple.main }
                                            }}
                                        />
                                    </Box>
                                </Stack>

                                {/* Pending Load Circle */}
                                <Stack direction="row" alignItems="center" spacing={2.5}>
                                    <CircularProgressGauge value={report.pendingRate} color={COLORS.warning.main} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="body2" fontWeight={700}>
                                            Pending Load
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Proportion of requests waiting
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={report.pendingRate}
                                            sx={{
                                                mt: 1,
                                                height: 6,
                                                borderRadius: 3,
                                                backgroundColor: "#f1f5f9",
                                                "& .MuiLinearProgress-bar": { backgroundColor: COLORS.warning.main }
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Analytics Section */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            border: `1px solid ${COLORS.neutral.border}`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={800}>
                                Request Analytics
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Visual comparison of request states
                            </Typography>

                            <Box
                                sx={{
                                    height: 250,
                                    display: "flex",
                                    alignItems: "end",
                                    justifyContent: "space-around",
                                    gap: 3,
                                    pt: 4,
                                }}
                            >
                                {chartBars.map((bar) => {
                                    const maxValue = Math.max(completedJobs, pendingRequests, acceptedRequests, 1);
                                    const heightPercentage = (bar.value / maxValue) * 100;
                                    const displayHeight = `${Math.max(heightPercentage, 8)}%`;

                                    return (
                                        <Box
                                            key={bar.label}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                flex: 1,
                                                height: "100%",
                                                justifyContent: "flex-end"
                                            }}
                                        >
                                            <Tooltip title={`${bar.label}: ${bar.value}`} arrow placement="top">
                                                <Box
                                                    sx={{
                                                        width: "100%",
                                                        maxWidth: 44,
                                                        height: displayHeight,
                                                        borderRadius: "10px 10px 4px 4px",
                                                        background: `linear-gradient(180deg, ${bar.color} 0%, ${bar.color}90 100%)`,
                                                        transition: "height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                                                        cursor: "pointer",
                                                        position: "relative",
                                                        "&:hover": {
                                                            filter: "brightness(1.1)",
                                                            transform: "scaleY(1.03)",
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: -24,
                                                            left: 0,
                                                            right: 0,
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        <Typography variant="caption" fontWeight={800} color="text.primary">
                                                            {bar.value}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Tooltip>

                                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mt: 1.5 }}>
                                                {bar.label}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Latest Request Card */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            border: `1px solid ${COLORS.neutral.border}`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                            height: "100%",
                            background: "linear-gradient(180deg, #ffffff 0%, #fcfdfe 100%)"
                        }}
                    >
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
                                Latest Request
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 2.5, display: "block" }}>
                                Most recent customer notification
                            </Typography>

                            {latestRequest ? (
                                <Box
                                    sx={{
                                        p: 2.5,
                                        borderRadius: 3.5,
                                        border: `1px solid ${COLORS.primary.light}`,
                                        backgroundColor: COLORS.primary.light,
                                        display: "flex",
                                        flexDirection: "column",
                                        flexGrow: 1,
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                                        <PersonIcon sx={{ color: COLORS.primary.main, fontSize: 22 }} />
                                        <Typography variant="body2" fontWeight={800} color={COLORS.primary.text}>
                                            {getRequestName(latestRequest)}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                                        <ConstructionIcon sx={{ color: COLORS.purple.main, fontSize: 20 }} />
                                        <Chip
                                            label={getRequestRole(latestRequest)}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                fontSize: 11,
                                                backgroundColor: "#ffffff",
                                                color: COLORS.purple.main,
                                                border: `1px solid ${COLORS.neutral.border}`
                                            }}
                                        />
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2.5,
                                            backgroundColor: "#ffffff",
                                            border: `1px solid ${COLORS.neutral.border}`,
                                            mb: 2.5,
                                            flexGrow: 1,
                                            minHeight: 60,
                                            color: "text.primary",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {getRequestMessage(latestRequest)}
                                    </Typography>

                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Chip
                                            label={latestRequest?.status || "Pending"}
                                            size="small"
                                            color={
                                                String(latestRequest?.status).toLowerCase() === "accepted"
                                                    ? "primary"
                                                    : String(latestRequest?.status).toLowerCase() === "completed"
                                                        ? "success"
                                                        : String(latestRequest?.status).toLowerCase() === "rejected"
                                                            ? "error"
                                                            : "warning"
                                            }
                                            sx={{ fontWeight: 800, fontSize: 11 }}
                                        />
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <AccessTimeIcon sx={{ fontSize: 15, color: COLORS.neutral.textSecondary }} />
                                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                {getRequestTime(latestRequest)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexGrow: 1,
                                        borderRadius: 3.5,
                                        border: `1px dashed ${COLORS.neutral.border}`,
                                        bgcolor: COLORS.neutral.background,
                                        p: 3,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No recent requests received.
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* RECENT ACTIVITY TIMELINE */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            border: `1px solid ${COLORS.neutral.border}`,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={800}>
                                Recent Activity Timeline
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 3 }}>
                                Log of latest request transactions and status updates
                            </Typography>

                            {recentRequests?.length > 0 ? (
                                <Box sx={{ position: "relative", pl: { xs: 2, sm: 4 } }}>
                                    {/* Timeline line */}
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            left: { xs: 15, sm: 31 },
                                            top: 8,
                                            bottom: 8,
                                            width: 2,
                                            bgcolor: COLORS.neutral.border,
                                            zIndex: 0
                                        }}
                                    />

                                    <Stack spacing={3.5}>
                                        {recentRequests.slice(0, 5).map((req, index) => {
                                            const name = getRequestName(req);
                                            const role = getRequestRole(req);
                                            const msg = getRequestMessage(req);
                                            const status = String(req?.status || "Pending").toLowerCase();

                                            // Determine colors and icon types based on status
                                            let iconBg = COLORS.warning.light;
                                            let dotColor = COLORS.warning.main;
                                            let actionText = "Customer sent request";

                                            if (status === "accepted") {
                                                iconBg = COLORS.primary.light;
                                                dotColor = COLORS.primary.main;
                                                actionText = "Request accepted by you";
                                            } else if (status === "completed") {
                                                iconBg = COLORS.success.light;
                                                dotColor = COLORS.success.main;
                                                actionText = "Request marked completed";
                                            } else if (status === "rejected") {
                                                iconBg = "#ffebee";
                                                dotColor = "#ef5350";
                                                actionText = "Request rejected";
                                            }

                                            return (
                                                <Box key={req?.id || index} sx={{ position: "relative", display: "flex", zIndex: 1 }}>
                                                    {/* Timeline node */}
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            left: { xs: -12, sm: -28 },
                                                            top: 4,
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: "50%",
                                                            bgcolor: "#ffffff",
                                                            border: `4px solid ${dotColor}`,
                                                            boxShadow: "0 0 0 4px #ffffff",
                                                        }}
                                                    />

                                                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12} sm={8}>
                                                                <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                                                                    <Typography variant="body2" fontWeight={800} color="text.primary">
                                                                        {name}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ color: dotColor, fontWeight: 700, px: 1, py: 0.3, borderRadius: 1, bgcolor: iconBg }}>
                                                                        {actionText}
                                                                    </Typography>
                                                                </Stack>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                    Role: <strong>{role}</strong> &mdash; "{msg}"
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={4} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                                                                <Stack direction="row" spacing={0.5} alignItems="center" justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                                                                    <AccessTimeIcon sx={{ fontSize: 14, color: COLORS.neutral.textSecondary }} />
                                                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                                        {getRequestTime(req)}
                                                                    </Typography>
                                                                </Stack>
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </Box>
                                            );
                                        })}
                                    </Stack>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        p: 4,
                                        textAlign: "center",
                                        borderRadius: 3.5,
                                        backgroundColor: COLORS.neutral.background,
                                        border: `1px dashed ${COLORS.neutral.border}`,
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No recent activity history.
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}