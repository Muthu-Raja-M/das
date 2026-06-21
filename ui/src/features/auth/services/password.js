import { postRequest } from "../../../api/request.js";
import { password } from "../../../api/endpoints.js";

export const sendOtpService = async (payload) => {
    try {
        const response = await postRequest(password.sendOtp, payload);
        return response;
    } catch (error) {
        throw error;
    }
};

export const verifyOtpService = async (payload) => {
    try {
        const response = await postRequest(password.verifyOtp, payload);
        return response;
    } catch (error) {
        throw error;
    }
};

export const resetPasswordService = async (payload) => {
    try {
        const response = await postRequest(password.resetPassword, payload);
        return response;
    } catch (error) {
        throw error;
    }
};