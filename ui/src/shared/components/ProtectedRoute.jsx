import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;