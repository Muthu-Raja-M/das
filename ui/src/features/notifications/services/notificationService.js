import API from "../../../api/axios";

export const getEmployeeNotifications = async () => {
    return await API.get("/notifications/employee/");
};

export const getCustomerNotifications = async () => {
    return await API.get("/notifications/customer/");
};

export const markAsRead = async (id) => {
    return await API.patch(`/notifications/${id}/read/`);
};

export const acceptHireRequest = async (id) => {
    return await API.post(`/hirerequest/${id}/accept/`);
};

export const rejectHireRequest = async (id) => {
    return await API.post(`/hirerequest/${id}/reject/`);
};

export const markAllAsRead = async () => {
    return await API.post("/notifications/read-all/");
};

