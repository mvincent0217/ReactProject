import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {
    Container, TextField, Button, Box, Typography, Paper, Stack,
    Alert, CircularProgress, IconButton, InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useCookies } from 'react-cookie';

// ✅ Validation Schema
const schema = yup.object({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
}).required();

type FormData = {
    email: string;
    password: string;
};


const Login: React.FC = () => {
    const [cookies, setCookie] = useCookies(['token'])
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("userToken")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", data);
            setCookie("token", response.data.token)
            navigate("/dashboard");
        } catch (error: unknown) {
            const err = error as AxiosError<{ message: string }>;
            setErrorMessage(err.response?.data?.message || "Login failed. Try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>

                {/* ✅ Show Error Message */}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email"
                                variant="outlined"
                                fullWidth
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
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
                                            <IconButton onClick={togglePasswordVisibility} edge="end">
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Stack spacing={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : "Login"}
                        </Button>
                        <Button variant="outlined" color="secondary" fullWidth onClick={() => navigate("/register")}>
                            Register
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
export { Login };
