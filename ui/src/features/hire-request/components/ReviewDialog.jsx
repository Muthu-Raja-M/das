import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Rating,
    Button,
    TextField,
    CircularProgress,
    Stack,
    IconButton,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import API from "../../../api/axios";

export default function ReviewDialog({ open, onClose, hireRequestId, role, otherPartyName, onSubmitSuccess }) {
    const [overallRating, setOverallRating] = useState(5);
    const [comment, setComment] = useState("");
    const [subRatings, setSubRatings] = useState({
        workQuality: 5,
        communication: 5,
        professionalism: 5,
        behaviour: 5,
        paymentExperience: 5,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubRatingChange = (key, value) => {
        setSubRatings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!hireRequestId) return;
        setLoading(true);
        setError("");

        try {
            const endpoint = role === "customer" ? "/reviews/employer/" : "/reviews/customer/";
            const payload = {
                hire_request_id: hireRequestId,
                overall_rating: overallRating,
                review_comment: comment.trim(),
            };

            if (role === "customer") {
                payload.work_quality = subRatings.workQuality;
                payload.communication = subRatings.communication;
                payload.professionalism = subRatings.professionalism;
                payload.behaviour = subRatings.behaviour;
            } else {
                payload.communication = subRatings.communication;
                payload.behaviour = subRatings.behaviour;
                payload.payment_experience = subRatings.paymentExperience;
            }

            await API.post(endpoint, payload);
            onSubmitSuccess?.();
            onClose();
        } catch (err) {
            console.error("Error submitting review:", err);
            setError(err?.response?.data?.error || "Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const isCustomer = role === "customer";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: { borderRadius: 4, overflow: "hidden" }
            }}
        >
            <DialogTitle
                sx={{
                    m: 0,
                    p: 2.5,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#1C6EA4",
                    color: "#fff",
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    {isCustomer ? "Rate Your Experience" : "Rate Your Customer"}
                </Typography>
                <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }} disabled={loading}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, backgroundColor: "#f8fafc" }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                <Stack spacing={2.5}>
                    {/* Header Intro */}
                    <Box textAlign="center" sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            How was your experience with
                        </Typography>
                        <Typography variant="body1" fontWeight={700} color="#1e293b">
                            {otherPartyName}
                        </Typography>
                    </Box>

                    {/* Overall Stars */}
                    <Box display="flex" flexDirection="column" alignItems="center" sx={{ p: 2, borderRadius: 3, backgroundColor: "#fff", border: "1px solid #e2e8f0" }}>
                        <Typography variant="body2" fontWeight={700} color="text.secondary" sx={{ mb: 1 }}>
                            Overall Rating
                        </Typography>
                        <Rating
                            value={overallRating}
                            onChange={(event, newValue) => setOverallRating(newValue || 5)}
                            size="large"
                            emptyIcon={<StarBorderIcon fontSize="inherit" />}
                        />
                    </Box>

                    {/* Sub Ratings */}
                    <Stack spacing={2} sx={{ p: 2, borderRadius: 3, backgroundColor: "#fff", border: "1px solid #e2e8f0" }}>
                        <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ pb: 0.5, borderBottom: "1px solid #f1f5f9" }}>
                            Detailed Rating
                        </Typography>

                        {isCustomer ? (
                            <>
                                <RatingRow
                                    label="Work Quality"
                                    value={subRatings.workQuality}
                                    onChange={(val) => handleSubRatingChange("workQuality", val)}
                                />
                                <RatingRow
                                    label="Communication"
                                    value={subRatings.communication}
                                    onChange={(val) => handleSubRatingChange("communication", val)}
                                />
                                <RatingRow
                                    label="Professionalism"
                                    value={subRatings.professionalism}
                                    onChange={(val) => handleSubRatingChange("professionalism", val)}
                                />
                                <RatingRow
                                    label="Behaviour"
                                    value={subRatings.behaviour}
                                    onChange={(val) => handleSubRatingChange("behaviour", val)}
                                />
                            </>
                        ) : (
                            <>
                                <RatingRow
                                    label="Communication"
                                    value={subRatings.communication}
                                    onChange={(val) => handleSubRatingChange("communication", val)}
                                />
                                <RatingRow
                                    label="Behaviour"
                                    value={subRatings.behaviour}
                                    onChange={(val) => handleSubRatingChange("behaviour", val)}
                                />
                                <RatingRow
                                    label="Payment Experience"
                                    value={subRatings.paymentExperience}
                                    onChange={(val) => handleSubRatingChange("paymentExperience", val)}
                                />
                            </>
                        )}
                    </Stack>

                    {/* Review Comments */}
                    <TextField
                        multiline
                        rows={3}
                        placeholder="Write your review comments here (optional)..."
                        label="Review Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={loading}
                        sx={{ backgroundColor: "#fff" }}
                    />

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={onClose}
                            disabled={loading}
                            sx={{ textTransform: "none", fontWeight: 700 }}
                        >
                            Skip
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{ textTransform: "none", fontWeight: 700, backgroundColor: "#1C6EA4" }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : "Submit Review"}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}

function RatingRow({ label, value, onChange }) {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="#64748b" fontWeight={600}>
                {label}
            </Typography>
            <Rating
                value={value}
                size="small"
                onChange={(event, newValue) => onChange(newValue || 5)}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
        </Stack>
    );
}
