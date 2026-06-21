import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Logo from "../../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postRequest } from "../../../api/request";
import { auth } from "../../../api/endpoints";
import { Link } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const loginpage = {
    page: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f9ff",
        overflow: "hidden",
        padding: "16px",
    },
    loginbox: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "center",
        justifyContent: "center",
        width: "380px",
        maxWidth: "100%",
        backgroundColor: "white",
        padding: "30px 25px",
        borderRadius: "20px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    img: {
        width: "100px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    inputBox: {
        width: "100%",
    },
    button: {
        marginTop: "15px",
        borderRadius: "30px",
        textTransform: "none",
        width: "100%",
        height: "44px",
        boxShadow: "none",
        backgroundColor: "#1C6EA4",
    },
    signupText: {
        margin: 0,
        fontSize: "14px",
        textAlign: "center",
    },
    signupLink: {
        color: "#0ea5e9",
        cursor: "pointer",
        marginLeft: "5px",
        fontWeight: 600,
    },
};

const loginService = async (payload) => {
    return await postRequest(auth.login, payload);
};

const Loginpage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const mutation = useMutation({
        mutationFn: loginService,
        onSuccess: (data) => {
            console.log("LOGIN RESPONSE:", data);

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            localStorage.removeItem("email");
            localStorage.removeItem("userData");

            const token = data?.token || data?.access || "";
            const role = data?.role || "";
            const name = data?.name || "";
            const email = data?.email || "";

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("user", name);
            localStorage.setItem("email", email);

            localStorage.setItem(
                "userData",
                JSON.stringify({
                    id: data?.id || "",
                    name,
                    email,
                    role,
                    message: data?.message || "",
                })
            );

            if (role === "customer") {
                navigate("/customer/dashboard");
            } else if (role === "employer") {
                navigate("/employer/dashboard");
            } else if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                setErrorMessage("Unknown role received from server");
            }
        },
        onError: (error) => {
            console.error("Login error:", error);
            setErrorMessage(
                error?.response?.data?.error ||
                error?.response?.data?.message ||
                error?.message ||
                "Login failed"
            );
        },
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!formData.email || !formData.password) {
            setErrorMessage("Email and password are required");
            return;
        }

        const payload = {
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
        };

        mutation.mutate(payload);
    };

    return (
        <Box sx={loginpage.page}>
            <Box sx={loginpage.loginbox}>
                <Typography variant="h5" fontWeight={700} textAlign="center">
                    Sign in to
                    <span style={{ color: "#0ea5e9" }}> Blue Connect</span>
                </Typography>

                <img style={loginpage.img} src={Logo} alt="logo" />

                {errorMessage && (
                    <Alert severity="error" sx={{ width: "100%", borderRadius: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <Box
                    component="form"
                    style={loginpage.form}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleLogin}
                >
                    <Box sx={loginpage.inputBox}>
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            variant="standard"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Box>

                    <Box sx={loginpage.inputBox}>
                        <TextField
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="standard"
                            fullWidth
                            value={formData.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        style={loginpage.button}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CircularProgress size={18} color="inherit" />
                                Logging in...
                            </Box>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </Box>

                <p style={loginpage.signupText}>
                    Don't have an account?
                    <span
                        style={loginpage.signupLink}
                        onClick={() => navigate("/")}
                    >
                        Signup
                    </span>
                </p>
                <Box sx={{ textAlign: "right", mt: 1 }}>
                    <Link
                        to="/forgot-password"
                        style={{
                            textDecoration: "none",
                            color: "#1976d2",
                            fontWeight: 500,
                            fontSize: "14px",
                        }}
                    >
                        Forgot Password?
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};

export default Loginpage;