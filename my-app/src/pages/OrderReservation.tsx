import React, { useState, useEffect } from "react";
import {
    Container, Typography, Box, Button, MenuItem, Select, SelectChangeEvent, CircularProgress
} from "@mui/material";
import axios from "axios";
import Navbar from "../components/Navbar";

interface FoodItem {
    id: number;
    name: string;
}

const FoodReservation: React.FC = () => {
    const [food, setFood] = useState<string>("");
    const [foodList, setFoodList] = useState<FoodItem[]>([]);
    const [userName, setUserName] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch food items
                const foodResponse = await axios.get("http://localhost:5000/api/orders/getfooditems");
                setFoodList(foodResponse.data);

                // Fetch logged-in user's name
                const userResponse = await axios.get("http://localhost:5000/api/auth/user", { withCredentials: true });
                setUserName(userResponse.data.fullName);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (event: SelectChangeEvent) => {
        setFood(event.target.value);
    };

    const handleSubmit = async () => {
        console.log("click reserve")
        if (!food) {
            alert("Please select a food item!");
            return;
        }

        try {
            const selectedFood = foodList.find(item => item.name === food);
            console.log(selectedFood)
            if (!selectedFood) return;

            await axios.post("http://localhost:5000/api/orders/reserve", {
                user_fullname: userName,
                food_id: selectedFood.id,
            });

            alert(`Reservation successful: ${food}`);
            setFood("");
        } catch (error) {
            console.error("Error reserving food:", error);
            alert("Failed to reserve food.");
        }
    };

    return (
        <>
            <Navbar />
            <Container>
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        Food Reservation
                    </Typography>

                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            <Select value={food} onChange={handleChange} displayEmpty sx={{ mb: 2, width: "200px" }}>
                                <MenuItem value="" disabled>Select Food</MenuItem>
                                {foodList.map((item) => (
                                    <MenuItem key={item.id} value={item.name}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <br />
                            <Button variant="contained" color="primary" onClick={handleSubmit}>
                                Reserve
                            </Button>
                        </>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default FoodReservation;
export { FoodReservation }
