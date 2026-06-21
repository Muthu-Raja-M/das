import { getRequest } from "../../../api/request";
import { employer } from "../../../api/endpoints";

export const getEmployerListService = (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.job_role) searchParams.append("job_role", params.job_role);
    if (params.state) searchParams.append("state", params.state);
    if (params.district) searchParams.append("district", params.district);

    const query = searchParams.toString();
    const url = query ? `${employer.list}?${query}` : employer.list;

    return getRequest(url);
};

export const getEmployerProfileService = (email) => {
    return getRequest(`${employer.profile}?email=${email}`);
};

export const getEmployerDetailService = (id) => {
    return getRequest(`${employer.detail}${id}/`);
};