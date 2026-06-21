import API from "../../../api/axios";

export const updateEmployerProfile = async (email, payload, token) => {
    return await API.put(`/employer/profile/update/?email=${encodeURIComponent(email)}`, payload);
};