import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, IconButton } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import Navbar from "../../components/Navbar";

const AddFood: React.FC = () => {
    const [foodNames, setFoodNames] = useState<string[]>([""]); // Initialize with one input
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Handle food name input change
    const handleFoodNameChange = (index: number, value: string) => {
        const newFoodNames = [...foodNames];
        newFoodNames[index] = value;
        setFoodNames(newFoodNames);
    };

    // Add a new empty food name input
    const handleAddField = () => {
        setFoodNames([...foodNames, ""]);
    };

    // Remove a food name input
    const handleRemoveField = (index: number) => {
        if (foodNames.length === 1) return; // Prevent removing the last input
        const newFoodNames = foodNames.filter((_, i) => i !== index);
        setFoodNames(newFoodNames);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validFoodNames = foodNames.filter(name => name.trim() !== "");

        if (validFoodNames.length === 0) {
            alert("Please enter at least one food name");
            return;
        }

        try {
            setLoading(true);
            await axios.post("http://localhost:5000/api/foods/add", { names: validFoodNames });

            alert("Foods added successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error adding foods:", error);
            alert("Failed to add foods.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm">
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        Add Foods :D
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        {foodNames.map((foodName, index) => (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <TextField
                                    label={`Food Name ${index + 1}`}
                                    variant="outlined"
                                    fullWidth
                                    value={foodName}
                                    onChange={(e) => handleFoodNameChange(index, e.target.value)}
                                />
                                {foodNames.length > 1 && (
                                    <IconButton onClick={() => handleRemoveField(index)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        <Button onClick={handleAddField} variant="outlined" startIcon={<AddIcon />} sx={{ mb: 2 }}>
                            Add More
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Foods"}
                        </Button>
                    </form>
                </Box>
            </Container>
        </>
    );
};

export default AddFood;
export { AddFood };
