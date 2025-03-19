import React, { useState, useEffect } from "react";
import {
    Container, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import axios from "axios";
import Navbar from "../../components/Navbar";

interface Reservation {
    id: number;
    user_fullname: string;
    food_name: string;
    reservation_time: string;
}

const ViewReservation: React.FC = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [userName, setUserName] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch logged-in user's name
                const userResponse = await axios.get("http://localhost:5000/api/auth/user", { withCredentials: true });
                const fullName = userResponse.data.fullName;
                setUserName(fullName);

                // Fetch reservations for the logged-in user
                const reservationResponse = await axios.get("http://localhost:5000/api/orders/getuserreservations", {
                    params: { user_fullname: fullName }
                });
                setReservations(reservationResponse.data);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Navbar />
            <Container>
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        Your Reservation
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Food Name</TableCell>
                                    <TableCell>Reservation Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reservations.length > 0 ? (
                                    reservations.map((res) => (
                                        <TableRow key={res.id}>
                                            <TableCell>{res.id}</TableCell>
                                            <TableCell>{res.food_name}</TableCell>
                                            <TableCell>{new Date(res.reservation_time).toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No reservations found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </>
    );
};

export default ViewReservation;
export { ViewReservation }