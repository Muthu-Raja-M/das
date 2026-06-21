import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ForgotPassword from "../features/auth/pages/ForgotPassword.jsx";

import Header from "../shared/components/Header.jsx";
import ProtectedRoute from "../shared/components/ProtectedRoute.jsx";
import { SnackbarProvider } from "../shared/components/SnackbarProvider.jsx";
import Home from "../shared/components/Home.jsx";
import CustomerRegistration from "../features/customer/pages/CustomerRegister.jsx";
import EmployerRegistration from "../features/employer/pages/EmployerRegister.jsx";
import CustomerDashboard from "../features/customer/pages/CustomerDashboard.jsx";
import EmployerDashboard from "../features/employer/pages/EmployerDashboard.jsx";
import Loginpage from "../features/auth/pages/LoginPage.jsx";
import WorkerProfilePage from "../features/customer/pages/WorkerProfilePage.jsx";
import AdminDashboard from "../features/admin/pages/AdminDashboard.jsx";
import EmployerDocumentsUpload from "../features/verification/components/EmployerDocumentsUpload";
import AdminEmployerVerificationSection from "../features/verification/components/AdminEmployerVerificationSection";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SnackbarProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute allowedRole="admin">
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Home />} />

                        <Route path="/customer/register" element={<CustomerRegistration />} />
                        <Route path="/employer/register" element={<EmployerRegistration />} />

                        <Route path="/login" element={<Loginpage />} />

                        <Route
                            path="/customer/dashboard"
                            element={
                                <ProtectedRoute allowedRole="customer">
                                    <CustomerDashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/employer/dashboard"
                            element={
                                <ProtectedRoute allowedRole="employer">
                                    <EmployerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/worker/:id/"
                            element={
                                <ProtectedRoute allowedRole="customer">
                                    <WorkerProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<Navigate to="/login" />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route
                            path="/employer-verify"
                            element={
                                <ProtectedRoute allowedRole="employer">
                                    <EmployerDocumentsUpload />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin-verifications"
                            element={
                                <ProtectedRoute allowedRole="admin">
                                    <AdminEmployerVerificationSection />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </SnackbarProvider>
        </QueryClientProvider>
    );
}

export default App;