import API from "./axios"


export const postRequest = (url, data = {}, config = {}) => {
    return API.post(url, data, config);
};

export const getRequest = (url, config = {}) => {
    return API.get(url, config);
};

export const putRequest = (url, data = {}, config = {}) => {
    return API.put(url, data, config);
};

export const deleteRequest = (url, config = {}) => {
    return API.delete(url, config);
};
export const patchRequest = (url, data, config) => {
    return API.patch(url, data, config);
};