import { getRequest, postRequest, deleteRequest, patchRequest } from "../../../api/request";
import { adminpanel } from "../../../api/endpoints";

// CUSTOMERS
export const getAllCustomersService = async () => {
    const response = await getRequest(adminpanel.customers);
    return response?.data || response;
};

export const deleteCustomerService = async (id) => {
    const response = await deleteRequest(adminpanel.deleteCustomer(id));
    return response?.data || response;
};

// EMPLOYERS
export const getAllEmployersService = async () => {
    const response = await getRequest(adminpanel.employers);
    return response?.data || response;
};

// ✅ ADMIN APPROVE / REJECT EMPLOYER VERIFICATION
export const verifyEmployerService = async (
    verificationId,
    action,
    admin_notes = ""
) => {
    if (!verificationId) {
        throw new Error("Verification ID is missing");
    }

    if (action === "delete") {
        const url = `/employer/verify/${verificationId}/`;
        const response = await patchRequest(url, {
            action: "delete",
            delete_message: admin_notes,
        });
        return response?.data || response;
    }

    const url =
        action === "approve"
            ? `/verification/admin/approve/${verificationId}/`
            : `/verification/admin/reject/${verificationId}/`;

    const response = await postRequest(url, {
        admin_notes,
    });

    return response?.data || response;
};

export const getEmployerDocumentsService = async (id) => {
    const response = await getRequest(`/verification/admin/employer/${id}/`);
    return response?.data || response;
};