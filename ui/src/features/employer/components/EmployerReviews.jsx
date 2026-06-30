import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Rating, Grid, LinearProgress, Stack, CircularProgress, Alert, Divider } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import ReviewCard from "../../hire-request/components/ReviewCard";
import API from "../../../api/axios";

export default function EmployerReviews({ employerId }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchSummary = async () => {
        if (!employerId) return;
        setLoading(true);
        setError("");
        try {
            const data = await API.get(`/reviews/employer/${employerId}/`);
            setSummary(data);
        } catch (err) {
            console.error("Error loading reviews summary:", err);
            setError("Failed to load review summary metrics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [employerId]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!summary) return null;

    const distribution = summary.distribution || {};
    const totalReviews = summary.total_reviews || 0;
    const completedJobs = summary.completed_jobs || 0;
    const satisfactionRate = summary.satisfaction_rate || 100;
    const averageRating = summary.average_rating || 0.0;

    return (
        <Box>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Score Summary */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
                            <Typography variant="h2" fontWeight={800} color="#1C6EA4" sx={{ mb: 1 }}>
                                {averageRating.toFixed(1)}
                            </Typography>
                            <Rating value={averageRating} readOnly precision={0.1} size="large" sx={{ mb: 1.5 }} />
                            <Typography variant="body1" fontWeight={700} color="text.secondary">
                                {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                out of {completedJobs} jobs completed
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Rating Distribution Progress Bars */}
                <Grid item xs={12} md={5}>
                    <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 2 }}>
                                Rating Distribution
                            </Typography>
                            <Stack spacing={1.2}>
                                {[5, 4, 3, 2, 1].map((stars) => {
                                    const count = distribution[stars] || 0;
                                    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                                    return (
                                        <Stack key={stars} direction="row" alignItems="center" spacing={2}>
                                            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 20 }}>
                                                {stars}★
                                            </Typography>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percent}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: "#e2e8f0",
                                                        "& .MuiLinearProgress-bar": {
                                                            backgroundColor: "#1C6EA4",
                                                            borderRadius: 4,
                                                        },
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ minWidth: 25, textAlign: "right" }}>
                                                {count}
                                            </Typography>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Performance Analytics metrics */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ height: "100%", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                        <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Customer Satisfaction
                                </Typography>
                                <Typography variant="h5" fontWeight={800} color="#22C55E">
                                    {satisfactionRate}%
                                </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Jobs Completed
                                </Typography>
                                <Typography variant="h5" fontWeight={800} color="#1C6EA4">
                                    {completedJobs}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Review Response Rate
                                </Typography>
                                <Typography variant="h5" fontWeight={800} color="text.secondary">
                                    {completedJobs > 0 ? Math.round((totalReviews / completedJobs) * 100) : 0}%
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* List of reviews */}
            <Typography variant="h6" fontWeight={700} color="#1e293b" sx={{ mb: 2 }}>
                Recent Feedback
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {summary.reviews && summary.reviews.length > 0 ? (
                summary.reviews.map((rev) => <ReviewCard key={rev.id} review={rev} />)
            ) : (
                <Box sx={{ p: 4, textAlign: "center", bgcolor: "#fff", borderRadius: 3, border: "1px dashed #cbd5e1" }}>
                    <Typography color="text.secondary">No text reviews submitted yet.</Typography>
                </Box>
            )}
        </Box>
    );
}
