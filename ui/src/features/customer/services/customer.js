import { postRequest } from "../../../api/request";
import { customer } from "../../../api/endpoints";

export const registerCustomerService = async (payload) => {
    try {
        return await postRequest(customer.register, payload);
    } catch (error) {
        throw error;
    }
};