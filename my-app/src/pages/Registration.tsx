import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
    Container, TextField, Button, Box, Typography, Paper,
    IconButton, InputAdornment, CircularProgress, Alert,
    Stack, Snackbar
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// ✅ Validation Schema
const schema = yup.object({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    address: yup.string().required("Address is required"),
}).required();

type FormData = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    address: string;
};

const Register: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", data);

            console.log("✅ Registration Successful:", response.data);
            setOpenSnackbar(true); // ✅ Show success message

            // ✅ Store JWT if required
            // localStorage.setItem("userToken", response.data.token);

            setTimeout(() => navigate("/"), 2000); // ✅ Redirect to login after 2s
        } catch (error: unknown) {
            // ✅ Fix TypeScript "error is unknown" issue
            const err = error as AxiosError<{ message: string }>;
            setErrorMessage(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Register
                </Typography>

                {/* ✅ Show Error Message */}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Controller
                        name="fullName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="Full Name" variant="outlined" fullWidth error={!!errors.fullName} helperText={errors.fullName?.message} />
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="Email" variant="outlined" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                variant="outlined"
                                fullWidth
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="address"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="Address" variant="outlined" fullWidth error={!!errors.address} helperText={errors.address?.message} />
                        )}
                    />

                    <Stack spacing={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Register"}
                        </Button>
                        <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate("/")}>
                            Back
                        </Button>
                    </Stack>
                </Box>

                {/* ✅ Snackbar for success message */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    message="✅ Registration successful!"
                />
            </Paper>
        </Container>
    );
};

export default Register;
export { Register }