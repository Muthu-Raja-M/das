// components/Drawer.jsx

import React from "react";
import { styled } from "@mui/material/styles";
import {
    Box,
    Toolbar,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Badge,
} from "@mui/material";

import MuiDrawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../../assets/logo.png";

export default function Drawer({
    open,
    setOpen,
    activeMenu,
    setActiveMenu,
    navItems,
    onLogout,
    drawerWidth = 200,
    collapsedWidth = 72,
    headerHeight = 88,
}) {
    const DrawerStyled = styled(MuiDrawer, {
        shouldForwardProp: (prop) => prop !== "open",
    })(({ open }) => ({
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            transition: "all 0.3s ease",
            backgroundColor: open ? "#ffffff" : "#1C6EA4",
            color: open ? "#111827" : "#ffffff",
            overflowX: "hidden",
            borderRight: "none",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
        },
    }));

    return (
        <>
            <DrawerStyled variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        minHeight: `${headerHeight}px !important`,
                        position: "relative",
                        justifyContent: "center",
                    }}
                >
                    {open ? (
                        <>
                            <Box
                                sx={{
                                    position: "absolute",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img src={logo} alt="logo" height={50} />
                            </Box>

                            <IconButton
                                onClick={() => setOpen(false)}
                                sx={{
                                    position: "absolute",
                                    right: 6,
                                    top: 24,
                                    color: "#111827",
                                    borderRadius: "50%",
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        backgroundColor: "#e5e7eb",
                                        transform: "scale(1.08)",
                                    },
                                }}
                            >
                                <ChevronLeftIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <img src={logo} alt="logo" height={30} />
                        </Box>
                    )}
                </Toolbar>

                <Divider />

                <List sx={{ px: open ? 1 : 1, py: 1.5, flex: 1 }}>
                    {navItems.map((item) => {
                        const isActive = activeMenu === item.text;

                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => setActiveMenu(item.text)}
                                    sx={{
                                        justifyContent: open ? "initial" : "center",
                                        minHeight: 50,
                                        px: open ? 1.5 : 1,
                                        borderRadius: 2,
                                        mx: 0.5,
                                        backgroundColor: isActive
                                            ? open
                                                ? "#EBF4FC"
                                                : "rgba(255,255,255,0.14)"
                                            : "transparent",
                                        color: isActive
                                            ? open
                                                ? "#1C6EA4"
                                                : "#ffffff"
                                            : "inherit",
                                        "&:hover": {
                                            backgroundColor: open
                                                ? "#F4F8FC"
                                                : "rgba(255,255,255,0.10)",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: open ? 0 : 40,
                                            mr: open ? 2 : 0,
                                            justifyContent: "center",
                                            color: "inherit",
                                        }}
                                    >
                                        <Badge badgeContent={item.badge || 0} color="error">
                                            {item.icon}
                                        </Badge>
                                    </ListItemIcon>

                                    {open && (
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontSize: 14,
                                                fontWeight: isActive ? 700 : 500,
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>

                <Divider />

                <List sx={{ px: open ? 1 : 1, pb: 1 }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={onLogout}
                            sx={{
                                justifyContent: open ? "initial" : "center",
                                minHeight: 50,
                                px: open ? 1.5 : 1,
                                borderRadius: 2,
                                mx: 0.5,
                                color: "inherit",
                                "&:hover": {
                                    backgroundColor: open
                                        ? "rgba(239,68,68,0.08)"
                                        : "rgba(255,255,255,0.10)",
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: open ? 0 : 40,
                                    mr: open ? 2 : 0,
                                    justifyContent: "center",
                                    color: "inherit",
                                }}
                            >
                                <LogoutIcon />
                            </ListItemIcon>

                            {open && (
                                <ListItemText
                                    primary="Logout"
                                    primaryTypographyProps={{
                                        fontSize: 14,
                                        fontWeight: 600,
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                </List>
            </DrawerStyled>

            {!open && (
                <IconButton
                    onClick={() => setOpen(true)}
                    sx={{
                        position: "fixed",
                        top: headerHeight / 2 - 18,
                        left: collapsedWidth - 10,
                        zIndex: 1300,

                        color: "#111827",
                        width: 36,
                        height: 36,
                        borderRadius: "50%",

                        transition: "all 0.3s ease",
                        "&:hover": {

                            transform: "scale(1.1)",
                        },
                    }}
                >
                    <ChevronLeftIcon sx={{ transform: "rotate(180deg)" }} />
                </IconButton>
            )}
        </>
    );
}