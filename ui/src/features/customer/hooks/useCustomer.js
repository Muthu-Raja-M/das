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
            updateSnackbar({
                severity: "error",
                message:
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error.message ||
                    "Registration failed ❌",
            });
        },
    });
};