import React from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    TextField,
    Button,
    Divider,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
    return (
        <Box
            sx={{
                background: "linear-gradient(90deg, #0f3d91 0%, #0b4ed8 100%)",
                color: "#fff",
                pt: 8,
                pb: 3,
                mt: 10,
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={5}>
                    {/* COMPANY INFO */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                color: "#64B5F6",
                            }}
                        >
                            Blue Connect
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "#D1D5DB",
                                lineHeight: 1.8,
                                mb: 3,
                            }}
                        >
                            Connect with trusted skilled workers near you.
                            Blue Connect helps customers hire verified
                            professionals quickly and safely.
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            {[FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon].map(
                                (Icon, index) => (
                                    <IconButton
                                        key={index}
                                        sx={{
                                            backgroundColor: "rgba(255,255,255,0.08)",
                                            color: "#fff",
                                            transition: "0.3s",
                                            "&:hover": {
                                                backgroundColor: "#1976D2",
                                                transform: "translateY(-4px)",
                                            },
                                        }}
                                    >
                                        <Icon />
                                    </IconButton>
                                )
                            )}
                        </Box>
                    </Grid>

                    {/* QUICK LINKS */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, mb: 3 }}
                        >
                            Quick Links
                        </Typography>

                        {[
                            "Home",
                            "About Us",
                            "Services",
                            "Workers",
                            "Contact",
                        ].map((item) => (
                            <Typography
                                key={item}
                                sx={{
                                    mb: 1.5,
                                    cursor: "pointer",
                                    color: "#D1D5DB",
                                    transition: "0.3s",
                                    "&:hover": {
                                        color: "#64B5F6",
                                        pl: 1,
                                    },
                                }}
                            >
                                {item}
                            </Typography>
                        ))}
                    </Grid>

                    {/* SERVICES */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, mb: 3 }}
                        >
                            Our Services
                        </Typography>

                        {[
                            "Electrician",
                            "Plumber",
                            "Driver",
                            "Carpenter",
                            "House Cleaning",
                            "Painter",
                        ].map((service) => (
                            <Typography
                                key={service}
                                sx={{
                                    mb: 1.5,
                                    color: "#D1D5DB",
                                    transition: "0.3s",
                                    "&:hover": {
                                        color: "#64B5F6",
                                        pl: 1,
                                    },
                                }}
                            >
                                {service}
                            </Typography>
                        ))}
                    </Grid>

                    {/* CONTACT + NEWSLETTER */}
                    <Grid item xs={12} md={3}>
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 700, mb: 3 }}
                        >
                            Contact Us
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                            <LocationOnIcon sx={{ color: "#64B5F6" }} />
                            <Typography sx={{ color: "#D1D5DB" }}>
                                Chennai, Tamil Nadu, India
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                            <PhoneIcon sx={{ color: "#64B5F6" }} />
                            <Typography sx={{ color: "#D1D5DB" }}>
                                +91 98765 43210
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                            <EmailIcon sx={{ color: "#64B5F6" }} />
                            <Typography sx={{ color: "#D1D5DB" }}>
                                support@blueconnect.com
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{ color: "#D1D5DB", mb: 2 }}
                        >
                            Subscribe for updates
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                size="small"
                                placeholder="Your Email"
                                variant="outlined"
                                sx={{
                                    flex: 1,
                                    backgroundColor: "#fff",
                                    borderRadius: 2,
                                }}
                            />

                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#1976D2",
                                    px: 3,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    "&:hover": {
                                        backgroundColor: "#1565C0",
                                    },
                                }}
                            >
                                Send
                            </Button>
                        </Box>
                    </Grid>
                </Grid>

                <Divider
                    sx={{
                        my: 4,
                        borderColor: "rgba(255,255,255,0.1)",
                    }}
                />

                {/* BOTTOM */}
                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "#9CA3AF",
                            letterSpacing: 0.5,
                        }}
                    >
                        © 2026 Blue Connect. All Rights Reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}