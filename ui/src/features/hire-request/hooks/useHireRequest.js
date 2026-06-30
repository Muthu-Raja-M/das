import { useEffect, useMemo, useState } from "react";
import {
    fetchEmployerHireRequests,
    updateHireRequestStatus,
} from "../services/hireRequestService";

const capitalize = (value) => {
    const text = String(value || "");
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const useHireRequests = () => {
    const [hireRequests, setHireRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [requestsError, setRequestsError] = useState("");
    const [updatingRequestId, setUpdatingRequestId] = useState(null);

    const [reqStatusFilter, setReqStatusFilter] = useState("All");
    const [reqSearch, setReqSearch] = useState("");

    const loadRequests = async () => {
        try {
            setLoadingRequests(true);
            setRequestsError("");

            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");

            console.log("Employer dashboard email:", email);

            if (!email) {
                throw new Error("Employer email not found. Please login again.");
            }

            const data = await fetchEmployerHireRequests(email, token);
            console.log("Fetched hire requests:", data);

            setHireRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Load requests error:", error);
            setRequestsError(error?.message || "Failed to load hire requests");
            setHireRequests([]);
        } finally {
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        loadRequests();

        const interval = setInterval(() => {
            loadRequests();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleUpdateRequestStatus = async (requestId, statusValue) => {
        try {
            console.log("Updating request:", requestId, statusValue);
            setUpdatingRequestId(requestId);

            const token = localStorage.getItem("token");
            const data = await updateHireRequestStatus(requestId, statusValue, token);

            console.log("Update response:", data);

            setHireRequests((prev) =>
                prev.map((request) =>
                    request.id === requestId
                        ? { ...request, status: statusValue }
                        : request
                )
            );

            return {
                success: true,
                message: data?.message || `Request ${capitalize(statusValue)} successfully`,
            };
        } catch (error) {
            console.error("Update request error:", error);
            return {
                success: false,
                message: error?.message || "Failed to update request",
            };
        } finally {
            setUpdatingRequestId(null);
        }
    };

    const normalizedRequests = useMemo(() => {
        return hireRequests.map((item) => ({
            id: item?.id,
            customerEmail: item?.customer_email || "",
            employerEmail: item?.employer_email || "",
            jobRole: item?.job_role || "",
            message: item?.message || "No message from customer",
            status: String(item?.status || "pending").toLowerCase(),
            createdAt: item?.created_at || "",
        }));
    }, [hireRequests]);

    const filteredRequests = useMemo(() => {
        return normalizedRequests.filter((item) => {
            const matchesStatus =
                reqStatusFilter === "All" ||
                capitalize(item.status) === reqStatusFilter;

            const searchText = reqSearch.trim().toLowerCase();

            const matchesSearch =
                searchText === "" ||
                item.customerEmail.toLowerCase().includes(searchText) ||
                item.employerEmail.toLowerCase().includes(searchText) ||
                item.jobRole.toLowerCase().includes(searchText) ||
                item.message.toLowerCase().includes(searchText);

            return matchesStatus && matchesSearch;
        });
    }, [normalizedRequests, reqStatusFilter, reqSearch]);

    const pendingCount = useMemo(() => {
        return normalizedRequests.filter(
            (item) => item.status === "pending"
        ).length;
    }, [normalizedRequests]);

    const acceptedCount = useMemo(() => {
        return normalizedRequests.filter(
            (item) => item.status === "accepted"
        ).length;
    }, [normalizedRequests]);

    return {
        hireRequests,          // raw data
        filteredRequests,      // filtered data
        normalizedRequests,

        loadingRequests,
        requestsError,
        reqStatusFilter,
        setReqStatusFilter,
        reqSearch,
        setReqSearch,
        updatingRequestId,

        pendingCount,
        acceptedCount,

        reloadRequests: loadRequests,
        onUpdateStatus: handleUpdateRequestStatus,
        handleUpdateRequestStatus,
    };
};