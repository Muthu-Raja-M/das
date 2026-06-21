import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    Grid,
    CircularProgress,
    Chip,
    Button,
} from "@mui/material";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";

const getStatusColor = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "accepted") return "success";
    if (s === "pending") return "warning";
    if (s === "rejected") return "error";
    return "default";
};

const cap = (s) =>
    String(s || "").charAt(0).toUpperCase() + String(s || "").slice(1).toLowerCase();

function HireRequestsSection({
    pendingCount = 0,
    acceptedCount = 0,
    reqSearch = "",
    setReqSearch = () => { },
    reqStatusFilter = "All",
    setReqStatusFilter = () => { },
    loadingRequests = false,
    requestsError = "",
    filteredRequests = [],
    updatingRequestId = null,
    onUpdateStatus = () => { },
}) {
    const safeFilteredRequests = Array.isArray(filteredRequests)
        ? filteredRequests
        : [];

    return (
        <Card sx={{ borderRadius: 3, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 1.5,
                        mb: 2,
                    }}
                >
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Hire Requests
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {pendingCount} pending · {acceptedCount} accepted
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <TextField
                            size="small"
                            placeholder="Search..."
                            value={reqSearch}
                            onChange={(e) => setReqSearch(e.target.value)}
                        />

                        <TextField
                            size="small"
                            select
                            value={reqStatusFilter}
                            onChange={(e) => setReqStatusFilter(e.target.value)}
                            sx={{ minWidth: 140 }}
                        >
                            {["All", "Pending", "Accepted", "Rejected"].map((s) => (
                                <MenuItem key={s} value={s}>
                                    {s}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>

                {loadingRequests && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {!loadingRequests && requestsError && (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <Typography color="error">{requestsError}</Typography>
                    </Box>
                )}

                {!loadingRequests && !requestsError && safeFilteredRequests.length > 0 && (
                    <Grid container spacing={2}>
                        {safeFilteredRequests.map((req) => (
                            <Grid item xs={12} key={req.id}>
                                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                            gap: 2,
                                        }}
                                    >
                                        <Box sx={{ flex: 1, minWidth: 220 }}>
                                            <Typography fontWeight={700}>
                                                {req.jobRole || req.job_role || "Job Request"}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                {req.customerEmail ||
                                                    req.customer_email ||
                                                    req.customer_name ||
                                                    "Customer"}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mt: 0.5 }}
                                            >
                                                {req.message || "No message provided."}
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                alignItems: "center",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            <Chip
                                                label={cap(req.status)}
                                                color={getStatusColor(req.status)}
                                            />

                                            {String(req.status || "").toLowerCase() === "pending" && (
                                                <>
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="success"
                                                        disabled={updatingRequestId === req.id}
                                                        onClick={() =>
                                                            onUpdateStatus(req.id, "accepted")
                                                        }
                                                    >
                                                        Accept
                                                    </Button>

                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="error"
                                                        disabled={updatingRequestId === req.id}
                                                        onClick={() =>
                                                            onUpdateStatus(req.id, "rejected")
                                                        }
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {!loadingRequests &&
                    !requestsError &&
                    safeFilteredRequests.length === 0 && (
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <MarkEmailUnreadIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
                            <Typography>No hire requests found</Typography>
                        </Box>
                    )}
            </CardContent>
        </Card>
    );
}

export default HireRequestsSection;