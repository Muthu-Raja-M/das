import React from "react";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Stack,
} from "@mui/material";

const getStatusColor = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "accepted") return "success";
    if (value === "rejected") return "error";
    return "warning";
};

const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

export default function MyJobsSection({
    jobs = [],
    onUpdateStatus,
    updatingRequestId,
    onOpenMessage,
}) {
    if (!jobs.length) {
        return (
            <Box
                sx={{
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    backgroundColor: "#fff",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    No job requests found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    When customers send hire requests, they will appear here.
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
            }}
        >
            <Box sx={{ p: 2.5, backgroundColor: "#fff" }}>
                <Typography variant="h6" fontWeight={700}>
                    My Jobs
                </Typography>
            </Box>

            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                        <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {jobs.map((job) => {
                        const username =
                            job.customer?.fullname ||
                            job.customer?.name ||
                            job.customer_name ||
                            job.customer_fullname ||
                            job.fullname ||
                            job.customerEmail ||
                            job.customer_email ||
                            "Customer";

                        const role =
                            job.jobRole ||
                            job.job_role ||
                            job.role ||
                            "-";

                        const dateValue =
                            job.createdAt ||
                            job.created_at ||
                            job.date ||
                            job.request_date ||
                            null;

                        const status = String(job.status || "pending").toLowerCase();
                        const isPending = status === "pending";
                        const isUpdating = updatingRequestId === job.id;

                        return (
                            <TableRow key={job.id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>
                                    {username}
                                </TableCell>

                                <TableCell>{role}</TableCell>

                                <TableCell>{formatDate(dateValue)}</TableCell>

                                <TableCell>
                                    <Chip
                                        label={status}
                                        color={getStatusColor(status)}
                                        size="small"
                                        sx={{
                                            fontWeight: 600,
                                            textTransform: "capitalize",
                                            minWidth: 90,
                                        }}
                                    />
                                </TableCell>

                                <TableCell>
                                    {isPending ? (
                                        <Stack direction="row" spacing={1}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                disabled={isUpdating}
                                                onClick={() => onUpdateStatus?.(job.id, "accepted")}
                                                sx={{ textTransform: "none", fontWeight: 700 }}
                                            >
                                                Accept
                                            </Button>

                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                disabled={isUpdating}
                                                onClick={() => onUpdateStatus?.(job.id, "rejected")}
                                                sx={{ textTransform: "none", fontWeight: 700 }}
                                            >
                                                Reject
                                            </Button>
                                        </Stack>
                                    ) : status === "accepted" ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => onOpenMessage?.(job)}
                                            sx={{ textTransform: "none", fontWeight: 700 }}
                                        >
                                            Message
                                        </Button>
                                    ) : (
                                        <Typography fontSize={13} color="text.secondary">
                                            No action
                                        </Typography>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}