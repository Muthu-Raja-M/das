import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerCustomerService } from "../services/customer.js";
import { useSnackbar } from "../../../shared/components/SnackbarProvider"; // your snackbar

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();
    const { updateSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (payload) => registerCustomerService(payload),

        onSuccess: (data) => {
            // refresh customer list if needed
            queryClient.invalidateQueries(["customerList"]);

            updateSnackbar({
                severity: "success",
                message: data?.message || "Customer Registered Successfully 🎉",
            });
        },

        onError: (error) => {
            let errorMsg = "Registration failed ❌";
            if (error?.response?.data) {
                if (typeof error.response.data === "string") {
                    errorMsg = error.response.data;
                } else if (error.response.data.error) {
                    errorMsg = error.response.data.error;
                } else if (error.response.data.message) {
                    errorMsg = error.response.data.message;
                } else {
                    const keys = Object.keys(error.response.data);
                    if (keys.length > 0) {
                        const firstError = error.response.data[keys[0]];
                        errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
                    }
                }
            } else if (error.message) {
                errorMsg = error.message;
            }
            updateSnackbar({
                severity: "error",
                message: errorMsg,
            });
        },
    });
};