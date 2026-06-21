import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Button,
    Grid,
    CircularProgress,
    Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BuildIcon from "@mui/icons-material/Build";
import WorkIcon from "@mui/icons-material/Work";

import { useEmployerDetail } from "../../employer/hooks/useEmployer";

const WorkerProfilePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data, isLoading, isError, error } = useEmployerDetail(id);

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8fbff",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box sx={{ p: 4, backgroundColor: "#f8fbff", minHeight: "100vh" }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2, textTransform: "none" }}
                >
                    Back
                </Button>

                <Card sx={{ borderRadius: 4, p: 3 }}>
                    <Typography variant="h6" color="error" fontWeight={700}>
                        Failed to load worker profile
                    </Typography>
                    <Typography sx={{ mt: 1 }}>
                        {error?.response?.data?.error || error?.message}
                    </Typography>
                </Card>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#f8fbff", minHeight: "100vh" }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3, textTransform: "none" }}
            >
                Back
            </Button>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, height: "100%" }}>
                        <CardContent sx={{ p: 4, textAlign: "center" }}>
                            <Avatar
                                src={
                                    data?.profile_image
                                        ? `http://127.0.0.1:8000${data.profile_image}`
                                        : ""
                                }
                                sx={{
                                    width: 90,
                                    height: 90,
                                    mx: "auto",
                                    mb: 2,
                                    bgcolor: "#1C6EA4",
                                    fontSize: 34,
                                    fontWeight: 700,
                                }}
                            >
                                {!data?.profile_image && data?.username?.charAt(0)?.toUpperCase()}
                            </Avatar>

                            <Typography variant="h5" fontWeight={700}>
                                {data?.username}
                            </Typography>

                            <Typography color="primary" fontWeight={600} sx={{ mt: 1 }}>
                                {data?.job_role}
                            </Typography>

                            <Chip
                                label={data?.role || "employer"}
                                sx={{ mt: 2, backgroundColor: "#eef6ff", color: "#1C6EA4" }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                Worker Details
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                                        <EmailIcon sx={{ color: "#1C6EA4" }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Email
                                            </Typography>
                                            <Typography fontWeight={600}>{data?.email}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                                        <PhoneIcon sx={{ color: "#1C6EA4" }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Phone
                                            </Typography>
                                            <Typography fontWeight={600}>{data?.phone}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                                        <LocationOnIcon sx={{ color: "#1C6EA4" }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Location
                                            </Typography>
                                            <Typography fontWeight={600}>
                                                {data?.district}, {data?.state}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                                        <BuildIcon sx={{ color: "#1C6EA4" }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Experience
                                            </Typography>
                                            <Typography fontWeight={600}>{data?.experience}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                                        <CurrencyRupeeIcon sx={{ color: "#1C6EA4" }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Daily Rate
                                            </Typography>
                                            <Typography fontWeight={600}>₹{data?.daily_rate}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                                        <WorkIcon sx={{ color: "#1C6EA4" }} />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Job Role
                                            </Typography>
                                            <Typography fontWeight={600}>{data?.job_role}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Address
                                    </Typography>
                                    <Typography fontWeight={600}>{data?.address}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default WorkerProfilePage;