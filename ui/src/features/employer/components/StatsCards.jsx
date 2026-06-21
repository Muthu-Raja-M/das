import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

function StatsCards({ stats = [] }) {
    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {stats.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item.title}>
                    <Card
                        sx={{
                            borderRadius: 3,
                            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                        }}
                    >
                        <CardContent
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                py: 2,
                            }}
                        >
                            {/* Text */}
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: 12 }}
                                >
                                    {item.title}
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ mt: 0.5 }}
                                >
                                    {item.value}
                                </Typography>
                            </Box>

                            {/* Icon */}
                            <Box
                                sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: item.bg,
                                    color: item.color,
                                }}
                            >
                                {item.icon}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default StatsCards;