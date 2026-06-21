import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../../api/axios";

// employer threads
export const useEmployerThreads = (email, options = {}) => {
    return useQuery({
        queryKey: ["employerThreads", email],
        queryFn: async () => {
            const data = await API.get(
                `/messages/employer-threads/?email=${encodeURIComponent(email)}`
            );
            return Array.isArray(data) ? data : [];
        },
        enabled: !!email && (options.enabled ?? true),
    });
};

// customer threads
export const useCustomerThreads = (email, options = {}) => {
    return useQuery({
        queryKey: ["customerThreads", email],
        queryFn: async () => {
            const data = await API.get(
                `/messages/customer-threads/?email=${encodeURIComponent(email)}`
            );
            return Array.isArray(data) ? data : [];
        },
        enabled: !!email && (options.enabled ?? true),
    });
};

// full conversation by hire request id
export const useConversation = (hireRequestId, options = {}) => {
    return useQuery({
        queryKey: ["conversation", hireRequestId],
        queryFn: async () => {
            const data = await API.get(`/messages/conversation/${hireRequestId}/`);
            return Array.isArray(data?.messages) ? data.messages : [];
        },
        enabled: !!hireRequestId && (options.enabled ?? true),
        refetchInterval: 5000,
    });
};

// send message
export const useSendMessage = (hireRequestId, userEmail) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload) => {
            const data = await API.post("/messages/send/", payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["conversation", hireRequestId],
            });
            queryClient.invalidateQueries({
                queryKey: ["employerThreads", userEmail],
            });
            queryClient.invalidateQueries({
                queryKey: ["customerThreads", userEmail],
            });
        },
    });
};