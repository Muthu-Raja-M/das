import * as React from "react";
import { styled } from "@mui/material/styles";
import {
    Box,
    Typography,
    CssBaseline,
    Toolbar,
    IconButton,
    Card,
    CardContent,
    Grid,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Snackbar,
    Alert,
    CircularProgress,
    Avatar,
    Badge,
    Tooltip,
} from "@mui/material";

import MuiAppBar from "@mui/material/AppBar";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import PhoneIcon from "@mui/icons-material/Phone";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import StarIcon from "@mui/icons-material/Star";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import VerifiedIcon from "@mui/icons-material/Verified";
import FilterListIcon from "@mui/icons-material/FilterList";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { getAllStates, getDistricts } from "india-state-district";

import DriverImg from "../../../assets/driver.png";
import PlumberImg from "../../../assets/plumber.png";
import ElectricianImg from "../../../assets/electrician.png";
import CarpenterImg from "../../../assets/carpenter.png";
import PainterImg from "../../../assets/painter.png";
import HousekeepingImg from "../../../assets/Housekeeping.png";
import GardenerImg from "../../../assets/garderner.png";

import MessagesSection from "../../chat/components/MessagesSection";
import Drawer from "../../../shared/components/Drawer";
import CustomerProfileCard from "../components/CustomerProfileCard";

const drawerWidth = 200;
const collapsedWidth = 72;
const headerHeight = 88;

const COLORS = {
    primary: "#1C6EA4",
    primaryDark: "#0C4A7A",
    primaryLight: "#2889CC",
    primaryBg: "#EBF4FC",
    primaryBorder: "#BFDAF2",
    accent: "#F59E0B",
    success: "#22C55E",
    surface: "#FFFFFF",
    pageBg: "#F8FBFF",
    text: "#0F172A",
    textMuted: "#64748B",
    textHint: "#94A3B8",
    border: "#E2E8F0",
};

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (p) => p !== "open",
})(({ open }) => ({
    zIndex: 1201,
    backgroundColor: "#ffffff",
    color: "#111827",
    height: headerHeight,
    marginLeft: open ? drawerWidth : collapsedWidth,
    width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
    transition: "all 0.3s ease",
    justifyContent: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    borderBottom: "1px solid #e5e7eb",
}));

const WORKER_ROLES = [
    {
        role: "Driver",
        image: DriverImg,
        badge: "Popular",
        description: "Reliable travel & local transport.",
    },
    {
        role: "Plumber",
        image: PlumberImg,
        badge: "Verified",
        description: "Pipe fitting & water line work.",
    },
    {
        role: "Electrician",
        image: ElectricianImg,
        badge: "Top Rated",
        description: "Wiring, switch & power fixes.",
    },
    {
        role: "Carpenter",
        image: CarpenterImg,
        badge: "Trusted",
        description: "Furniture & wood repair work.",
    },
    {
        role: "Painter",
        image: PainterImg,
        badge: "Trending",
        description: "Interior & exterior painting.",
    },
    {
        role: "Home Cleaning",
        image: HousekeepingImg,
        badge: "Essential",
        description: "Daily & deep home cleaning.",
    },
    {
        role: "Gardener",
        image: GardenerImg,
        badge: "Fresh",
        description: "Garden care & plant maintenance.",
    },
];

const AVATAR_COLORS = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#06b6d4",
];

const normalizeText = (v) => String(v || "").trim().toLowerCase();

function WorkerCard({
    worker,
    isSelected,
    onSelect,
    hireMessage,
    onMessageChange,
    onHire,
    isSending,
}) {
    const workerName = worker.username || worker.name || "Worker";
    const workerRole = worker.job_role || worker.role || "Worker";
    const workerPhone = worker.phone || "—";
    const workerState = worker.state || "";
    const workerDistrict = worker.district || "";
    const workerDailyRate = worker.daily_rate || worker.dailyRate || "";
    const workerExperience = worker.experience || "—";

    const avatarBg = AVATAR_COLORS[workerName.charCodeAt(0) % AVATAR_COLORS.length];
    const initials = workerName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <Card
            onClick={onSelect}
            sx={{
                borderRadius: 2.5,
                border: isSelected
                    ? `2px solid ${COLORS.primary}`
                    : `1px solid ${COLORS.border}`,
                boxShadow: isSelected
                    ? `0 8px 24px ${COLORS.primary}22`
                    : "0 2px 8px rgba(0,0,0,0.05)",
                background: COLORS.surface,
                transition: "all 0.22s ease",
                cursor: "pointer",
                overflow: "hidden",
                "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                    transform: "translateY(-3px)",
                },
            }}
        >
            <Box
                sx={{
                    background: "#1C6EA4",
                    px: 2.5,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <Avatar
                    sx={{
                        width: 48,
                        height: 48,
                        bgcolor: avatarBg,
                        fontSize: 16,
                        fontWeight: 700,
                        border: "2px solid rgba(255,255,255,0.2)",
                        flexShrink: 0,
                    }}
                >
                    {initials}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                        <Typography fontWeight={700} fontSize={15} color="#fff" noWrap>
                            {workerName}
                        </Typography>
                        <VerifiedIcon sx={{ fontSize: 14, color: "#93C5FD" }} />
                    </Box>
                    <Typography
                        fontSize={12.5}
                        color="rgba(255,255,255,0.7)"
                        fontWeight={400}
                    >
                        {workerRole}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.4,
                            justifyContent: "flex-end",
                        }}
                    >
                        <StarIcon sx={{ color: "#F59E0B", fontSize: 14 }} />
                        <Typography fontSize={13} fontWeight={700} color="#fff">
                            4.7
                        </Typography>
                    </Box>
                    <Typography fontSize={11} color="rgba(255,255,255,0.55)" mt={0.2}>
                        Verified worker
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    px: 2.5,
                    py: 0.8,
                    background: COLORS.primaryBg,
                    display: "flex",
                    alignItems: "center",
                    gap: 0.8,
                    borderBottom: `1px solid ${COLORS.primaryBorder}`,
                }}
            >
                <Box
                    sx={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        bgcolor: COLORS.success,
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                            "0%,100%": { opacity: 1 },
                            "50%": { opacity: 0.4 },
                        },
                    }}
                />
                <Typography fontSize={11.5} color={COLORS.primary} fontWeight={500}>
                    Available now
                </Typography>
                <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography fontSize={11} color={COLORS.textMuted}>
                        Quick response
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{ p: 2, pb: "14px !important" }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 1,
                        mb: 1.5,
                    }}
                >
                    {[
                        {
                            icon: <PhoneIcon sx={{ fontSize: 13 }} />,
                            label: workerPhone,
                            color: COLORS.primary,
                        },
                        {
                            icon: <CurrencyRupeeIcon sx={{ fontSize: 13 }} />,
                            label: workerDailyRate ? `₹${workerDailyRate}/day` : "Negotiable",
                            color: "#059669",
                        },
                        {
                            icon: <LocationOnIcon sx={{ fontSize: 13 }} />,
                            label:
                                [workerDistrict, workerState].filter(Boolean).join(", ") || "—",
                            color: COLORS.primary,
                        },
                        {
                            icon: <WorkHistoryIcon sx={{ fontSize: 13 }} />,
                            label: workerExperience,
                            color: "#7C3AED",
                        },
                    ].map((item, i) => (
                        <Box
                            key={i}
                            sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 0.7,
                                p: 0.9,
                                borderRadius: 1.5,
                                background: "#F8FAFC",
                                border: `0.5px solid ${COLORS.border}`,
                            }}
                        >
                            <Box sx={{ color: item.color, mt: 0.1, flexShrink: 0 }}>
                                {item.icon}
                            </Box>
                            <Typography
                                fontSize={11.5}
                                color={COLORS.text}
                                sx={{ lineHeight: 1.3, wordBreak: "break-word" }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    placeholder={`Hi ${workerName.split(" ")[0]}, I'd like to hire you…`}
                    value={hireMessage || ""}
                    onChange={(e) => {
                        e.stopPropagation();
                        onMessageChange(workerName, e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                        mb: 1.2,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            fontSize: 12.5,
                            backgroundColor: "#FAFAFA",
                            "& fieldset": { borderColor: COLORS.border },
                            "&:hover fieldset": { borderColor: COLORS.primary },
                            "&.Mui-focused fieldset": { borderColor: COLORS.primary },
                        },
                    }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    size="medium"
                    startIcon={
                        isSending ? (
                            <CircularProgress size={13} color="inherit" />
                        ) : (
                            <SendIcon sx={{ fontSize: 15 }} />
                        )
                    }
                    disabled={isSending}
                    onClick={(e) => {
                        e.stopPropagation();
                        onHire(worker);
                    }}
                    sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: 13.5,
                        py: 1.1,
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
                        boxShadow: `0 4px 12px ${COLORS.primary}40`,
                        "&:hover": {
                            background: `linear-gradient(135deg, ${COLORS.primaryLight}, ${COLORS.primary})`,
                            boxShadow: `0 6px 16px ${COLORS.primary}50`,
                        },
                    }}
                >
                    {isSending ? "Sending…" : "Send Hire Request"}
                </Button>
            </CardContent>
        </Card>
    );
}

function CustomerProfileSection() {
    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    Workers
                </Typography>
                <Typography color="text.secondary">
                    Profile section can be added here.
                </Typography>
            </CardContent>
        </Card>
    );
}

function CustomerRequestsSection({ hireCount }) {
    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    My Requests
                </Typography>
                <Typography color="text.secondary">
                    Total requests sent: {hireCount}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default function CustomerDashboard() {
    const [open, setOpen] = React.useState(true);
    const [activeMenu, setActiveMenu] = React.useState("Home");
    const [selectedRole, setSelectedRole] = React.useState(null);
    const [selectedState, setSelectedState] = React.useState("");
    const [selectedDistrict, setSelectedDistrict] = React.useState("");
    const [selectedWorkerName, setSelectedWorkerName] = React.useState("");
    const [hireMessages, setHireMessages] = React.useState({});
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [sendingHireId, setSendingHireId] = React.useState(null);
    const [hireCount, setHireCount] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [workers, setWorkers] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);

    const workersSectionRef = React.useRef(null);

    const states = React.useMemo(() => getAllStates(), []);
const districts = React.useMemo(() => {
    if (!selectedState) return [];

    const data = getDistricts(selectedState) || [];

    return data.map((item) =>
        typeof item === "string" ? item : item.name
    );
}, [selectedState]);
    const handleLogout = () => {
        ["token", "role", "user", "email", "phone", "profile_image"].forEach((k) =>
            localStorage.removeItem(k)
        );
        window.location.href = "/login";
    };

    // ── Step 1: Customer clicks a worker category ──────────────────────────────
    // Only update role + reset location/workers. Do NOT fetch anything here.
    const handleRoleSelect = (worker) => {
        setSelectedRole(worker);
        setSelectedState("");
        setSelectedDistrict("");
        setWorkers([]);
        setActiveMenu("Home");

        setTimeout(() => {
            workersSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 200);
    };

    // ── fetchWorkers: called automatically once role + state + district are set ─
    const fetchWorkers = React.useCallback(async () => {
        if (!selectedRole?.role || !selectedState || !selectedDistrict) {
            setWorkers([]);
            return;
        }

        try {
            setLoading(true);

      const selectedStateName =
    states.find((s) => s.code === selectedState)?.name || selectedState;


const params = new URLSearchParams({
    job_role: selectedRole.role,
    state: selectedStateName,
    district: selectedDistrict,
});
            const url = `http://127.0.0.1:8000/api/employer/verified-list/?${params.toString()}`;

            const res = await fetch(url);

            if (!res.ok) {
                throw new Error("Failed to fetch workers");
            }

            const data = await res.json();

            setWorkers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setWorkers([]);
            setSnackbarSeverity("error");
            setSnackbarMessage("Failed to load workers");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    }, [selectedRole, selectedState, selectedDistrict]);

    // ── Step 4: Auto-fetch only when ALL three selections are present ──────────
    React.useEffect(() => {
        if (selectedRole && selectedState && selectedDistrict) {
            fetchWorkers();
        }
    }, [selectedRole, selectedState, selectedDistrict, fetchWorkers]);

    // ── Hire request: unchanged ────────────────────────────────────────────────
    const handleHireWorker = async (worker) => {
        try {
            setSendingHireId(worker.id);

            const workerName = worker.username || worker.name || "Worker";
            const customerEmail = localStorage.getItem("email");
            const employerEmail = worker.email;
            const jobRole = worker.job_role || worker.role || "";
            const message = hireMessages[workerName] || "";

            if (!customerEmail) {
                throw new Error("Customer email not found. Please login again.");
            }

            if (!employerEmail) {
                throw new Error("Employer email not found.");
            }

            const res = await fetch("http://127.0.0.1:8000/api/hirerequest/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer_email: customerEmail,
                    employer_email: employerEmail,
                    job_role: jobRole,
                    message: message,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data?.error || data?.message || "Failed to send hire request"
                );
            }

            setHireCount((c) => c + 1);
            setHireMessages((prev) => ({ ...prev, [workerName]: "" }));
            setSnackbarSeverity("success");
            setSnackbarMessage(data?.message || `Hire request sent to ${workerName}`);
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarSeverity("error");
            setSnackbarMessage(error.message || "Failed to send hire request");
            setSnackbarOpen(true);
        } finally {
            setSendingHireId(null);
        }
    };

    // ── Search filter: unchanged ───────────────────────────────────────────────
    const filteredWorkers = React.useMemo(() => {
        return workers.filter((worker) => {
            if (!searchQuery) return true;

            const workerName = worker.username || worker.name || "";
            const workerRole = worker.job_role || worker.role || "";

            return (
                normalizeText(workerName).includes(normalizeText(searchQuery)) ||
                normalizeText(workerRole).includes(normalizeText(searchQuery))
            );
        });
    }, [workers, searchQuery]);

    const navItems = [
        { text: "Home", icon: <HomeIcon sx={{ fontSize: 18 }} /> },
        { text: "My Order", icon: <AssignmentIcon sx={{ fontSize: 18 }} /> },
    ];

    const renderDashboardContent = () => (
        <>
            {/* ── Hero banner ── */}
            <Box
                sx={{
                    mb: 3,
                    px: 3,
                    py: 2,
                    borderRadius: 2.5,
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: `0 6px 24px ${COLORS.primary}30`,
                }}
            >
                <Box>
                    <Typography fontWeight={700} fontSize={16} color="#fff">
                        Find Trusted Workers Near You
                    </Typography>
                    <Typography
                        fontSize={12.5}
                        color="rgba(255,255,255,0.7)"
                        sx={{ mt: 0.3 }}
                    >
                        Select a category below, then filter by state & district
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                    {["🔧", "⚡", "🌿"].map((e, i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                background: "rgba(255,255,255,0.12)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 16,
                                border: "1px solid rgba(255,255,255,0.15)",
                            }}
                        >
                            {e}
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* ── Step 1: Worker category grid ── */}
            <Typography
                fontWeight={700}
                fontSize={14}
                color={COLORS.text}
                sx={{ mb: 1.5 }}
            >
                Choose Worker Category
            </Typography>

            <Grid container spacing={2} alignItems="stretch" sx={{ mb: 1 }}>
                {WORKER_ROLES.map((worker, index) => {
                    const isSelected = selectedRole?.role === worker.role;

                    return (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                            <Card
                                onClick={() => handleRoleSelect(worker)}
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: 2.5,
                                    minHeight: 160,
                                    textAlign: "center",
                                    p: 2,
                                    border: isSelected
                                        ? `2px solid ${COLORS.primary}`
                                        : `1px solid ${COLORS.border}`,
                                    background: isSelected ? COLORS.primaryBg : COLORS.surface,
                                    boxShadow: isSelected
                                        ? `0 6px 20px ${COLORS.primary}25`
                                        : "0 2px 8px rgba(0,0,0,0.04)",
                                    transition: "all 0.22s ease",
                                    "&:hover": {
                                        transform: "translateY(-4px) scale(1.02)",
                                        boxShadow: "0 10px 24px rgba(0,0,0,0.10)",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        overflow: "hidden",
                                        border: `2px solid ${isSelected ? COLORS.primary : COLORS.border}`,
                                        mx: "auto",
                                        mb: 1.2,
                                        background: "#fff",
                                    }}
                                >
                                    <img
                                        src={worker.image}
                                        alt={worker.role}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </Box>

                                <Typography
                                    fontWeight={700}
                                    fontSize={14}
                                    color={isSelected ? COLORS.primary : COLORS.text}
                                >
                                    {worker.role}
                                </Typography>

                                <Typography
                                    fontSize={11.5}
                                    color={COLORS.textMuted}
                                    sx={{ mt: 0.4, lineHeight: 1.4 }}
                                >
                                    {worker.description}
                                </Typography>

                                <Chip
                                    label={worker.badge}
                                    size="small"
                                    sx={{
                                        mt: 1,
                                        fontSize: 10,
                                        height: 20,
                                        bgcolor: isSelected
                                            ? `${COLORS.primary}15`
                                            : "#F1F5F9",
                                        color: isSelected ? COLORS.primary : COLORS.textMuted,
                                        fontWeight: 600,
                                    }}
                                />

                                {isSelected && (
                                    <Box
                                        sx={{
                                            mt: 1,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            px: 1.2,
                                            py: 0.4,
                                            borderRadius: 1.5,
                                            background: `${COLORS.primary}12`,
                                        }}
                                    >
                                        <CheckCircleIcon
                                            sx={{ fontSize: 13, color: COLORS.primary }}
                                        />
                                        <Typography
                                            fontSize={11}
                                            color={COLORS.primary}
                                            fontWeight={600}
                                        >
                                            Selected
                                        </Typography>
                                    </Box>
                                )}
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* ── Steps 2–4: Location filter + worker results (only after category pick) ── */}
            {selectedRole && (
                <>
                    {/* ── Step 2 & 3: Location filter row ── */}
                    <Box
                        ref={workersSectionRef}
                        sx={{
                            mt: 3,
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            background: COLORS.surface,
                            border: `1px solid ${COLORS.border}`,
                            display: "flex",
                            gap: 1.5,
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <FilterListIcon sx={{ color: COLORS.textMuted, fontSize: 17 }} />
                            <Typography fontWeight={600} fontSize={13} color={COLORS.text}>
                                Filter by Location
                            </Typography>
                        </Box>

                        {/* State dropdown — always enabled once category is selected */}
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel sx={{ fontSize: 13 }}>State</InputLabel>
                            <Select
                                value={selectedState}
                                label="State"
                                onChange={(e) => {
                                    // Step 3: state changes → clear district + workers
                                    setSelectedState(e.target.value);
                                    setSelectedDistrict("");
                                    setWorkers([]);
                                }}
                                sx={{ fontSize: 13, borderRadius: 1.5 }}
                            >
                                <MenuItem value="" sx={{ fontSize: 13 }}>
                                    All States
                                </MenuItem>
 {states.map((state) => (
    <MenuItem
        key={state.code}
        value={state.code}
    >
        {state.name}
    </MenuItem>
))}
                            </Select>
                        </FormControl>

                        {/* District dropdown — enabled only after state is picked */}
                        <FormControl
                            size="small"
                            sx={{ minWidth: 180 }}
                            disabled={!selectedState}
                        >
                            <InputLabel sx={{ fontSize: 13 }}>District</InputLabel>
                            <Select
                                value={selectedDistrict}
                                label="District"
                                onChange={(e) => {
                                    // Step 4: district set → useEffect fires fetchWorkers()
                                    setSelectedDistrict(e.target.value);
                                }}
                                sx={{ fontSize: 13, borderRadius: 1.5 }}
                            >
                                <MenuItem value="" sx={{ fontSize: 13 }}>
                                    All Districts
                                </MenuItem>
{districts.map((district) => (
    <MenuItem
        key={district}
        value={district}
        sx={{ fontSize: 13 }}
    >
        {district}
    </MenuItem>
))}
                            </Select>
                        </FormControl>

                        {/* Results count chip — only when both dropdowns are filled */}
                        {selectedState && selectedDistrict && (
                            <Chip
                                label={`${filteredWorkers.length} worker${filteredWorkers.length !== 1 ? "s" : ""} found`}
                                size="small"
                                sx={{
                                    ml: "auto",
                                    fontWeight: 600,
                                    fontSize: 11.5,
                                    backgroundColor: COLORS.primaryBg,
                                    color: COLORS.primary,
                                    height: 24,
                                }}
                            />
                        )}
                    </Box>

                    {/* ── Worker results area ── */}
                    <Box sx={{ mb: 2 }}>
                        {/* Case A: state or district not yet selected → prompt */}
                        {(!selectedState || !selectedDistrict) && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Please select your State and District to view available{" "}
                                {selectedRole.role}s near you.
                            </Alert>
                        )}

                        {/* Case B: both selected → show spinner / cards / empty state */}
                        {selectedState && selectedDistrict && (
                            <>
                                <Box
                                    sx={{
                                        mb: 2,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography fontWeight={700} fontSize={14} color={COLORS.text}>
                                            Available {selectedRole.role}s
                                        </Typography>
                                        <Typography
                                            fontSize={12}
                                            color={COLORS.textHint}
                                            sx={{ mt: 0.2 }}
                                        >
                                            Select a card and send a hire request
                                        </Typography>
                                    </Box>
                                </Box>

                                {loading ? (
                                    <Box
                                        sx={{
                                            p: 5,
                                            textAlign: "center",
                                            borderRadius: 2.5,
                                            background: COLORS.surface,
                                            border: `1px solid ${COLORS.border}`,
                                        }}
                                    >
                                        <CircularProgress />
                                        <Typography
                                            fontSize={13}
                                            color={COLORS.textMuted}
                                            sx={{ mt: 1.5 }}
                                        >
                                            Loading workers...
                                        </Typography>
                                    </Box>
                                ) : filteredWorkers.length > 0 ? (
                                    <Grid container spacing={2} alignItems="stretch">
                                        {filteredWorkers.map((worker, index) => {
                                            const workerName =
                                                worker.username || worker.name || `worker-${index}`;

                                            return (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    md={6}
                                                    lg={4}
                                                    key={worker.id || workerName}
                                                >
                                                    <WorkerCard
                                                        worker={worker}
                                                        isSelected={selectedWorkerName === workerName}
                                                        onSelect={() => setSelectedWorkerName(workerName)}
                                                        hireMessage={hireMessages[workerName]}
                                                        onMessageChange={(name, val) =>
                                                            setHireMessages((prev) => ({
                                                                ...prev,
                                                                [name]: val,
                                                            }))
                                                        }
                                                        onHire={handleHireWorker}
                                                        isSending={sendingHireId === worker.id}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </Grid>
                                ) : (
                                    <Box
                                        sx={{
                                            p: 5,
                                            textAlign: "center",
                                            borderRadius: 2.5,
                                            background: COLORS.surface,
                                            border: `1px dashed ${COLORS.border}`,
                                        }}
                                    >
                                        <Typography fontSize={32} sx={{ mb: 1 }}>
                                            🔍
                                        </Typography>
                                        <Typography
                                            fontWeight={700}
                                            fontSize={14}
                                            color={COLORS.text}
                                        >
                                            No {selectedRole.role}s are currently available in the
                                            selected location.
                                        </Typography>
                                        <Typography
                                            fontSize={12.5}
                                            color={COLORS.textHint}
                                            sx={{ mt: 0.5 }}
                                        >
                                            No {selectedRole.role}s in{" "}
                                            {selectedDistrict}, {selectedState}. Try a different area.
                                        </Typography>
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
                </>
            )}
        </>
    );

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: COLORS.pageBg,
            }}
        >
            <CssBaseline />

            <AppBar position="fixed" open={open}>
                <Toolbar
                    sx={{
                        minHeight: `${headerHeight}px !important`,
                        px: { xs: 1.5, sm: 2.5 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                    lineHeight: 1.2,
                                    fontSize: { xs: "1rem", sm: "1.25rem" },
                                    color: "#111827",
                                }}
                            >
                                Customer Dashboard
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    display: { xs: "none", sm: "block" },
                                }}
                            >
                                Find & hire trusted workers near you
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            maxWidth: 360,
                            mx: 3,
                            display:
                                activeMenu === "Home"
                                    ? { xs: "none", md: "flex" }
                                    : "none",
                            alignItems: "center",
                            gap: 1,
                            background: "#f8fafc",
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.8,
                            border: "1px solid #e2e8f0",
                        }}
                    >
                        <SearchIcon sx={{ fontSize: 16, color: "#64748B" }} />
                        <input
                            placeholder="Search workers by Id"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                border: "none",
                                background: "transparent",
                                outline: "none",
                                color: "#111827",
                                fontSize: 13,
                                width: "100%",
                                fontFamily: "inherit",
                            }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Tooltip title="Notifications">
                            <IconButton
                                sx={{
                                    width: 42,
                                    height: 42,
                                    borderRadius: "50%",
                                    backgroundColor: hireCount > 0 ? "#eff6ff" : "#f1f5f9",
                                    border:
                                        hireCount > 0
                                            ? "1px solid #bfdbfe"
                                            : "1px solid #e2e8f0",
                                    "&:hover": {
                                        backgroundColor: hireCount > 0 ? "#dbeafe" : "#e2e8f0",
                                    },
                                }}
                            >
                                <Badge
                                    badgeContent={hireCount}
                                    color="error"
                                    overlap="circular"
                                >
                                    <NotificationsIcon
                                        sx={{
                                            color: hireCount > 0 ? "#1976D2" : "#0f172a",
                                        }}
                                    />
                                </Badge>
                            </IconButton>
                        </Tooltip>

                        <Box
                            sx={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <Avatar
                                src={localStorage.getItem("profile_image") || ""}
                                onClick={() => setProfileOpen((prev) => !prev)}
                                sx={{
                                    width: 42,
                                    height: 42,
                                    bgcolor: "#1976D2",
                                    fontWeight: 700,
                                    border: "2px solid #dbeafe",
                                    cursor: "pointer",
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0 6px 14px rgba(25,118,210,0.25)",
                                    },
                                }}
                            >
                                {!localStorage.getItem("profile_image") &&
                                    (localStorage.getItem("user") || "C")
                                        .charAt(0)
                                        .toUpperCase()}
                            </Avatar>

                            <CustomerProfileCard
                                open={profileOpen}
                                onClose={() => setProfileOpen(false)}
                                onLogout={handleLogout}
                                profileImage={localStorage.getItem("profile_image")}
                                userName={localStorage.getItem("user")}
                                email={localStorage.getItem("email")}
                                phone={localStorage.getItem("phone")}
                            />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                open={open}
                setOpen={setOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                navItems={navItems}
                onLogout={handleLogout}
                drawerWidth={drawerWidth}
                collapsedWidth={collapsedWidth}
                headerHeight={headerHeight}
            />

            <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, mt: `${headerHeight}px` }}>
                {activeMenu === "Home" && renderDashboardContent()}
                {activeMenu === "Messages" && <MessagesSection />}
                {activeMenu === "Workers" && <CustomerProfileSection />}
                {activeMenu === "My Requests" && (
                    <CustomerRequestsSection hireCount={hireCount} />
                )}
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3500}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    variant="filled"
                    sx={{ width: "100%", fontSize: 13, borderRadius: 2 }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}