import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    TextField,
    IconButton,
    Avatar,
    CircularProgress,
    Chip,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import {
    useConversation,
    useEmployerThreads,
    useCustomerThreads,
    useSendMessage,
} from "../hooks/useMessages";

export default function MessagesSection({ selectedThreadFromJob = null }) {
    const userEmail = localStorage.getItem("email") || "";
    const role = (localStorage.getItem("role") || "").toLowerCase();

    const [selectedThread, setSelectedThread] = useState(null);
    const [messageText, setMessageText] = useState("");
    const bottomRef = useRef(null);

    const isEmployer = role === "employer";
    const isCustomer = role === "customer";

    useEffect(() => {
        if (selectedThreadFromJob) {
            setSelectedThread(selectedThreadFromJob);
        }
    }, [selectedThreadFromJob]);

    const {
        data: employerThreads = [],
        isLoading: employerThreadsLoading,
    } = useEmployerThreads(userEmail, {
        enabled: !!userEmail && isEmployer,
    });

    const {
        data: customerThreads = [],
        isLoading: customerThreadsLoading,
    } = useCustomerThreads(userEmail, {
        enabled: !!userEmail && isCustomer,
    });

    const threads = useMemo(() => {
        return isEmployer ? employerThreads : customerThreads;
    }, [isEmployer, employerThreads, customerThreads]);

    const threadsLoading = isEmployer
        ? employerThreadsLoading
        : customerThreadsLoading;

    const hireRequestId = selectedThread?.hire_request_id;

    const { data: messages = [], isLoading: messagesLoading } =
        useConversation(hireRequestId, {
            enabled: !!hireRequestId,
        });

    const sendMessageMutation = useSendMessage(hireRequestId, userEmail);

    const getOtherPersonEmail = (thread) => {
        if (!thread) return "";
        return isEmployer ? thread.customer_email : thread.employer_email;
    };

    const getOtherPersonName = (thread) => {
        if (!thread) return "";
        return (
            thread.other_user_name ||
            thread.name ||
            getOtherPersonEmail(thread) ||
            "User"
        );
    };

    const getJobRole = (thread) => {
        return thread?.job_role || "Worker";
    };

    const handleSend = () => {
        if (!selectedThread || !messageText.trim()) return;

        sendMessageMutation.mutate(
            {
                sender_email: userEmail,
                receiver_email: getOtherPersonEmail(selectedThread),
                hire_request_id: selectedThread.hire_request_id,
                message: messageText.trim(),
            },
            {
                onSuccess: () => {
                    setMessageText("");
                },
            }
        );
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!selectedThread && threads.length > 0) {
            setSelectedThread(threads[0]);
        }
    }, [threads, selectedThread]);

    return (
        <Grid container spacing={2}>
            {/* LEFT - THREAD LIST */}
            <Grid item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                            Messages
                        </Typography>

                        {threadsLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List>
                                {threads.map((thread) => {
                                    const otherEmail = getOtherPersonEmail(thread);
                                    const otherName = getOtherPersonName(thread);

                                    return (
                                        <ListItemButton
                                            key={thread.hire_request_id}
                                            selected={
                                                selectedThread?.hire_request_id ===
                                                thread.hire_request_id
                                            }
                                            onClick={() => setSelectedThread(thread)}
                                            sx={{
                                                borderRadius: 2,
                                                mb: 1,
                                                transition: "0.2s",
                                                "&.Mui-selected": {
                                                    backgroundColor: "#e0f2fe",
                                                },
                                            }}
                                        >
                                            <Avatar sx={{ mr: 1.5, bgcolor: "#1976D2" }}>
                                                {(otherName?.[0] || otherEmail?.[0] || "U").toUpperCase()}
                                            </Avatar>

                                            <ListItemText
                                                primary={otherName}
                                                secondary={getJobRole(thread)}
                                            />

                                            <FiberManualRecordIcon
                                                sx={{ color: "#22c55e", fontSize: 12 }}
                                            />
                                        </ListItemButton>
                                    );
                                })}

                                {threads.length === 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        No conversations available
                                    </Typography>
                                )}
                            </List>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* RIGHT - CHAT */}
            <Grid item xs={12} md={8}>
                <Card sx={{ borderRadius: 3, height: "100%" }}>
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "75vh",
                        }}
                    >
                        {selectedThread ? (
                            <>
                                {/* HEADER */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        mb: 2,
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: "#1976D2" }}>
                                        {(
                                            getOtherPersonName(selectedThread)?.[0] ||
                                            getOtherPersonEmail(selectedThread)?.[0] ||
                                            "U"
                                        ).toUpperCase()}
                                    </Avatar>

                                    <Box>
                                        <Typography fontWeight={700}>
                                            {getOtherPersonName(selectedThread)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {getOtherPersonEmail(selectedThread)}
                                        </Typography>
                                        <Chip
                                            label={getJobRole(selectedThread)}
                                            size="small"
                                            sx={{ mt: 0.5 }}
                                        />
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {/* CHAT AREA */}
                                <Box
                                    sx={{
                                        flex: 1,
                                        overflowY: "auto",
                                        mb: 2,
                                        px: 1,
                                    }}
                                >
                                    {messagesLoading ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                py: 4,
                                            }}
                                        >
                                            <CircularProgress />
                                        </Box>
                                    ) : messages.length > 0 ? (
                                        messages.map((msg) => {
                                            const isMine = msg.sender_email === userEmail;

                                            return (
                                                <Box
                                                    key={msg.id}
                                                    sx={{
                                                        display: "flex",
                                                        justifyContent: isMine
                                                            ? "flex-end"
                                                            : "flex-start",
                                                        mb: 1.5,
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            px: 2,
                                                            py: 1.2,
                                                            borderRadius: 3,
                                                            maxWidth: "70%",
                                                            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                                            backgroundColor: isMine
                                                                ? "#1976D2"
                                                                : "#f1f5f9",
                                                            color: isMine ? "#fff" : "#111827",
                                                        }}
                                                    >
                                                        <Typography variant="body2">
                                                            {msg.message}
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                display: "block",
                                                                mt: 0.5,
                                                                opacity: 0.7,
                                                                textAlign: "right",
                                                            }}
                                                        >
                                                            {new Date(msg.created_at).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            );
                                        })
                                    ) : (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                py: 4,
                                            }}
                                        >
                                            <Typography color="text.secondary">
                                                No messages yet
                                            </Typography>
                                        </Box>
                                    )}

                                    <div ref={bottomRef} />
                                </Box>

                                {/* INPUT */}
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Type a message..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                        sx={{ borderRadius: 2 }}
                                    />

                                    <IconButton
                                        onClick={handleSend}
                                        disabled={
                                            sendMessageMutation.isPending || !messageText.trim()
                                        }
                                        sx={{
                                            backgroundColor: "#1976D2",
                                            color: "#fff",
                                            "&:hover": {
                                                backgroundColor: "#1565c0",
                                            },
                                            "&.Mui-disabled": {
                                                backgroundColor: "#90caf9",
                                                color: "#fff",
                                            },
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </Box>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography color="text.secondary">
                                    Select a conversation
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}