import React from "react";
import { Box, Card, CardContent, Typography, Rating, Avatar, Chip, Stack } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";

const getRelativeTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 30) return `${diffDay}d ago`;
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};

export default function ReviewCard({ review }) {
    if (!review) return null;

    const reviewerName = review.reviewer_name || "User";
    const avatarLetter = reviewerName.charAt(0).toUpperCase();

    return (
        <Card
            sx={{
                mb: 2,
                borderRadius: 3,
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
                border: "1px solid #e2e8f0",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                },
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Avatar
                        src={review.reviewer_avatar || ""}
                        sx={{
                            width: 44,
                            height: 44,
                            bgcolor: "#1C6EA4",
                            fontWeight: 700,
                            fontSize: 18,
                        }}
                    >
                        {avatarLetter}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" fontWeight={700} color="#1e293b">
                                {reviewerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {getRelativeTime(review.created_at)}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <Rating value={review.overall_rating} readOnly size="small" precision={0.5} />
                            <Typography variant="body2" fontWeight={600} color="text.secondary">
                                {review.overall_rating.toFixed(1)}
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>

                {review.review_comment && (
                    <Typography variant="body2" color="text.primary" sx={{ mb: 2, pl: 0.5, fontStyle: "italic", lineHeight: 1.6 }}>
                        "{review.review_comment}"
                    </Typography>
                )}

                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {review.job_role && (
                        <Chip
                            label={review.job_role}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: 11, color: "#64748b", borderColor: "#cbd5e1" }}
                        />
                    )}
                    <Chip
                        icon={<VerifiedIcon sx={{ fontSize: "14px !important", color: "#1C6EA4" }} />}
                        label="Verified Job"
                        size="small"
                        sx={{
                            fontWeight: 700,
                            fontSize: 11,
                            backgroundColor: "#EBF4FC",
                            color: "#1C6EA4",
                            border: "1px solid #BFDAF2",
                        }}
                    />
                </Stack>
            </CardContent>
        </Card>
    );
}
