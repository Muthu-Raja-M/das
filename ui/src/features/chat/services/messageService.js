import API from "../../../api/axios";

// Employer threads
export const getEmployerThreadsService = async (email) => {
    if (!email) {
        throw new Error("Employer email is required");
    }

    try {
        const data = await API.get(
            `/messages/employer-threads/?email=${encodeURIComponent(email)}`
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {
        throw new Error(
            error?.response?.data?.error || "Failed to fetch employer message threads"
        );
    }
};

// Customer threads
export const getCustomerThreadsService = async (email) => {
    if (!email) {
        throw new Error("Customer email is required");
    }

    try {
        const data = await API.get(
            `/messages/customer-threads/?email=${encodeURIComponent(email)}`
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {
        throw new Error(
            error?.response?.data?.error || "Failed to fetch customer message threads"
        );
    }
};

// Conversation messages
export const getConversationService = async (hireRequestId) => {
    if (!hireRequestId) {
        throw new Error("Hire request id is required");
    }

    try {
        const data = await API.get(`/messages/conversation/${hireRequestId}/`);

        return Array.isArray(data?.messages) ? data.messages : [];
    } catch (error) {
        throw new Error(
            error?.response?.data?.error || "Failed to fetch conversation"
        );
    }
};

// Send message
export const sendMessageService = async (payload) => {
    if (!payload?.sender_email) {
        throw new Error("Sender email is required");
    }

    if (!payload?.receiver_email) {
        throw new Error("Receiver email is required");
    }

    if (!payload?.hire_request_id) {
        throw new Error("Hire request id is required");
    }

    if (!payload?.message?.trim()) {
        throw new Error("Message is required");
    }

    try {
        const data = await API.post("/messages/send/", {
            sender_email: payload.sender_email,
            receiver_email: payload.receiver_email,
            hire_request_id: payload.hire_request_id,
            message: payload.message.trim(),
        });

        return data;
    } catch (error) {
        throw new Error(
            error?.response?.data?.error || "Failed to send message"
        );
    }
};