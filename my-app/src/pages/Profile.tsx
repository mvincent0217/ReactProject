import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { type userEnum } from '@/types';
import Navbar from "../components/Navbar";

const Profile: React.FC = () => {
    const [user, setUser] = useState<userEnum | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/auth/user", {
                    withCredentials: true,
                });

                const userData: userEnum = {
                    full_name: response.data.fullName,
                    email: response.data.email,
                };
                setUser(userData);
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    if (loading) {
        return (
            <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <>
            <Navbar /> { }
            <Container>
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        This is Profile Page
                    </Typography>
                </Box>
            </Container>
        </>
    );
};

export default Profile;
export { Profile }
