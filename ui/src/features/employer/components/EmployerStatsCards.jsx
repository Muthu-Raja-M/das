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
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import ConstructionIcon from "@mui/icons-material/Construction";

export default function EmployerStatsCards({
    totalJobs = 0,
    completedJobs = 0,
    pendingRequests = 0,
    acceptedRequests = 0,
    recentRequests = [],
}) {
    const stats = [
        {
            title: "Total Jobs",
            value: totalJobs,
            icon: <WorkIcon />,
            bg: "#eff6ff",
            color: "#0554A2",
        },
        {
            title: "Completed",
            value: completedJobs,
            icon: <AssignmentTurnedInIcon />,
            bg: "#ecfdf5",
            color: "#059669",
        },
        {
            title: "Pending Requests",
            value: pendingRequests,
            icon: <NotificationsActiveIcon />,
            bg: "#fff7ed",
            color: "#ea580c",
        },
        {
            title: "Accepted Requests",
            value: acceptedRequests,
            icon: <DoneAllIcon />,
            bg: "#f5f3ff",
            color: "#7c3aed",
        },
    ];

    const latestRequest = recentRequests?.length > 0 ? recentRequests[0] : null;

    const report = useMemo(() => {
        const completionRate =
            totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;

        const acceptanceRate =
            totalJobs > 0 ? Math.round((acceptedRequests / totalJobs) * 100) : 0;

        const pendingRate =
            totalJobs > 0 ? Math.round((pendingRequests / totalJobs) * 100) : 0;

        return {
            completionRate,
            acceptanceRate,
            pendingRate,
        };
    }, [totalJobs, completedJobs, acceptedRequests, pendingRequests]);

    const chartBars = [
        {
            label: "Completed",
            value: completedJobs,
            color: "#059669",
            bg: "#d1fae5",
        },
        {
            label: "Pending",
            value: pendingRequests,
            color: "#ea580c",
            bg: "#ffedd5",
        },
        {
            label: "Accepted",
            value: acceptedRequests,
            color: "#7c3aed",
            bg: "#ede9fe",
        },
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

    const getRequestTime = (req) =>
        req?.created_at || req?.createdAt || "Just now";

    return (
        <Box sx={{ width: "100%" }}>
            {/* TOP STATS */}
            <Grid container spacing={2.2}>
                {stats.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.title}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                                height: "100%",
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="h5" fontWeight={700} sx={{ mt: 0.8 }}>
                                        {item.value}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: item.bg,
                                        color: item.color,
                                    }}
                                >
                                    {item.icon}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* SECOND ROW */}
            <Grid container spacing={2.2} sx={{ mt: 0.5 }}>
                {/* TECHNICAL REPORT */}
                <Grid item xs={12} md={5}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                            height: "100%",
                        }}
                    >
                        <CardContent>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ mb: 2 }}
                            >
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>
                                        Performance Report
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Technical overview of current employer activity
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#eff6ff",
                                        color: "#0554A2",
                                    }}
                                >
                                    <TrendingUpIcon />
                                </Box>
                            </Stack>

                            <Box sx={{ mb: 2 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{ mb: 0.7 }}
                                >
                                    <Typography variant="body2">Completion Rate</Typography>
                                    <Typography variant="body2" fontWeight={700}>
                                        {report.completionRate}%
                                    </Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={report.completionRate}
                                    sx={{
                                        height: 8,
                                        borderRadius: 999,
                                        backgroundColor: "#e5e7eb",
                                    }}
                                />
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{ mb: 0.7 }}
                                >
                                    <Typography variant="body2">Acceptance Rate</Typography>
                                    <Typography variant="body2" fontWeight={700}>
                                        {report.acceptanceRate}%
                                    </Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={report.acceptanceRate}
                                    sx={{
                                        height: 8,
                                        borderRadius: 999,
                                        backgroundColor: "#e5e7eb",
                                    }}
                                />
                            </Box>

                            <Box>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    sx={{ mb: 0.7 }}
                                >
                                    <Typography variant="body2">Pending Load</Typography>
                                    <Typography variant="body2" fontWeight={700}>
                                        {report.pendingRate}%
                                    </Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={report.pendingRate}
                                    sx={{
                                        height: 8,
                                        borderRadius: 999,
                                        backgroundColor: "#e5e7eb",
                                    }}
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={1.5}>
                                <Grid item xs={4}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: "#f8fafc",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            Total
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            {totalJobs}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={4}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: "#f8fafc",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            Active
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            {pendingRequests + acceptedRequests}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={4}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: "#f8fafc",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            Closed
                                        </Typography>
                                        <Typography variant="h6" fontWeight={700}>
                                            {completedJobs}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* SIMPLE GRAPH */}
                <Grid item xs={12} md={3.5}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                            height: "100%",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" fontWeight={700}>
                                Request Analytics
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Visual comparison of request states
                            </Typography>

                            <Box
                                sx={{
                                    height: 210,
                                    display: "flex",
                                    alignItems: "end",
                                    justifyContent: "space-around",
                                    gap: 2,
                                    pt: 2,
                                }}
                            >
                                {chartBars.map((bar) => {
                                    const maxValue = Math.max(
                                        completedJobs,
                                        pendingRequests,
                                        acceptedRequests,
                                        1
                                    );
                                    const height = `${(bar.value / maxValue) * 140 + 35}px`;

                                    return (
                                        <Box
                                            key={bar.label}
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                flex: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                fontWeight={700}
                                                sx={{ mb: 1 }}
                                            >
                                                {bar.value}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    maxWidth: 56,
                                                    height,
                                                    borderRadius: "18px 18px 8px 8px",
                                                    background: `linear-gradient(180deg, ${bar.color} 0%, ${bar.bg} 100%)`,
                                                    transition: "0.3s",
                                                }}
                                            />

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ mt: 1 }}
                                            >
                                                {bar.label}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* LATEST REQUEST */}
                <Grid item xs={12} md={3.5}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                            height: "100%",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" fontWeight={700}>
                                Latest Request
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Most recent customer request received
                            </Typography>

                            {latestRequest ? (
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        background:
                                            "linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%)",
                                        border: "1px solid #dbeafe",
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                        <PersonIcon sx={{ color: "#0554A2" }} />
                                        <Typography fontWeight={700}>
                                            {getRequestName(latestRequest)}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                                        <ConstructionIcon sx={{ color: "#7c3aed", fontSize: 20 }} />
                                        <Typography variant="body2">
                                            {getRequestRole(latestRequest)}
                                        </Typography>
                                    </Stack>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            p: 1.2,
                                            borderRadius: 2,
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #e5e7eb",
                                            mb: 1.5,
                                            minHeight: 70,
                                        }}
                                    >
                                        {getRequestMessage(latestRequest)}
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Chip
                                            label={latestRequest?.status || "Pending"}
                                            size="small"
                                            sx={{
                                                fontWeight: 700,
                                                backgroundColor: "#fff7ed",
                                                color: "#ea580c",
                                            }}
                                        />
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <AccessTimeIcon sx={{ fontSize: 17, color: "#64748b" }} />
                                            <Typography variant="caption" color="text.secondary">
                                                {getRequestTime(latestRequest)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 3,
                                        textAlign: "center",
                                        backgroundColor: "#f8fafc",
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No latest request available
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* RECENT REQUEST LIST */}
            <Grid container spacing={2.2} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                                Recent Activity
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Latest customer requests and activity feed
                            </Typography>

                            {recentRequests?.length > 0 ? (
                                <Stack spacing={1.2}>
                                    {recentRequests.slice(0, 5).map((req, index) => (
                                        <Box
                                            key={req?.id || index}
                                            sx={{
                                                p: 1.5,
                                                border: "1px solid #e5e7eb",
                                                borderRadius: 2.5,
                                                display: "flex",
                                                flexDirection: { xs: "column", sm: "row" },
                                                justifyContent: "space-between",
                                                alignItems: { xs: "flex-start", sm: "center" },
                                                gap: 1,
                                            }}
                                        >
                                            <Box>
                                                <Typography fontWeight={700}>
                                                    {getRequestName(req)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {getRequestRole(req)}
                                                </Typography>
                                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                    {getRequestMessage(req)}
                                                </Typography>
                                            </Box>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center"
                                                sx={{ flexWrap: "wrap" }}
                                            >
                                                <Chip
                                                    label={req?.status || "Pending"}
                                                    size="small"
                                                    color={
                                                        String(req?.status).toLowerCase() === "accepted"
                                                            ? "primary"
                                                            : String(req?.status).toLowerCase() === "completed"
                                                                ? "success"
                                                                : String(req?.status).toLowerCase() === "rejected"
                                                                    ? "error"
                                                                    : "warning"
                                                    }
                                                />
                                                <Typography variant="caption" color="text.secondary">
                                                    {getRequestTime(req)}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Box
                                    sx={{
                                        p: 3,
                                        textAlign: "center",
                                        borderRadius: 2.5,
                                        backgroundColor: "#f8fafc",
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        No recent activity found
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