import API from "../../api/axios";

export const fetchEmployerAlerts = async (email) => {
    const response = await API.get(
        `/verification/alerts/employer/?email=${encodeURIComponent(email)}`
    );

    return response;
};