import { postRequest } from "../../../api/request";
import { auth } from "../../../api/endpoints";

export const loginService = (payload) => {
    return postRequest(auth.login, payload);
};