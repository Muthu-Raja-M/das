import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getEmployerListService,
    getEmployerProfileService,
    getEmployerDetailService,
} from "../services/employer";
import { updateEmployerProfile } from "../services/employerProfileService";

/* ─────────────────────────────────────────────────────────────
   Get employer list with filters
───────────────────────────────────────────────────────────── */
export const useEmployerList = (filters = {}) => {
    const normalizedFilters = {
        job_role: filters?.job_role || "",
        state: filters?.state || "",
        district: filters?.district || "",
    };

    return useQuery({
        queryKey: ["employerList", normalizedFilters],
        queryFn: () => getEmployerListService(normalizedFilters),
        enabled: !!normalizedFilters.job_role,
        select: (data) => Array.isArray(data) ? data : [],
        staleTime: 1000 * 60 * 5,
    });
};

/* ─────────────────────────────────────────────────────────────
   Get employer profile by email
───────────────────────────────────────────────────────────── */
export const useEmployerProfile = (email) => {
    return useQuery({
        queryKey: ["employerProfile", email],
        queryFn: () => getEmployerProfileService(email),
        enabled: !!email,
        select: (data) => data || {},
        staleTime: 1000 * 60 * 5,
    });
};

/* ─────────────────────────────────────────────────────────────
   Get employer detail by id
───────────────────────────────────────────────────────────── */
export const useEmployerDetail = (id) => {
    return useQuery({
        queryKey: ["employerDetail", id],
        queryFn: () => getEmployerDetailService(id),
        enabled: !!id,
        select: (data) => data || {},
        staleTime: 1000 * 60 * 5,
    });
};

/* ─────────────────────────────────────────────────────────────
   Update employer profile
───────────────────────────────────────────────────────────── */
export const useUpdateEmployerProfile = (showSnack) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ email, payload, token }) => {
            if (!email) {
                throw new Error("Employer email is required");
            }

            return await updateEmployerProfile(email, payload, token);
        },

        onSuccess: (data, variables) => {
            const { email, payload } = variables;

            queryClient.invalidateQueries({
                queryKey: ["employerProfile", email],
            });

            queryClient.invalidateQueries({
                queryKey: ["employerDetail"],
            });

            queryClient.invalidateQueries({
                queryKey: ["employerList"],
            });

            localStorage.setItem("user", payload?.name || "");
            localStorage.setItem("job_role", payload?.job_role || "");
            localStorage.setItem("phone", payload?.phone || "");
            localStorage.setItem("state", payload?.state || "");
            localStorage.setItem("district", payload?.district || "");
            localStorage.setItem("experience", payload?.experience || "");
            localStorage.setItem("dailyRate", String(payload?.daily_rate || ""));
            localStorage.setItem("bio", payload?.bio || "");
            localStorage.setItem("skills", JSON.stringify(payload?.skills || []));

            if (showSnack) {
                showSnack(
                    data?.message || "Profile updated successfully!",
                    "success"
                );
            }
        },

        onError: (error) => {
            if (showSnack) {
                showSnack(
                    error?.message || "Failed to update profile",
                    "error"
                );
            }
        },
    });
};