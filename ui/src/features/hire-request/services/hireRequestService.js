export const fetchEmployerHireRequests = async (email, token) => {
    const res = await fetch(
        `http://127.0.0.1:8000/api/hirerequest/employer/?email=${encodeURIComponent(email)}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to load hire requests");
    }

    return Array.isArray(data) ? data : [];
};

export const updateHireRequestStatus = async (requestId, statusValue, token) => {
    const res = await fetch(
        `http://127.0.0.1:8000/api/hirerequest/update/${requestId}/`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ status: statusValue }),
        }
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data?.error || data?.message || "Failed to update request");
    }

    return data;
};