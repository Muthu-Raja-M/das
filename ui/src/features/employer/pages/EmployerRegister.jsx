import React, { useState } from "react";
import Logo from "../../../assets/logo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { getAllStates, getDistricts } from "india-state-district";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    Button,
    InputAdornment,
    IconButton,
    Checkbox,
    FormControlLabel,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import API from "../../../api/axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function EmployerRegistration() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const BASE_URL = import.meta.env.VITE_API_URL;

    const roles = [
        "Plumber",
        "Electrician",
        "Driver",
        "Mason",
        "Carpenter",
        "Mechanic",
        "Painter",
        "carwasher",
        "gardener",
        "housekeeper",

    ];

    const experienceOptions = [
        "0-1 years",
        "1-3 years",
        "3-5 years",
        "5-10 years",
        "10+ years",
    ];

    const states = getAllStates();

    const validationSchema = Yup.object({
        username: Yup.string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must not exceed 30 characters")
            .required("Username is required"),

        email: Yup.string()
            .email("Enter a valid email")
            .required("Email is required"),

        phone: Yup.string()
            .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
            .required("Phone is required"),

        state: Yup.string().required("State is required"),
        district: Yup.string().required("District is required"),
        address: Yup.string().required("Address is required"),
        job_role: Yup.string().required("Job role is required"),
        experience: Yup.string().required("Experience is required"),

        dailyRate: Yup.number()
            .typeError("Daily rate must be a number")
            .positive("Daily rate must be greater than 0")
            .required("Daily rate is required"),

        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm Password is required"),

        agree: Yup.boolean().oneOf([true], "You must accept the terms"),
    });

    const getPasswordStrength = (password) => {
        if (!password) return "";
        if (password.length < 8) return "Weak";
        if (password.length < 12) return "Medium";
        return "Strong";
    };

    const getStrengthColor = (password) => {
        if (!password) return "#999";
        if (password.length < 8) return "red";
        if (password.length < 12) return "#f59e0b";
        return "green";
    };

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            transition: "all 0.3s ease",
            "&:hover fieldset": {
                borderColor: "#1976d2",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#1976d2",
                boxShadow: "0 0 6px rgba(25,118,210,0.25)",
            },
        },
    };

    const mutation = useMutation({
        mutationFn: async (payload) => {
            return await API.post("/employer/register/", payload);
        },
        onSuccess: () => {
            setOpenSuccess(true);
            formik.resetForm();
        },
        onError: (error) => {
            setErrorMessage(error.message || "Registration failed");
            setOpenError(true);
        },
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            phone: "",
            state: "",
            district: "",
            address: "",
            job_role: "",
            experience: "",
            dailyRate: "",
            password: "",
            confirmPassword: "",
            agree: false,
        },
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                username: values.username,
                email: values.email,
                phone: values.phone,
                state: values.state,
                district: values.district,
                address: values.address,
                job_role: values.job_role,
                experience: values.experience,
                daily_rate: values.dailyRate,
                password: values.password,
                role: "employer",
            };

            mutation.mutate(payload);
        },
    });

    const districts = React.useMemo(() => {
        const selected = states.find((s) => s.name === formik.values.state);
        return selected ? getDistricts(selected.code) : [];
    }, [formik.values.state]);

    return (
        <>
            <Box
                sx={{
                    minHeight: "100vh",
                    background: "linear-gradient(to right, #f8fbff, #eef6ff)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1.5,
                }}
            >
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: 700,
                        borderRadius: 4,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 14px 32px rgba(0,0,0,0.10)",
                        },
                    }}
                >
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ textAlign: "center", mb: 2 }}>
                            <img
                                src={Logo}
                                alt="Blue Connect Logo"
                                style={{ width: 70, marginBottom: 8 }}
                            />
                            <Typography
                                variant="h5"
                                fontWeight="bold"
                                sx={{ fontSize: { xs: "22px", sm: "26px" } }}
                            >
                                Employer Registration
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Create your Blue Connect account
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={formik.handleSubmit}>
                            <Typography
                                variant="subtitle2"
                                sx={{ color: "#0284c7", fontWeight: 700, mb: 1.5 }}
                            >
                                Personal Information
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: 1.2,
                                    mb: 2,
                                }}
                            >
                                <TextField
                                    size="small"
                                    name="username"
                                    label="Username"
                                    fullWidth
                                    value={formik.values.username}
                                    inputProps={{ maxLength: 30 }}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                    sx={inputSx}
                                />

                                <TextField
                                    size="small"
                                    name="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    inputProps={{ maxLength: 50 }}
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                    sx={inputSx}
                                />

                                <TextField
                                    size="small"
                                    name="phone"
                                    label="Phone"
                                    fullWidth
                                    type="tel"
                                    value={formik.values.phone}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) {
                                            formik.setFieldValue("phone", value);
                                        }
                                    }}
                                    onBlur={formik.handleBlur}
                                    inputProps={{ maxLength: 10 }}
                                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                                    helperText={formik.touched.phone && formik.errors.phone}
                                    sx={inputSx}
                                />
                                <TextField
                                    size="small"
                                    select
                                    name="state"
                                    label="State"
                                    fullWidth
                                    value={formik.values.state}
                                    onChange={(e) => {
                                        formik.setFieldValue("state", e.target.value);
                                        formik.setFieldValue("district", "");
                                    }}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.state && Boolean(formik.errors.state)}
                                    helperText={formik.touched.state && formik.errors.state}
                                    sx={inputSx}
                                >
                                    {states.map((state) => (
                                        <MenuItem key={state.code} value={state.name}>
                                            {state.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    size="small"
                                    select
                                    name="district"
                                    label="District"
                                    fullWidth
                                    disabled={!formik.values.state}
                                    value={formik.values.district}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.district && Boolean(formik.errors.district)}
                                    helperText={formik.touched.district && formik.errors.district}
                                    sx={inputSx}
                                    SelectProps={{
                                        MenuProps: {
                                            PaperProps: {
                                                style: { maxHeight: 200 },
                                            },
                                        },
                                    }}
                                >
                                    {districts.map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
                                    <TextField
                                        size="small"
                                        name="address"
                                        label="Address"
                                        multiline
                                        rows={2}
                                        fullWidth
                                        inputProps={{ maxLength: 100 }}
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.address && Boolean(formik.errors.address)}
                                        helperText={formik.touched.address && formik.errors.address}
                                        sx={inputSx}
                                    />
                                </Box>
                            </Box>

                            <Typography
                                variant="subtitle2"
                                sx={{ color: "#0284c7", fontWeight: 700, mb: 1.5 }}
                            >
                                Work & Skills
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: 1.2,
                                    mb: 2,
                                }}
                            >
                                <TextField
                                    size="small"
                                    select
                                    name="job_role"
                                    label="Select Job Role"
                                    fullWidth
                                    value={formik.values.job_role}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.job_role && Boolean(formik.errors.job_role)}
                                    helperText={formik.touched.job_role && formik.errors.job_role}
                                    sx={inputSx}
                                >
                                    {roles.map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    size="small"
                                    select
                                    name="experience"
                                    label="Years of Experience"
                                    fullWidth
                                    value={formik.values.experience}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.experience && Boolean(formik.errors.experience)}
                                    helperText={formik.touched.experience && formik.errors.experience}
                                    sx={inputSx}
                                >
                                    {experienceOptions.map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
                                    <TextField
                                        size="small"
                                        name="dailyRate"
                                        label="Daily Rate / Budget"
                                        placeholder="e.g. 600 – 1200 per day"
                                        fullWidth
                                        type="number"
                                        value={formik.values.dailyRate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.dailyRate && Boolean(formik.errors.dailyRate)}
                                        helperText={formik.touched.dailyRate && formik.errors.dailyRate}
                                        sx={inputSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">₹</InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </Box>

                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mt: 1,
                                    mb: 1.5,
                                    color: "#94a3b8",
                                    letterSpacing: "0.5px",
                                    fontWeight: 700,
                                }}
                            >
                                ACCOUNT SECURITY
                            </Typography>

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: 1.2,
                                    mb: 1,
                                }}
                            >
                                <Box>
                                    <TextField
                                        size="small"
                                        name="password"
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        fullWidth
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.password && Boolean(formik.errors.password)}
                                        helperText={formik.touched.password && formik.errors.password}
                                        sx={inputSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    {formik.values.password && (
                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                ml: 0.5,
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                color: getStrengthColor(formik.values.password),
                                            }}
                                        >
                                            Password Strength: {getPasswordStrength(formik.values.password)}
                                        </Typography>
                                    )}
                                </Box>

                                <TextField
                                    size="small"
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Repeat password"
                                    fullWidth
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
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                    edge="end"
                                                    size="small"
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
                            </Box>

                            <Box
                                sx={{
                                    mt: 2,
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: "1px solid #fde68a",
                                    backgroundColor: "#fffbeb",
                                    color: "#92400e",
                                    fontSize: "13px",
                                    mb: 1.5,
                                }}
                            >
                                ⏳ <strong>Admin Verification Required:</strong> After signup
                                you'll upload your Aadhaar & ID proof. Your profile will be
                                reviewed within 24–48 hrs before going live to clients.
                            </Box>

                            <Box
                                sx={{
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 2,
                                    p: 1,
                                    mb: 1,
                                    backgroundColor: "#f8fafc",
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            name="agree"
                                            checked={formik.values.agree}
                                            onChange={formik.handleChange}
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#475569", fontSize: "13px" }}
                                        >
                                            I agree to BlueConnect's{" "}
                                            <span
                                                style={{
                                                    color: "#0554A2",
                                                    fontWeight: 600,
                                                    textDecoration: "underline",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Terms of Service
                                            </span>{" "}
                                            and{" "}
                                            <span
                                                style={{
                                                    color: "#0554A2",
                                                    fontWeight: 600,
                                                    textDecoration: "underline",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Privacy Policy
                                            </span>
                                            . I confirm all my information is accurate and genuine.
                                        </Typography>
                                    }
                                />
                            </Box>

                            {formik.touched.agree && formik.errors.agree && (
                                <Typography sx={{ color: "red", fontSize: "12px", mb: 1.5 }}>
                                    {formik.errors.agree}
                                </Typography>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={mutation.isPending}
                                sx={{
                                    py: 1.2,
                                    borderRadius: "12px",
                                    fontWeight: "bold",
                                    fontSize: "15px",
                                    textTransform: "none",
                                    background: "linear-gradient(to right, #0ea5e9, #3b82f6)",
                                    boxShadow: "none",
                                }}
                            >
                                {mutation.isPending ? (
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <CircularProgress size={18} color="inherit" />
                                        Creating Account...
                                    </Box>
                                ) : (
                                    "Create Employer Account"
                                )}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Snackbar
                open={openSuccess}
                autoHideDuration={3000}
                onClose={() => setOpenSuccess(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setOpenSuccess(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    🎉 Employer registration successful!
                </Alert>
            </Snackbar>

            <Snackbar
                open={openError}
                autoHideDuration={3000}
                onClose={() => setOpenError(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setOpenError(false)}
                    severity="error"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default EmployerRegistration;