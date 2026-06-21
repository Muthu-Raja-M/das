import React, { useState } from "react";
import {
    Box,
    Tabs,
    Tab,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    Avatar,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    CircularProgress,
    InputAdornment,
    TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SearchIcon from "@mui/icons-material/Search";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import VerifiedIcon from "@mui/icons-material/Verified";
import PendingIcon from "@mui/icons-material/Pending";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllCustomersService,
    deleteCustomerService,
    getAllEmployersService,
    verifyEmployerService,
    getEmployerDocumentsService,
} from "../services/adminpanel";
import logo from "../../../assets/logo.png";
import Clients from "../components/Clients";
import { getImageUrl } from "../../../shared/utils/imageHelper";

// ─── Chip helpers ───────────────────────────────────────────────────────────
const DocChip = ({ submitted }) =>
    submitted ? (
        <Chip
            label="Submitted"
            size="small"
            sx={{
                bgcolor: "#e3f2fd",
                color: "#1565c0",
                fontWeight: 700,
                border: "1px solid #90caf9",
            }}
        />
    ) : (
        <Chip
            label="Not Submitted"
            size="small"
            sx={{
                bgcolor: "#f5f5f5",
                color: "#757575",
                fontWeight: 700,
                border: "1px solid #e0e0e0",
            }}
        />
    );

const VerifyChip = ({ verified }) =>
    verified ? (
        <Chip
            icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
            label="Verified"
            size="small"
            sx={{
                bgcolor: "#e8f5e9",
                color: "#2e7d32",
                fontWeight: 700,
                border: "1px solid #a5d6a7",
                "& .MuiChip-icon": { color: "#2e7d32" },
            }}
        />
    ) : (
        <Chip
            label="Not Verified"
            size="small"
            sx={{
                bgcolor: "#fff8e1",
                color: "#f57f17",
                fontWeight: 700,
                border: "1px solid #ffe082",
            }}
        />
    );

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, bg }) => (
    <Card
        elevation={0}
        sx={{
            borderRadius: 3,
            border: "1px solid #e3eaf5",
            background: bg || "#fff",
            flex: 1,
            minWidth: 140,
            transition: "transform 0.18s, box-shadow 0.18s",
            "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 28px rgba(21,101,192,0.10)",
            },
        }}
    >
        <CardContent
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                py: "18px !important",
            }}
        >
            <Box
                sx={{
                    bgcolor: `${color}18`,
                    borderRadius: 2.5,
                    p: 1.3,
                    display: "flex",
                }}
            >
                {React.cloneElement(icon, { sx: { fontSize: 26, color } })}
            </Box>
            <Box>
                <Typography variant="h5" fontWeight={800} color={color} lineHeight={1.1}>
                    {value}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {label}
                </Typography>
            </Box>
        </CardContent>
    </Card>
);

// ─── Image Preview Card ───────────────────────────────────────────────────────
const ImagePreviewCard = ({ title, src }) => (
    <Card
        elevation={0}
        sx={{
            borderRadius: 3,
            border: "1px solid #e3eaf5",
            overflow: "hidden",
        }}
    >
        <Box
            sx={{
                bgcolor: "#f0f6ff",
                px: 2,
                py: 1.2,
                borderBottom: "1px solid #e3eaf5",
            }}
        >
            <Typography fontWeight={700} fontSize={13} color="#1565c0">
                {title}
            </Typography>
        </Box>

        <CardContent sx={{ p: "12px !important" }}>
            {src ? (
                <Box
                    component="img"
                    src={src}
                    alt={title}
                    sx={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 2,
                        border: "1px solid #e3eaf5",
                        display: "block",
                    }}
                />
            ) : (
                <Box
                    sx={{
                        height: 200,
                        borderRadius: 2,
                        border: "2px dashed #c7d9f5",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#90aac8",
                        bgcolor: "#f8fbff",
                        gap: 1,
                    }}
                >
                    <VisibilityIcon sx={{ fontSize: 32, opacity: 0.4 }} />
                    <Typography fontSize={12} fontWeight={600}>
                        No Image Available
                    </Typography>
                </Box>
            )}
        </CardContent>
    </Card>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectEmployerId, setRejectEmployerId] = useState(null);
    const [rejectMessage, setRejectMessage] = useState("");
    const [tab, setTab] = useState(0);
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedEmployerId, setSelectedEmployerId] = useState(null);
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();

    const { data: customers = [] } = useQuery({
        queryKey: ["admin-customers"],
        queryFn: getAllCustomersService,
    });

    const { data: employers = [] } = useQuery({
        queryKey: ["admin-employers"],
        queryFn: getAllEmployersService,
    });

    const { data: employerDocuments, isLoading: documentsLoading } = useQuery({
        queryKey: ["employer-documents", selectedEmployerId],
        queryFn: () => getEmployerDocumentsService(selectedEmployerId),
        enabled: !!selectedEmployerId,
    });

    const customerMutation = useMutation({
        mutationFn: (id) => deleteCustomerService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
        },
    });

    const employerMutation = useMutation({
        mutationFn: ({ id, action, admin_notes }) =>
            verifyEmployerService(id, action, admin_notes),

        onSuccess: (data) => {
            console.log("Mutation success:", data);
            queryClient.invalidateQueries({ queryKey: ["admin-employers"] });
            queryClient.invalidateQueries({ queryKey: ["employer-documents"] });
        },

        onError: (error) => {
            console.log("Mutation error:", error.response?.data || error);
        },
    });

    const pendingCustomers = customers.length;
    const approvedCustomers = 0;
    const pendingEmployers = employers.filter((e) => !e.is_verified).length;
    const verifiedEmployers = employers.filter((e) => e.is_verified).length;

    const filteredCustomers = customers.filter(
        (c) =>
            (c.fullname || "").toLowerCase().includes(search.toLowerCase()) ||
            (c.email || "").toLowerCase().includes(search.toLowerCase())
    );

    const filteredEmployers = employers.filter(
        (e) =>
            (e.username || "").toLowerCase().includes(search.toLowerCase()) ||
            (e.email || "").toLowerCase().includes(search.toLowerCase())
    );

    const thCell = {
        fontWeight: 800,
        fontSize: 12,
        color: "#1565c0",
        bgcolor: "#f0f6ff",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        py: 1.5,
    };

    const tdCell = {
        py: 1.4,
        fontSize: 13.5,
        borderBottom: "1px solid #f0f4fa",
    };

    const handleClosePreview = () => {
        setOpenPreview(false);
        setSelectedEmployerId(null);
    };

    return (
        <Box
            sx={{
                bgcolor: "#f5f8ff",
                minHeight: "100vh",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >
            <Box
                sx={{
                    bgcolor: "#1565c0",
                    px: { xs: 2, md: 4 },
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 16px rgba(21,101,192,0.22)",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                        sx={{
                            bgcolor: "rgba(255, 255, 255, 0.97)",
                            borderRadius: 2.5,
                            p: 1,
                            display: "flex",
                        }}
                    >
                        <img src={logo} width={50} height={50} />
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            color="#fff"
                            lineHeight={1.1}
                            letterSpacing={-0.3}
                        >
                            Blue Connect
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: "rgba(255,255,255,0.72)", fontWeight: 500 }}
                        >
                            Admin Control Panel
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                        sx={{
                            bgcolor: "rgba(255,255,255,0.2)",
                            width: 36,
                            height: 36,
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#fff",
                        }}
                    >
                        A
                    </Avatar>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        <Typography fontSize={13} fontWeight={700} color="#fff">
                            Admin
                        </Typography>
                        <Typography fontSize={11} color="rgba(255,255,255,0.65)">
                            Super Admin
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ px: { xs: 2, md: 4 }, py: 3, maxWidth: 1400, mx: "auto" }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    mb={3}
                    flexWrap="wrap"
                >
                    <StatCard
                        icon={<PeopleAltIcon />}
                        label="Total Customers"
                        value={customers.length}
                        color="#1565c0"
                        bg="#fff"
                    />
                    <StatCard
                        icon={<PendingIcon />}
                        label="Customer Records"
                        value={pendingCustomers}
                        color="#f57f17"
                        bg="#fff"
                    />
                    <StatCard
                        icon={<VerifiedIcon />}
                        label="Approved Customers"
                        value={approvedCustomers}
                        color="#2e7d32"
                        bg="#fff"
                    />
                    <StatCard
                        icon={<BusinessCenterIcon />}
                        label="Total Employers"
                        value={employers.length}
                        color="#6a1b9a"
                        bg="#fff"
                    />
                    <StatCard
                        icon={<PendingIcon />}
                        label="Unverified Employers"
                        value={pendingEmployers}
                        color="#d84315"
                        bg="#fff"
                    />
                    <StatCard
                        icon={<VerifiedIcon />}
                        label="Verified Employers"
                        value={verifiedEmployers}
                        color="#00695c"
                        bg="#fff"
                    />
                </Stack>

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        border: "1px solid #dce8f8",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            px: 3,
                            pt: 2.5,
                            pb: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        <Tabs
                            value={tab}
                            onChange={(_, v) => {
                                setTab(v);
                                setSearch("");
                            }}
                            sx={{
                                "& .MuiTab-root": {
                                    fontWeight: 700,
                                    fontSize: 13.5,
                                    textTransform: "none",
                                    minWidth: 0,
                                    px: 0,
                                    mr: 3.5,
                                    color: "#90aac8",
                                },
                                "& .Mui-selected": {
                                    color: "#1565c0 !important",
                                },
                                "& .MuiTabs-indicator": {
                                    bgcolor: "#1565c0",
                                    height: 3,
                                    borderRadius: 2,
                                },
                            }}
                        >
                            <Tab
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <PeopleAltIcon sx={{ fontSize: 17 }} />
                                        Customers
                                        <Box
                                            sx={{
                                                bgcolor: tab === 0 ? "#1565c0" : "#e3eaf5",
                                                color: tab === 0 ? "#fff" : "#90aac8",
                                                borderRadius: 10,
                                                px: 1,
                                                py: 0.1,
                                                fontSize: 11,
                                                fontWeight: 800,
                                                lineHeight: 1.7,
                                                minWidth: 22,
                                                textAlign: "center",
                                            }}
                                        >
                                            {customers.length}
                                        </Box>
                                    </Box>
                                }
                            />
                            <Tab
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <BusinessCenterIcon sx={{ fontSize: 17 }} />
                                        Employers
                                        <Box
                                            sx={{
                                                bgcolor: tab === 1 ? "#1565c0" : "#e3eaf5",
                                                color: tab === 1 ? "#fff" : "#90aac8",
                                                borderRadius: 10,
                                                px: 1,
                                                py: 0.1,
                                                fontSize: 11,
                                                fontWeight: 800,
                                                lineHeight: 1.7,
                                                minWidth: 22,
                                                textAlign: "center",
                                            }}
                                        >
                                            {employers.length}
                                        </Box>
                                    </Box>
                                }
                            />
                        </Tabs>

                        <TextField
                            size="small"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ fontSize: 18, color: "#90aac8" }} />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 3,
                                    fontSize: 13.5,
                                    bgcolor: "#f5f8ff",
                                    "& fieldset": { borderColor: "#dce8f8" },
                                    "&:hover fieldset": {
                                        borderColor: "#90caf9 !important",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#1565c0 !important",
                                    },
                                },
                            }}
                            sx={{ width: 260 }}
                        />
                    </Box>

                    <Box sx={{ borderTop: "1px solid #eaf1fb", mt: 1 }} />

                    {tab === 0 && (
                        <Clients
                            type="customer"
                            data={filteredCustomers}
                            customerMutation={customerMutation}
                        />
                    )}

                    {tab === 1 && (
                        <Clients
                            type="employer"
                            data={filteredEmployers}
                            employerMutation={employerMutation}
                            setSelectedEmployerId={setSelectedEmployerId}
                            setOpenPreview={setOpenPreview}
                            thCell={thCell}
                            tdCell={tdCell}
                        />
                    )}
                </Card>
            </Box>

            <Dialog
                open={openPreview}
                onClose={handleClosePreview}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        overflow: "hidden",
                        boxShadow: "0 24px 64px rgba(21,101,192,0.18)",
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        bgcolor: "#1565c0",
                        color: "#fff",
                        p: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            px: 3,
                            py: 2,
                        }}
                    >
                        <VisibilityIcon sx={{ fontSize: 20, opacity: 0.85 }} />
                        <Typography fontWeight={800} fontSize={16}>
                            Employer Documents Preview
                        </Typography>
                    </Box>

                    <Button
                        onClick={handleClosePreview}
                        sx={{
                            minWidth: 0,
                            color: "rgba(255,255,255,0.8)",
                            p: 1.5,
                            mr: 1,
                            "&:hover": {
                                bgcolor: "rgba(255,255,255,0.12)",
                                color: "#fff",
                            },
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 20 }} />
                    </Button>
                </DialogTitle>

                <DialogContent sx={{ p: 0, bgcolor: "#f8fbff" }}>
                    {documentsLoading ? (
                        <Box
                            sx={{
                                py: 8,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <CircularProgress sx={{ color: "#1565c0" }} />
                            <Typography color="#90aac8" fontWeight={600} fontSize={13}>
                                Loading documents…
                            </Typography>
                        </Box>
                    ) : employerDocuments ? (
                        <Box>
                            <Box
                                sx={{
                                    bgcolor: "#fff",
                                    px: 3,
                                    py: 2.5,
                                    borderBottom: "1px solid #eaf1fb",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        bgcolor: "#e3f2fd",
                                        color: "#1565c0",
                                        fontSize: 20,
                                        fontWeight: 800,
                                    }}
                                >
                                    {(employerDocuments.username || "?")[0].toUpperCase()}
                                </Avatar>

                                <Box>
                                    <Typography fontWeight={800} fontSize={16}>
                                        {employerDocuments.username}
                                    </Typography>
                                    <Typography fontSize={13} color="#5a7a9a">
                                        {employerDocuments.email} · {employerDocuments.phone}
                                    </Typography>
                                    <Typography fontSize={12} color="#90aac8">
                                        {employerDocuments.job_role} — {employerDocuments.district},{" "}
                                        {employerDocuments.state}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={2}>
                                    {[
                                        {
                                            title: "Face Image",
                                            src: getImageUrl(employerDocuments.face_image),
                                        },
                                        {
                                            title: "Aadhaar Card",
                                            src: getImageUrl(employerDocuments.aadhar_image),
                                        },
                                        {
                                            title: "PAN Card",
                                            src: getImageUrl(employerDocuments.pan_image),
                                        },
                                        {
                                            title: "Driving Licence",
                                            src: getImageUrl(employerDocuments.driving_licence_image),
                                        },
                                    ].map((doc) => (
                                        <Grid item xs={12} sm={6} key={doc.title}>
                                            <ImagePreviewCard title={doc.title} src={doc.src} />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ py: 8, textAlign: "center", color: "#90aac8" }}>
                            <VisibilityIcon sx={{ fontSize: 40, opacity: 0.3, mb: 1 }} />
                            <Typography fontWeight={600}>No document data found</Typography>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions
                    sx={{
                        bgcolor: "#fff",
                        px: 3,
                        py: 2,
                        borderTop: "1px solid #eaf1fb",
                        gap: 1,
                    }}
                >
                    <Button
                        onClick={handleClosePreview}
                        sx={{
                            fontWeight: 700,
                            color: "#5a7a9a",
                            textTransform: "none",
                            borderRadius: 2.5,
                            "&:hover": { bgcolor: "#f0f4fa" },
                        }}
                    >
                        Close
                    </Button>

                    <Box sx={{ flex: 1 }} />

                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<CheckCircleIcon />}
                        disabled={!selectedEmployerId || employerMutation.isPending}
                        onClick={() => {
                            employerMutation.mutate({
                                id: selectedEmployerId,
                                action: "approve",
                            });
                            handleClosePreview();
                        }}
                        sx={{
                            fontWeight: 700,
                            textTransform: "none",
                            borderRadius: 2.5,
                            bgcolor: "#2e7d32",
                            "&:hover": { bgcolor: "#1b5e20" },
                            px: 3,
                        }}
                    >
                        Approve Employer
                    </Button>

                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<CancelIcon />}
                        disabled={!selectedEmployerId || employerMutation.isPending}
                        onClick={() => {
                            setRejectEmployerId(selectedEmployerId);
                            setRejectDialogOpen(true);
                        }}
                        sx={{
                            fontWeight: 700,
                            textTransform: "none",
                            borderRadius: 2.5,
                            bgcolor: "#c62828",
                            "&:hover": { bgcolor: "#7f0000" },
                            px: 3,
                        }}
                    >
                        Reject Employer
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={rejectDialogOpen}
                onClose={() => setRejectDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Reject Employer</DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Rejection Message"
                        placeholder="Enter reason for rejection..."
                        value={rejectMessage}
                        onChange={(e) => setRejectMessage(e.target.value)}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => {
                            setRejectDialogOpen(false);
                            setRejectMessage("");
                            setRejectEmployerId(null);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={!rejectMessage.trim() || employerMutation.isPending}
                        onClick={async () => {
                            if (!rejectEmployerId) {
                                alert("No employer selected!");
                                return;
                            }

                            try {
                                const result = await employerMutation.mutateAsync({
                                    id: rejectEmployerId,
                                    action: "reject",
                                    admin_notes: rejectMessage,
                                });

                                console.log("Reject success:", result);
                                alert("Message sent to employer alerts ✅");

                                setRejectDialogOpen(false);
                                setRejectMessage("");
                                setRejectEmployerId(null);
                                handleClosePreview();
                            } catch (error) {
                                console.log("Reject failed:", error.response?.data || error);
                                alert("Reject failed. Check console.");
                            }
                        }}
                    >
                        Send
                    </Button>

                </DialogActions>
            </Dialog>
        </Box>
    );
}