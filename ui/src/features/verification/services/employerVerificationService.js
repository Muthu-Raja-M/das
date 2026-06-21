import API from "../../../api/axios";

export const submitEmployerVerification = async ({
    employerEmail,
    faceFile,
    aadharFile,
    panFile,
    drivingFile,
}) => {
    const formData = new FormData();

    // ✅ backend expects this exact key
    formData.append("email", employerEmail);

    formData.append("face_image", faceFile);
    formData.append("aadhar_image", aadharFile);
    formData.append("pan_image", panFile);

    if (drivingFile) {
        formData.append("driving_licence_image", drivingFile);
    }

    const response = await API.post("/verification/submit/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response?.data || response;
};
export const fetchVerificationList = async () => {
    const response = await API.get("/verification/admin/list/");
    return response;
};

export const fetchVerificationDetail = async (verificationId) => {
    const response = await API.get(`/verification/admin/detail/${verificationId}/`);
    return response;
};

export const approveVerification = async (verificationId, payload = {}) => {
    const response = await API.post(
        `/verification/admin/approve/${verificationId}/`,
        payload
    );
    return response;
};

export const rejectVerification = async (verificationId, payload = {}) => {
    const response = await API.post(
        `/verification/admin/reject/${verificationId}/`,
        payload
    );
    return response;
};

export const fetchEmployerAlerts = async (email) => {
    const response = await API.get(`/verification/alerts/employer/?email=${email}`);
    return response;
};