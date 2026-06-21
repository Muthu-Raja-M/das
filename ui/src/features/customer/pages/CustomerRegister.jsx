import Logo from "../../../assets/logo.png";
import React, { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import * as Yup from "yup";
import { useCreateCustomer } from "../hooks/useCustomer";
import { useNavigate } from "react-router";

const validationSchema = Yup.object({
    fullname: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits"),
    aadhaar: Yup.string()
        .required("Aadhaar is required")
        .matches(/^[0-9]{12}$/, "Aadhaar must be 12 digits"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
});

const customerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "14px",
    padding: "15px",
};

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        "&:hover fieldset": {
            borderColor: "#1976d2",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#1976d2",
            boxShadow: "0 0 6px rgba(25,118,210,0.25)",
        },
    },
};

function CustomerRegister() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    console.log("showPassword", showPassword);
    console.log("showConfirmPassword", setShowPassword);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const mutation = useCreateCustomer();
    const getPasswordStrength = (password) => {
        if (!password) return "";
        if (password.length < 6) return "Weak";
        if (password.length < 10) return "Medium";
        return "Strong";
    };

    const getStrengthColor = (password) => {
        if (!password) return "#999";
        if (password.length < 6) return "red";
        if (password.length < 10) return "#f59e0b";
        return "green";
    };

    const formik = useFormik({
        initialValues: {
            fullname: "",
            email: "",
            phone: "",
            aadhaar: "",
            password: "",
            confirmPassword: "",
            role: "customer",
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                fullname: values.fullname,
                email: values.email,
                phone: values.phone,
                aadhaar: values.aadhaar,
                password: values.password,
                role: values.role,
            };

            mutation.mutate(payload, {
                onSuccess: () => {
                    formik.resetForm();
                    navigate("/login");
                },
            });
        },
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div
                    style={{
                        borderRadius: "25px",
                        backgroundColor: "#fff",
                        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
                        marginLeft: "auto",
                        marginRight: "auto",
                        maxWidth: "700px",
                        padding: "20px",
                        marginTop: "50px",
                    }}
                >
                    <div style={{ textAlign: "center", margin: "20px 0px" }}>
                        <img
                            style={{ width: "100px", height: "100px" }}
                            src={Logo}
                            alt="logo"
                        />
                        <h1 style={{ marginBottom: "5px" }}>Customer Registration</h1>
                        <p style={{ color: "gray", marginTop: 0 }}>
                            Create your Blue Connect account
                        </p>
                    </div>

                    <hr style={{ margin: "10px", border: "1px solid #f1f1f1" }} />

                    <div style={customerStyle}>
                        <TextField
                            label="Full Name"
                            name="fullname"
                            size="small"
                            value={formik.values.fullname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                            helperText={formik.touched.fullname && formik.errors.fullname}
                            sx={inputSx}
                            fullWidth
                        />

                        <TextField
                            label="Email"
                            name="email"
                            size="small"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            sx={inputSx}
                            fullWidth
                        />

                        <TextField
                            label="Phone Number"
                            name="phone"
                            size="small"
                            value={formik.values.phone}
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/\D/g, "");
                                formik.setFieldValue("phone", onlyNumbers);
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                            sx={inputSx}
                            fullWidth
                            inputProps={{ maxLength: 10 }}
                        />

                        <TextField
                            label="Aadhaar Number"
                            name="aadhaar"
                            size="small"
                            value={formik.values.aadhaar}
                            onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(/\D/g, "");
                                formik.setFieldValue("aadhaar", onlyNumbers);
                            }}
                            onBlur={formik.handleBlur}
                            error={formik.touched.aadhaar && Boolean(formik.errors.aadhaar)}
                            helperText={formik.touched.aadhaar && formik.errors.aadhaar}
                            sx={inputSx}
                            fullWidth
                            inputProps={{ maxLength: 12 }}
                        />

                        <div>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                size="small"
                                type={showPassword ? "text" : "password"}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                sx={inputSx}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />


                            {formik.values.password && (
                                <p
                                    style={{
                                        margin: "6px 4px 0",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        color: getStrengthColor(formik.values.password),
                                    }}
                                >
                                    Password Strength:{" "}
                                    {getPasswordStrength(formik.values.password)}
                                </p>
                            )}
                        </div>

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            size="small"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.confirmPassword &&
                                Boolean(formik.errors.confirmPassword)
                            }
                            helperText={
                                formik.touched.confirmPassword &&
                                formik.errors.confirmPassword
                            }
                            sx={inputSx}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                            gap: "10px",
                        }}
                    >
                        <Button
                            type="button"
                            variant="contained"
                            style={{
                                backgroundColor: "#ef4444",
                                borderRadius: "10px",
                                textTransform: "none",
                                minWidth: "100px",
                            }}
                            onClick={() => formik.resetForm()}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={mutation.isPending}
                            style={{
                                borderRadius: "10px",
                                backgroundColor: "#1C6EA4",
                                textTransform: "none",
                                minWidth: "120px",
                            }}
                        >
                            {mutation.isPending ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </div>
            </form>

        </>
    );
}

export default CustomerRegister;