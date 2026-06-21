import React from "react";
import {
    Box,
    Avatar,
    Typography,
    Button,
    Divider,
    IconButton,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";

export default function CustomerProfileCard({
    open,
    onClose,
    onLogout,
    profileImage,
    userName,
    email,
    phone,
}) {
    if (!open) return null;

    return (
        <Box
            sx={{
                position: "absolute",
                top: 70,
                right: 0,
                width: 320,
                backgroundColor: "#fff",
                borderRadius: 3,
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                zIndex: 1400,
            }}
        >
            {/* HEADER (WHITE) */}
            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #e5e7eb",
                }}
            >
                <Typography sx={{ color: "#111827", fontWeight: 700, fontSize: 15 }}>
                    My Profile
                </Typography>

                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{
                        color: "#64748B",
                        transition: "0.25s",
                        "&:hover": {
                            color: "#1C6EA4", // 🔥 blue on hover
                            backgroundColor: "#EBF4FC",
                        },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* PROFILE */}
            <Box sx={{ p: 2.5, textAlign: "center" }}>
                <Avatar
                    src={profileImage || ""}
                    alt={userName || "Customer"}
                    sx={{
                        width: 82,
                        height: 82,
                        mx: "auto",
                        mb: 1.5,
                        bgcolor: "#E5E7EB", // neutral
                        color: "#111827",
                        fontSize: 28,
                        fontWeight: 700,
                        border: "3px solid #f1f5f9",
                    }}
                >
                    {!profileImage && (userName || "C").charAt(0).toUpperCase()}
                </Avatar>

                <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>
                    {userName || "Customer"}
                </Typography>

                <Typography sx={{ fontSize: 12.5, color: "#64748B", mt: 0.4 }}>
                    Blue Connect Customer
                </Typography>
            </Box>

            <Divider />

            {/* DETAILS */}
            <Box sx={{ px: 2, py: 1.5 }}>
                {[
                    { icon: <PersonIcon />, label: "Name", value: userName },
                    { icon: <EmailIcon />, label: "Email", value: email },
                    { icon: <PhoneIcon />, label: "Phone", value: phone },
                ].map((item, i) => (
                    <Box
                        key={i}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            mb: 1.5,
                            p: 1,
                            borderRadius: 2,
                            transition: "0.25s",
                            cursor: "pointer",

                            "&:hover": {
                                backgroundColor: "#EBF4FC", // 🔥 blue bg
                            },
                        }}
                    >
                        <Box
                            sx={{
                                color: "#64748B",
                                fontSize: 18,
                                transition: "0.25s",
                                "&:hover": {
                                    color: "#1C6EA4", // 🔥 blue icon
                                },
                            }}
                        >
                            {item.icon}
                        </Box>

                        <Box>
                            <Typography sx={{ fontSize: 11.5, color: "#94A3B8" }}>
                                {item.label}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: 13.5,
                                    fontWeight: 600,
                                    color: "#111827",
                                }}
                            >
                                {item.value || "-"}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Divider />

            {/* LOGOUT */}
            <Box sx={{ p: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={onLogout}
                    sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        py: 1.1,
                        fontWeight: 700,
                        color: "#111827",
                        borderColor: "#e5e7eb",
                        transition: "0.25s",

                        "&:hover": {
                            color: "#fff",
                            backgroundColor: "#1C6EA4", // 🔥 blue hover
                            borderColor: "#1C6EA4",
                        },
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );
}