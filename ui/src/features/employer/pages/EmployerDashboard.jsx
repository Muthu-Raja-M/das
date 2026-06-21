import React, { useMemo, useState, useEffect } from "react";
import {
    Box,
    Typography,
    CssBaseline,
    Toolbar,
    Snackbar,
    Alert,
    Avatar,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MuiAppBar from "@mui/material/AppBar";
import Employeralerts from "../components/EmployerAlerts";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import EmailIcon from "@mui/icons-material/Email";
import NotificationsIcon from "@mui/icons-material/Notifications";

import Drawer from "../../../shared/components/Drawer";
import EmployerStatsCards from "../components/EmployerStatsCards";
import MyJobsSection from "../components/MyJobsSection";
import MessagesSection from "../../chat/components/MessagesSection";
import EmployerProfile from "../components/EmployerProfile";
import EmployeeNotificationPanel from "../../notifications/components/EmployeeNotificationPanel";
import NotificationBellDropdown from "../../notifications/components/NotificationBellDropdown";
import { getEmployeeNotifications } from "../../notifications/services/notificationService";

import { useEmployerProfile } from "../hooks/useEmployer";
import { useHireRequests } from "../../hire-request/hooks/useHireRequest";

const drawerWidth = 200;
const collapsedWidth = 72;
const headerHeight = 88;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ open }) => ({
    zIndex: 1201,
    backgroundColor: "#ffffff",
    color: "#111827",
    height: headerHeight,
    marginLeft: open ? drawerWidth : collapsedWidth,
    width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
    transition: "all 0.3s ease",
    justifyContent: "center",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
}));

function EmployerDashboard() {
    const navigate = useNavigate();

    const email = localStorage.getItem("email") || "";
    const { data: profileData } = useEmployerProfile(email);

    // ✅ Get raw backend status
    const backendStatus = profileData?.verification_status || "not_submitted";

    // ✅ Sync backend status to localStorage
    localStorage.setItem("verification_status", backendStatus);

    // ✅ Derived status flags
    const isPending = backendStatus === "pending";
    const isApproved = backendStatus === "approved";
    const isRejected = backendStatus === "rejected";

    // ✅ Controls approved banner + button visibility
    const [showApprovedBanner, setShowApprovedBanner] = useState(false);
    const [showApprovedButton, setShowApprovedButton] = useState(false);

    // ✅ When isApproved becomes true, show banner for 5 seconds then hide both
    const approvalSeenKey = `approval_seen_${email}`;

    useEffect(() => {
        if (!email) return;

        const alreadySeen = localStorage.getItem(approvalSeenKey);

        if (isApproved && !alreadySeen) {
            setShowApprovedBanner(true);
            setShowApprovedButton(true);
            localStorage.setItem(approvalSeenKey, "true");

            const bannerTimer = setTimeout(() => {
                setShowApprovedBanner(false);
            }, 5000);

            const buttonTimer = setTimeout(() => {
                setShowApprovedButton(false);
            }, 6000);

            return () => {
                clearTimeout(bannerTimer);
                clearTimeout(buttonTimer);
            };
        }

        if (isApproved && alreadySeen) {
            setShowApprovedBanner(false);
            setShowApprovedButton(false);
        }
    }, [isApproved, email]);

    // ✅ Button label logic
    const verifyButtonLabel = showApprovedButton
        ? "Approved"
        : isPending
            ? "Submitted"
            : isRejected
                ? "Re-Verify"
                : "Verify";

    // ✅ Disabled when approved (while visible) or pending
    const isVerifyButtonDisabled = (isApproved && showApprovedButton) || isPending;

    // ✅ Button color — red for rejected, blue otherwise
    const verifyButtonColor = isRejected ? "#dc2626" : "#1C6EA4";
    const verifyButtonHover = isRejected ? "#b91c1c" : "#155a87";

    const [profileOpen, setProfileOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("Dashboard");
    const [open, setOpen] = useState(true);
    const [selectedMessageThread, setSelectedMessageThread] = useState(null);

    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const fetchNotificationsList = async () => {
        try {
            const data = await getEmployeeNotifications();
            setNotifications(Array.isArray(data) ? data : []);
            setUnreadNotificationsCount(Array.isArray(data) ? data.filter(n => !n.is_read).length : 0);
        } catch (err) {
            console.error("Error loading notifications count:", err);
        }
    };

    useEffect(() => {
        fetchNotificationsList();
        // Polling interval: 45 seconds to reduce server load
        const interval = setInterval(fetchNotificationsList, 45000);
        return () => clearInterval(interval);
    }, []);

    const [snackOpen, setSnackOpen] = useState(false);
    const [snackSeverity, setSnackSeverity] = useState("success");
    const [snackMsg, setSnackMsg] = useState("");

    const {
        hireRequests = [],
        filteredRequests = [],
        updatingRequestId,
        onUpdateStatus: updateRequestStatus,
    } = useHireRequests(email);

    const showSnack = (msg, severity = "success") => {
        setSnackMsg(msg);
        setSnackSeverity(severity);
        setSnackOpen(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    const employerProfile = useMemo(() => {
        const data = profileData || {};
        return {
            name: data?.name || localStorage.getItem("user") || "Employer",
            email: data?.email || localStorage.getItem("email") || "",
            phone: data?.phone || localStorage.getItem("phone") || "",
        };
    }, [profileData]);

    const totalJobsCount = hireRequests.length;

    const completedJobsCount = hireRequests.filter(
        (item) => String(item.status || "").toLowerCase() === "completed"
    ).length;

    const pendingRequestsCount = hireRequests.filter(
        (item) => String(item.status || "").toLowerCase() === "pending"
    ).length;

    const acceptedRequestsCount = hireRequests.filter(
        (item) => String(item.status || "").toLowerCase() === "accepted"
    ).length;

    const navItems = [
        { text: "Dashboard", icon: <DashboardIcon /> },
        { text: "My Jobs", icon: <WorkIcon />, badge: pendingRequestsCount },
        { text: "Messages", icon: <EmailIcon /> },
        { text: "Notifications", icon: <NotificationsIcon />, badge: unreadNotificationsCount },
    ];

    const handleNotificationClick = () => {
        setActiveMenu("My Jobs");
        showSnack(
            pendingRequestsCount > 0
                ? `You have ${pendingRequestsCount} pending request(s)`
                : "No new pending requests",
            "info"
        );
    };

    const handleOpenMessageFromJob = (job) => {
        setSelectedMessageThread({
            hire_request_id: job.id,
            customer_email: job.customer_email,
            employer_email: employerProfile.email,
        });
        setActiveMenu("Messages");
    };

    const handleRequestStatusUpdate = async (id, status) => {
        const result = await updateRequestStatus(id, status);
        showSnack(
            result?.message || "Status update failed",
            result?.success ? "success" : "error"
        );
    };

    const handleVerifyNavigate = () => {
        navigate("/employer-verify");
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", background: "#FFFFFF" }}>
            <CssBaseline />

            <AppBar position="fixed" open={open}>
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography fontWeight={700}>Employer Dashboard</Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                        {/* ✅ Hide button completely once approved timer expires */}
                        {!isApproved || showApprovedButton ? (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleVerifyNavigate}
                                disabled={isVerifyButtonDisabled}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 2,
                                    backgroundColor: verifyButtonColor,
                                    px: 2,
                                    fontWeight: 600,
                                    "&:hover": { backgroundColor: verifyButtonHover },
                                    "&.Mui-disabled": {
                                        backgroundColor: "#e2e8f0",
                                        color: "#94a3b8",
                                    },
                                }}
                            >
                                {verifyButtonLabel}
                            </Button>
                        ) : null}

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <NotificationBellDropdown
                                role="employer"
                                notifications={notifications}
                                unreadCount={unreadNotificationsCount}
                                onNotificationUpdate={fetchNotificationsList}
                                onViewAll={() => setActiveMenu("Notifications")}
                            />
                            <Employeralerts employer={employerProfile} />
                        </Box>

                        <Avatar
                            onClick={() => setProfileOpen((prev) => !prev)}
                            src={profileData?.profile_image || ""}
                            sx={{ cursor: "pointer" }}
                        >
                            {employerProfile.name?.[0]}
                        </Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                open={open}
                setOpen={setOpen}
                activeMenu={activeMenu}
                setActiveMenu={setActiveMenu}
                navItems={navItems}
                onLogout={handleLogout}
                drawerWidth={drawerWidth}
                collapsedWidth={collapsedWidth}
                headerHeight={headerHeight}
            />

            <EmployerProfile
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                onLogout={handleLogout}
                profileImage={profileData?.profile_image || ""}
                userName={employerProfile.name}
                email={employerProfile.email}
                employerId={profileData?.employer_id || null}
                isVerified={profileData?.is_verified || false}
            />

            <Box sx={{ flexGrow: 1, p: 3, mt: `${headerHeight}px` }}>

                {/* ✅ Pending banner */}
                {isPending && (
                    <Box sx={{
                        p: 2, mb: 2, borderRadius: 2,
                        backgroundColor: "#fff3cd",
                        color: "#856404",
                        fontWeight: 600,
                    }}>
                        ⏳ Documents Submitted – Waiting for Admin Approval
                    </Box>
                )}

                {/* ✅ Rejected banner */}
                {isRejected && (
                    <Box sx={{
                        p: 2, mb: 2, borderRadius: 2,
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        fontWeight: 600,
                    }}>
                        ❌ Your documents were <strong> rejected</strong> by the admin. Please click{" "}
                        <strong>Re-Verify</strong> to re-upload and resubmit your documents.
                    </Box>
                )}

                {/* ✅ Approved banner — auto hides after 5 seconds */}
                {showApprovedBanner && (
                    <Box sx={{
                        p: 2, mb: 2, borderRadius: 2,
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        fontWeight: 600,
                        transition: "opacity 0.5s ease",
                    }}>
                        ✅ Your documents have been <strong>approved</strong> by the admin.
                    </Box>
                )}

                {activeMenu === "Dashboard" && (
                    <EmployerStatsCards
                        totalJobs={totalJobsCount}
                        completedJobs={completedJobsCount}
                        pendingRequests={pendingRequestsCount}
                        acceptedRequests={acceptedRequestsCount}
                        recentRequests={filteredRequests}
                    />
                )}

                {activeMenu === "My Jobs" && (
                    <MyJobsSection
                        jobs={filteredRequests}
                        onOpenMessage={handleOpenMessageFromJob}
                        onUpdateStatus={handleRequestStatusUpdate}
                        updatingRequestId={updatingRequestId}
                    />
                )}

                {activeMenu === "Messages" && (
                    <MessagesSection selectedThreadFromJob={selectedMessageThread} />
                )}

                {activeMenu === "Notifications" && (
                    <EmployeeNotificationPanel onNotificationUpdate={fetchNotificationsList} />
                )}
            </Box>

            <Snackbar
                open={snackOpen}
                autoHideDuration={3000}
                onClose={() => setSnackOpen(false)}
            >
                <Alert
                    severity={snackSeverity}
                    onClose={() => setSnackOpen(false)}
                    sx={{ width: "100%" }}
                >
                    {snackMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EmployerDashboard;