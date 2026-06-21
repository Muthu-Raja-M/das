import React, { useState } from "react";
import {
    Box,
    Avatar,
    Typography,
    Button,
    Divider,
    IconButton,
    Chip,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import EditIcon from "@mui/icons-material/Edit";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PolicyIcon from "@mui/icons-material/Policy";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import VerifiedIcon from "@mui/icons-material/Verified";
import PendingIcon from "@mui/icons-material/Pending";

const BLUE = {
    50: "#E6F1FB",
    100: "#B5D4F4",
    200: "#85B7EB",
    400: "#378ADD",
    600: "#185FA5",
    800: "#0C447C",
    900: "#042C53",
};

function IconCircle({ children, active }) {
    return (
        <Box
            sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                backgroundColor: active ? BLUE[50] : "#f1f5f9",
                color: active ? BLUE[600] : "#64748B",
                transition: "background 0.2s, color 0.2s",
            }}
        >
            {children}
        </Box>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                p: 1.1,
                borderRadius: 2,
            }}
        >
            <IconCircle active>{icon}</IconCircle>
            <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 11, color: "#94A3B8", lineHeight: 1.2 }}>
                    {label}
                </Typography>
                <Typography
                    sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#111827",
                        wordBreak: "break-word",
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

function MenuItem({ icon, label, onClick }) {
    const [hovered, setHovered] = useState(false);

    return (
        <Box
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.2,
                py: 1,
                borderRadius: 2,
                cursor: "pointer",
                backgroundColor: hovered ? BLUE[50] : "transparent",
                transition: "background 0.18s",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <IconCircle active={hovered}>{icon}</IconCircle>
                <Typography
                    sx={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: hovered ? BLUE[600] : "#111827",
                        transition: "color 0.18s",
                    }}
                >
                    {label}
                </Typography>
            </Box>
            <ChevronRightIcon
                sx={{
                    fontSize: 17,
                    color: hovered ? BLUE[400] : "#CBD5E1",
                    transition: "color 0.18s",
                }}
            />
        </Box>
    );
}

export default function EmployerProfile({
    open,
    onClose,
    onLogout,
    profileImage,
    userName,
    email,
    employerId,
    isVerified,
    onEditProfile,
    onCustomerService,
    onPolicy,
    onFeedback,
    onHelp,
}) {
    if (!open) return null;

    const initials = (userName || "E")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const infoRows = [
        {
            icon: <BadgeIcon sx={{ fontSize: 16 }} />,
            label: "Employer ID",
            value: employerId || "-",
        },
        {
            icon: <PersonIcon sx={{ fontSize: 16 }} />,
            label: "Name",
            value: userName || "—",
        },
        {
            icon: <EmailIcon sx={{ fontSize: 16 }} />,
            label: "Email",
            value: email || "—",
        },
    ];

    const menuItems = [
        {
            icon: <EditIcon sx={{ fontSize: 16 }} />,
            label: "Edit Profile",
            onClick: onEditProfile,
        },
        {
            icon: <SupportAgentIcon sx={{ fontSize: 16 }} />,
            label: "Customer Service",
            onClick: onCustomerService,
        },
        {
            icon: <PolicyIcon sx={{ fontSize: 16 }} />,
            label: "Policy",
            onClick: onPolicy,
        },
        {
            icon: <FeedbackIcon sx={{ fontSize: 16 }} />,
            label: "Feedback",
            onClick: onFeedback,
        },
        {
            icon: <HelpOutlineIcon sx={{ fontSize: 16 }} />,
            label: "Help",
            onClick: onHelp,
        },
    ];

    return (
        <Box
            sx={{
                position: "absolute",
                top: 70,
                right: 0,
                width: 320,
                background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                borderRadius: 3,
                border: "1px solid rgba(0,0,0,0.05)",

                // 🔥 premium shadow
                boxShadow: `
      0 10px 25px rgba(0,0,0,0.08),
      0 20px 60px rgba(0,0,0,0.12)
    `,

                // 🔥 smooth open animation
                animation: "fadeSlideIn 0.25s ease",

                // 🔥 hover elevation
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `
        0 20px 40px rgba(0,0,0,0.12),
        0 30px 80px rgba(0,0,0,0.16)
      `,
                },

                transition: "all 0.25s ease",
                overflow: "hidden",
                zIndex: 1400,

                "@keyframes fadeSlideIn": {
                    from: {
                        opacity: 0,
                        transform: "translateY(-10px) scale(0.98)",
                    },
                    to: {
                        opacity: 1,
                        transform: "translateY(0) scale(1)",
                    },
                },
            }}
        >
            <Box
                sx={{
                    background: "linear-gradient(135deg, #1C6EA4, #378ADD)",
                    px: 2,
                    pt: 2.5,
                    pb: 2.5,
                    textAlign: "center",
                    position: "relative",
                }}
            >
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color: "rgba(255,255,255,0.7)",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "#fff",
                        },
                    }}
                >
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>

                <Avatar
                    src={profileImage || ""}
                    alt={userName || "Employer"}
                    sx={{
                        width: 72,
                        height: 72,
                        mx: "auto",
                        mb: 1.2,
                        bgcolor: BLUE[100],
                        color: BLUE[900],
                        fontSize: 22,
                        fontWeight: 700,
                        border: "2.5px solid rgba(255,255,255,0.25)",

                        // 🔥 glow effect
                        boxShadow: "0 0 0 4px rgba(255,255,255,0.15), 0 8px 20px rgba(0,0,0,0.2)",
                    }}
                >
                    {!profileImage && initials}
                </Avatar>

                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: 16,
                        color: "#fff",
                        lineHeight: 1.2,
                    }}
                >
                    {userName || "Employer"}
                </Typography>

                <Typography sx={{ fontSize: 11.5, color: BLUE[100], mt: 0.4 }}>
                    Blue Connect Employer
                </Typography>

                <Box sx={{ mt: 1.2 }}>
                    {isVerified ? (
                        <Chip
                            icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                            label="Verified"
                            size="small"
                            sx={{
                                backgroundColor: "rgba(255,255,255,0.15)",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                                "& .MuiChip-icon": {
                                    color: "#fff",
                                },
                            }}
                        />
                    ) : (
                        <Chip
                            icon={<PendingIcon sx={{ fontSize: 14 }} />}
                            label="Not Verified"
                            size="small"
                            sx={{
                                backgroundColor: "rgba(255,255,255,0.15)",
                                color: "#fff",
                                fontSize: 11,
                                fontWeight: 700,
                                "& .MuiChip-icon": {
                                    color: "#fff",
                                },
                            }}
                        />
                    )}
                </Box>
            </Box>

            <Box sx={{ px: 1.5, pt: 1.2, pb: 0.5 }}>
                {infoRows.map((row, i) => (
                    <InfoRow key={i} icon={row.icon} label={row.label} value={row.value} />
                ))}
            </Box>

            <Divider sx={{ mx: 1.5 }} />

            <Box sx={{ px: 1, py: 0.8 }}>
                {menuItems.map((item, i) => (
                    <MenuItem
                        key={i}
                        icon={item.icon}
                        label={item.label}
                        onClick={item.onClick}
                    />
                ))}
            </Box>

            <Divider sx={{ mx: 1.5 }} />

            <Box sx={{ p: 1.8 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LogoutIcon sx={{ fontSize: 17 }} />}
                    onClick={onLogout}
                    sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        py: 1,
                        fontWeight: 700,
                        fontSize: 13.5,
                        color: "#111827",
                        borderColor: "#e5e7eb",
                        backgroundColor: "#fff",
                        transition: "all 0.2s",
                        "&:hover": {
                            color: "#fff",
                            background: "linear-gradient(135deg, #1C6EA4, #378ADD)",
                            borderColor: BLUE[600],
                        },
                    }}
                >
                    Log Out
                </Button>
            </Box>
        </Box>
    );
}