

function employerCard() {
    return (
        <div>
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
                                label: workerDailyRate
                                    ? `₹${workerDailyRate}/day`
                                    : "Negotiable",
                                color: "#059669",
                            },
                            {
                                icon: <LocationOnIcon sx={{ fontSize: 13 }} />,
                                label:
                                    [workerDistrict, workerState].filter(Boolean).join(", ") ||
                                    "—",
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
                        placeholder={`Hi ${workerName.split(" ")[0]
                            }, I'd like to hire you…`}
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
        </div>
    )
}

export default employerCard