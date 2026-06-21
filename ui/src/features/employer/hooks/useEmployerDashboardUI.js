import { useState } from "react";

export const useEmployerDashboardUI = () => {
    const [open, setOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState("Dashboard");
    const [showProfileCard, setShowProfileCard] = useState(false);
    const [jobStatusFilter, setJobStatusFilter] = useState("All");
    const [jobSearch, setJobSearch] = useState("");

    const switchMenu = (menu) => {
        setSelectedMenu(menu);
        setShowProfileCard(false);
        setJobStatusFilter("All");
        setJobSearch("");
    };

    return {
        open,
        setOpen,
        selectedMenu,
        setSelectedMenu,
        showProfileCard,
        setShowProfileCard,
        jobStatusFilter,
        setJobStatusFilter,
        jobSearch,
        setJobSearch,
        switchMenu,
    };
};