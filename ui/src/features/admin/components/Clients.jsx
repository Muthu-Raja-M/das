import React from "react";
import {
    Box,
    Avatar,
    Button,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const DocChip = ({ submitted }) =>
    submitted ? (
        <Chip
            label="Submitted"
            size="small"
            sx={{
                bgcolor: "#e3f2fd",
                color: "#1565c0",
                fontWeight: 700,
                border: "1px solid #90caf9",
            }}
        />
    ) : (
        <Chip
            label="Not Submitted"
            size="small"
            sx={{
                bgcolor: "#f5f5f5",
                color: "#757575",
                fontWeight: 700,
                border: "1px solid #e0e0e0",
            }}
        />
    );

export default function Clients({
    type,
    data = [],
    customerMutation,
    employerMutation,
    setSelectedEmployerId,
    setOpenPreview,
    thCell = {},
    tdCell = {},
}) {
    if (type === "customer") {
        return (
            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Email</b></TableCell>
                            <TableCell><b>Phone</b></TableCell>
                            <TableCell><b>Action</b></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.fullname}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.phone}</TableCell>
                                    <TableCell>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="error"
                                            disabled={customerMutation?.isPending}
                                            startIcon={<CancelIcon />}
                                            onClick={() => {
                                                const ok = window.confirm(
                                                    `Delete customer ${item.fullname}?`
                                                );
                                                if (ok) customerMutation.mutate(item.id);
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No customers found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    if (type === "employer") {
        return (
            <TableContainer component={Paper} elevation={0} sx={{ bgcolor: "transparent" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {[
                                "#",
                                "Name",
                                "Email",
                                "Phone",
                                "Job Role",
                                "Location",
                                "Document",
                                "ID",
                                "Actions",
                            ].map((h) => (
                                <TableCell key={h} sx={thCell}>
                                    {h}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.length > 0 ? (
                            data.map((item, i) => (
                                <TableRow
                                    key={item.id}
                                    sx={{
                                        "&:hover": { bgcolor: "#f5f8ff" },
                                        transition: "background 0.15s",
                                    }}
                                >
                                    <TableCell sx={tdCell}>{i + 1}</TableCell>

                                    <TableCell sx={tdCell}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                    bgcolor: "#ede7f6",
                                                    color: "#6a1b9a",
                                                    fontSize: 13,
                                                    fontWeight: 800,
                                                }}
                                            >
                                                {(item.username || "?")[0].toUpperCase()}
                                            </Avatar>

                                            <Button
                                                variant="text"
                                                onClick={() => {
                                                    setSelectedEmployerId(item.id);
                                                    setOpenPreview(true);
                                                }}
                                                sx={{
                                                    p: 0,
                                                    minWidth: "auto",
                                                    fontWeight: 700,
                                                    fontSize: 13.5,
                                                    textTransform: "none",
                                                    color: "#1565c0",
                                                    "&:hover": {
                                                        color: "#0d47a1",
                                                        bgcolor: "transparent",
                                                        textDecoration: "underline",
                                                    },
                                                }}
                                            >
                                                {item.username}
                                            </Button>
                                        </Box>
                                    </TableCell>

                                    <TableCell sx={{ ...tdCell, color: "#5a7a9a" }}>
                                        {item.email}
                                    </TableCell>

                                    <TableCell sx={{ ...tdCell, color: "#5a7a9a" }}>
                                        {item.phone}
                                    </TableCell>

                                    <TableCell sx={tdCell}>
                                        <Chip
                                            label={item.job_role || "—"}
                                            size="small"
                                            sx={{
                                                bgcolor: "#f0f4ff",
                                                color: "#3949ab",
                                                fontWeight: 700,
                                                fontSize: 12,
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell sx={{ ...tdCell, color: "#5a7a9a", fontSize: 13 }}>
                                        {item.district}, {item.state}
                                    </TableCell>

                                    <TableCell sx={tdCell}>
                                        <DocChip submitted={item.document_submitted} />
                                    </TableCell>

                                    <TableCell sx={tdCell}>
                                        {item.employer_id ? (
                                            <Chip
                                                label={item.employer_id}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 700,
                                                    borderColor: "#90caf9",
                                                    color: "#1565c0",
                                                    fontSize: 11,
                                                }}
                                            />
                                        ) : (
                                            <Typography color="#cdd5e0" fontSize={18} fontWeight={700}>
                                                —
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell sx={tdCell}>
                                        {item.is_verified ? (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                disableElevation
                                                startIcon={<CancelIcon sx={{ fontSize: 15 }} />}
                                                disabled={employerMutation?.isPending}
                                                onClick={() => {
                                                    const ok = window.confirm(
                                                        `Remove employer ${item.username}?`
                                                    );
                                                    if (ok) {
                                                        employerMutation.mutate({
                                                            id: item.id,
                                                            action: "delete",
                                                        });
                                                    }
                                                }}
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: 12,
                                                    borderRadius: 2,
                                                    textTransform: "none",
                                                }}
                                            >
                                                Remove Employer
                                            </Button>
                                        ) : (
                                            <Stack direction="row" spacing={0.8}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disableElevation
                                                    startIcon={<CheckCircleIcon sx={{ fontSize: 15 }} />}
                                                    disabled={
                                                        !item.document_submitted || employerMutation?.isPending
                                                    }
                                                    onClick={() =>
                                                        employerMutation.mutate({
                                                            id: item.id,
                                                            action: "approve",
                                                        })
                                                    }
                                                    sx={{
                                                        bgcolor: "#e8f5e9",
                                                        color: "#2e7d32",
                                                        fontWeight: 700,
                                                        fontSize: 12,
                                                        borderRadius: 2,
                                                        textTransform: "none",
                                                        "&:hover": {
                                                            bgcolor: "#2e7d32",
                                                            color: "#fff",
                                                        },
                                                    }}
                                                >
                                                    Approve
                                                </Button>

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    disableElevation
                                                    startIcon={<CancelIcon sx={{ fontSize: 15 }} />}
                                                    disabled={employerMutation?.isPending}
                                                    onClick={() =>
                                                        employerMutation.mutate({
                                                            id: item.id,
                                                            action: "reject",
                                                        })
                                                    }
                                                    sx={{
                                                        bgcolor: "#ffebee",
                                                        color: "#c62828",
                                                        fontWeight: 700,
                                                        fontSize: 12,
                                                        borderRadius: 2,
                                                        textTransform: "none",
                                                        "&:hover": {
                                                            bgcolor: "#c62828",
                                                            color: "#fff",
                                                        },
                                                    }}
                                                >
                                                    Reject
                                                </Button>
                                            </Stack>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 6, color: "#90aac8" }}>
                                    <BusinessCenterIcon
                                        sx={{
                                            fontSize: 38,
                                            opacity: 0.3,
                                            display: "block",
                                            mx: "auto",
                                            mb: 1,
                                        }}
                                    />
                                    <Typography fontWeight={600}>No employers found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return null;
}