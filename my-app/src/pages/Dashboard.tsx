import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, CircularProgress, Box, Card, CardMedia, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
// @ts-ignore
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";


// Sample data for hotel services
const showcaseItems = [
    {
        title: "Luxury Suite",
        description: "Experience the finest luxury with stunning city views.",
        image: "/images/room1.jpg",
        price: "$250/night"
    },
    {
        title: "Fine Dining",
        description: "Savor gourmet dishes prepared by our world-class chefs.",
        image: "/images/food1.jpg",
        price: "Starting at $30"
    },
    {
        title: "Relaxing Spa",
        description: "Enjoy a rejuvenating experience at our premium spa.",
        image: "/images/spa1.jpg",
        price: "$100/session"
    }
];

const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get("http://localhost:5000/api/auth/user", { withCredentials: true });
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
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
            <Navbar />
            <Container>
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to Our Luxury Hotel
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mb: 3 }}>
                        Explore our premium services designed for your comfort and relaxation.
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Carousel
                            autoPlay
                            infiniteLoop
                            showThumbs={false}
                            showStatus={false}
                            dynamicHeight={false}
                            width="100%"
                        >
                            {showcaseItems.map((item, index) => (
                                <Card key={index} sx={{ maxWidth: "1200px", mx: "auto", my: 2, borderRadius: 3 }}>
                                    <CardMedia
                                        component="img"
                                        height="500"
                                        image={item.image}
                                        alt={item.title}
                                        sx={{ borderRadius: "12px 12px 0 0", objectFit: "cover" }}
                                    />
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="h6" sx={{ mb: 1, color: "gray" }}>
                                            {item.description}
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            {item.price}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Carousel>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Dashboard;
export { Dashboard };
