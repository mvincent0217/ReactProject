import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
} from "@mui/material";
import {
    Home as HomeIcon,
    Restaurant as RestaurantIcon,
    AdminPanelSettings as AdminIcon,
    Add as AddIcon,
    AccountCircle as ProfileIcon,
    Logout as LogoutIcon,
    List as ListIcon
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>("?");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [ordersMenuEl, setOrdersMenuEl] = useState<null | HTMLElement>(null);
    const [adminMenuEl, setAdminMenuEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/auth/user", {
                    withCredentials: true,
                });

                const fullName = response.data.fullName || "User";
                setUserName(fullName.charAt(0).toUpperCase());
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

    // Profile Menu Handlers
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        navigate("/profile");
        handleMenuClose();
    };

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
        handleMenuClose();
    };

    // Orders Menu Handlers
    const handleOrdersMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setOrdersMenuEl(event.currentTarget);
    };

    const handleOrdersMenuClose = () => {
        setOrdersMenuEl(null);
    };

    const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAdminMenuEl(event.currentTarget);
    };

    const handleAdminMenuClose = () => {
        setAdminMenuEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    🍭Candy Motel🍭
                </Typography>
                <Button color="inherit" component={Link} to="/dashboard" startIcon={<HomeIcon />}>
                    Dashboard
                </Button>

                <Button color="inherit" onClick={handleAdminMenuOpen} startIcon={<AdminIcon />}>
                    Admin
                </Button>
                <Menu anchorEl={adminMenuEl} open={Boolean(adminMenuEl)} onClose={handleAdminMenuClose}>
                    <MenuItem onClick={() => navigate("/addfood")}>
                        <AddIcon sx={{ mr: 1 }} />
                        Add Food
                    </MenuItem>
                </Menu>

                {/* Orders Dropdown Menu */}
                <Button color="inherit" onClick={handleOrdersMenuOpen} startIcon={<RestaurantIcon />}>
                    Orders
                </Button>
                <Menu anchorEl={ordersMenuEl} open={Boolean(ordersMenuEl)} onClose={handleOrdersMenuClose}>
                    <MenuItem onClick={() => navigate("/viewreservations")}>
                        <ListIcon sx={{ mr: 1 }} />
                        View Reservation
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/foodreservation")}>
                        <AddIcon sx={{ mr: 1 }} />
                        Add Reservation
                    </MenuItem>
                </Menu>

                {/* Avatar with Dropdown Menu */}
                <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                    <Avatar>{userName}</Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={handleProfile}>
                        <ProfileIcon sx={{ mr: 1 }} />
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1 }} />
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
