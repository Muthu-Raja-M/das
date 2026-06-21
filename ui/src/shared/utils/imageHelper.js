const BASE_URL = "http://127.0.0.1:8000";

export const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}${img}`;
};