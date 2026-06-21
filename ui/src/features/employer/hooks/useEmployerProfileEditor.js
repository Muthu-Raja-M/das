import { useMemo, useState, useEffect } from "react";
import { useUpdateEmployerProfile } from "./useEmployer";

export const useEmployerProfileEditor = (profileData, showSnack) => {
    const updateProfileMutation = useUpdateEmployerProfile(showSnack);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [newSkill, setNewSkill] = useState("");

    const profile = useMemo(() => {
        const data = profileData || {};

        return {
            name: data?.name || localStorage.getItem("user") || "Arul Dhas",
            role: data?.job_role || localStorage.getItem("job_role") || "Electrician",
            email: data?.email || localStorage.getItem("email") || "",
            phone: data?.phone || localStorage.getItem("phone") || "",
            state: data?.state || localStorage.getItem("state") || "Tamil Nadu",
            district: data?.district || localStorage.getItem("district") || "",
            experience: data?.experience || localStorage.getItem("experience") || "",
            dailyRate: data?.daily_rate || localStorage.getItem("dailyRate") || "",
            bio: data?.bio || localStorage.getItem("bio") || "",
            skills:
                data?.skills ||
                JSON.parse(localStorage.getItem("skills") || "null") || [],
            rating: data?.rating || 4.8,
            verified: data?.verified ?? true,
        };
    }, [profileData]);

    const computeCompletion = (p) => {
        const fields = [p.name, p.phone, p.role, p.district, p.experience, p.dailyRate, p.bio];
        const filled = fields.filter((f) => f && String(f).trim() !== "").length;
        const skillBonus = (p.skills || []).length > 0 ? 1 : 0;
        return Math.round(((filled + skillBonus) / (fields.length + 1)) * 100);
    };

    const profileWithCompletion = useMemo(() => {
        return {
            ...profile,
            profileCompletion: computeCompletion(profile),
        };
    }, [profile]);

    const openEdit = () => {
        setEditForm({ ...profileWithCompletion });
        setFormErrors({});
        setNewSkill("");
        setIsEditing(true);
    };

    const closeEdit = () => {
        setIsEditing(false);
        setFormErrors({});
        setNewSkill("");
    };

    const setField = (field, value) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));

        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const addSkill = () => {
        const trimmed = newSkill.trim();

        if (!trimmed) return;

        if ((editForm.skills || []).includes(trimmed)) {
            showSnack("Skill already added", "warning");
            return;
        }

        setEditForm((prev) => ({
            ...prev,
            skills: [...(prev.skills || []), trimmed],
        }));
        setNewSkill("");
    };

    const removeSkill = (skill) => {
        setEditForm((prev) => ({
            ...prev,
            skills: (prev.skills || []).filter((s) => s !== skill),
        }));
    };

    const validate = () => {
        const errors = {};

        if (!editForm.name?.trim()) errors.name = "Name is required";
        if (!editForm.phone?.trim()) errors.phone = "Phone is required";
        else if (!/^\d{10}$/.test(editForm.phone.trim())) {
            errors.phone = "Enter a valid 10-digit number";
        }

        if (!editForm.role?.trim()) errors.role = "Job role is required";
        if (!editForm.district?.trim()) errors.district = "District is required";
        if (!editForm.experience?.trim()) errors.experience = "Experience is required";

        if (!editForm.dailyRate || isNaN(editForm.dailyRate) || Number(editForm.dailyRate) <= 0) {
            errors.dailyRate = "Enter a valid daily rate";
        }

        return errors;
    };

    const saveProfile = async () => {
        const errors = validate();

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        const payload = {
            name: editForm.name.trim(),
            job_role: editForm.role.trim(),
            phone: editForm.phone.trim(),
            state: editForm.state,
            district: editForm.district,
            experience: editForm.experience,
            daily_rate: Number(editForm.dailyRate),
            bio: editForm.bio?.trim() || "",
            skills: editForm.skills || [],
        };

        updateProfileMutation.mutate(
            { email, payload, token },
            {
                onSuccess: () => {
                    closeEdit();
                },
            }
        );
    };

    return {
        profile: profileWithCompletion,
        isEditing,
        setIsEditing,
        editForm,
        formErrors,
        savingProfile: updateProfileMutation.isPending,
        newSkill,
        setNewSkill,
        computeCompletion,
        openEdit,
        closeEdit,
        setField,
        addSkill,
        removeSkill,
        saveProfile,
    };
};