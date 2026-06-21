import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Chip,
    Button,
    Card,
    CardContent,
    TextField,
    Stack,
    Snackbar,
    Alert,
} from "@mui/material";

import {
    fetchVerificationList,
    fetchVerificationDetail,
    approveVerification,
    rejectVerification,
} from "../services/employerVerificationService";

const statusColor = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") return "success";
    if (s === "rejected") return "error";
    return "warning";
};

const ImageCard = ({ title, src }) => (
    <Card elevation={0} sx={{ border: "1px solid #e3eaf5", borderRadius: 3 }}>
        <CardContent>
            <Typography fontWeight={700} mb={1}>
                {title}
            </Typography>

            {src ? (
                <Box
                    component="img"
                    src={src}
                    alt={title}
                    sx={{
                        width: "100%",
                        height: 220,
                        objectFit: "cover",
                        borderRadius: 2,
                        border: "1px solid #e3eaf5",
                    }}
                />
            ) : (
                <Box
                    sx={{
                        height: 220,
                        border: "2px dashed #c7d9f5",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#90aac8",
                    }}
                >
                    No Image
                </Box>
            )}
        </CardContent>
    </Card>
);

export default function AdminEmployerVerificationSection() {
    const [items, setItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [detail, setDetail] = useState(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [loading, setLoading] = useState(false);

    const [snack, setSnack] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnack = (message, severity = "success") => {
        setSnack({ open: true, message, severity });
    };

    const loadList = async () => {
        try {
            const data = await fetchVerificationList();
            setItems(data || []);
        } catch (error) {
            showSnack("Failed to load verification list", "error");
        }
    };

    const loadDetail = async (id) => {
        try {
            setLoading(true);
            const data = await fetchVerificationDetail(id);

            setDetail(data);
            setSelectedId(id);
            setAdminNotes(data?.admin_notes || "");
        } catch (error) {
            showSnack("Failed to load verification detail", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadList();
    }, []);

    const handleApprove = async () => {
        if (!selectedId) return;

        try {
            const result = await approveVerification(detail.employer.id, {
                admin_notes: adminNotes,
            });

            showSnack(
                `${result?.message || "Approved"} - Employer ID: ${result?.employer_unique_id || ""
                }`,
                "success"
            );

            await loadList();
            await loadDetail(selectedId);
        } catch (error) {
            showSnack(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Approval failed",
                "error"
            );
        }
    };

    const handleReject = async () => {
        if (!selectedId) return;

        if (!adminNotes.trim()) {
            showSnack("Please enter rejection reason in admin notes", "error");
            return;
        }

        try {
            const result = await rejectVerification(detail.employer.id, {
                admin_notes: adminNotes,
            });

            showSnack(result?.message || "Rejected successfully", "success");

            await loadList();
            await loadDetail(selectedId);
        } catch (error) {
            showSnack(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Rejection failed",
                "error"
            );
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={800} mb={3}>
                Employer Verification Requests
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ borderRadius: 3, p: 2, border: "1px solid #e3eaf5" }}>
                        <Typography fontWeight={800} mb={2}>
                            Employer List
                        </Typography>

                        <List>
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <ListItemButton
                                        key={item.id}
                                        selected={selectedId === item.id}
                                        onClick={() => loadDetail(item.id)}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            border: "1px solid #edf2f7",
                                        }}
                                    >
                                        <ListItemText
                                            primary={item.name || item.employer_name || "Employer"}
                                            secondary={item.email || item.employer_email}
                                        />
                                        <Chip
                                            label={item.status}
                                            color={statusColor(item.status)}
                                            size="small"
                                        />
                                    </ListItemButton>
                                ))
                            ) : (
                                <Typography color="text.secondary" fontSize={14}>
                                    No verification requests
                                </Typography>
                            )}
                        </List>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ borderRadius: 3, p: 2, border: "1px solid #e3eaf5" }}>
                        {!detail ? (
                            <Typography color="text.secondary">
                                Click an employer name to see uploaded documents.
                            </Typography>
                        ) : loading ? (
                            <Typography>Loading documents...</Typography>
                        ) : (
                            <>
                                <Typography variant="h6" fontWeight={800} mb={1}>
                                    {detail?.employer?.name || detail?.name || "Employer"}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" mb={0.5}>
                                    {detail?.employer?.email || detail?.email}
                                </Typography>

                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    {detail?.employer?.phone || detail?.phone}
                                </Typography>

                                <Stack direction="row" spacing={1} mb={2}>
                                    <Chip
                                        label={`Status: ${detail.status}`}
                                        color={statusColor(detail.status)}
                                    />

                                    {detail.employer_unique_id && (
                                        <Chip
                                            label={`Employer ID: ${detail.employer_unique_id}`}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    )}
                                </Stack>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <ImageCard title="Face Image" src={detail.face_image} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <ImageCard title="Aadhaar Image" src={detail.aadhar_image} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <ImageCard title="PAN Image" src={detail.pan_image} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <ImageCard title="Driving Licence" src={detail.driving_licence_image} />
                                    </Grid>
                                </Grid>

                                <TextField
                                    label="Admin Notes / Rejection Reason"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    sx={{ mt: 3 }}
                                />

                                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={handleApprove}
                                        disabled={detail.status === "approved"}
                                        sx={{ textTransform: "none", fontWeight: 700 }}
                                    >
                                        Approve and Generate Employer ID
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={handleReject}
                                        disabled={detail.status === "approved"}
                                        sx={{ textTransform: "none", fontWeight: 700 }}
                                    >
                                        Reject
                                    </Button>
                                </Stack>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>

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