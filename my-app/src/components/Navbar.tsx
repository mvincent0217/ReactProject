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
    List as ListIcon,
    Hotel as HotelIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState<string>("?");
    const [userRole, setUserRole] = useState<string>("user");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [ordersMenuEl, setOrdersMenuEl] = useState<null | HTMLElement>(null);
    const [reservationsMenuEl, setReservationsMenuEl] = useState<null | HTMLElement>(null);
    const [adminMenuEl, setAdminMenuEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/auth/user", {
                    withCredentials: true,
                });

                const fullName = response.data.fullName || "User";
                setUserName(fullName.charAt(0).toUpperCase());
                setUserRole(response.data.role || "user");
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);

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

    const handleOrdersMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setOrdersMenuEl(event.currentTarget);
    };

    const handleOrdersMenuClose = () => {
        setOrdersMenuEl(null);
    };

    const handleReservationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setReservationsMenuEl(event.currentTarget);
    };

    const handleReservationsMenuClose = () => {
        setReservationsMenuEl(null);
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

                {userRole === "admin" ? (
                    <>
                        <Button color="inherit" onClick={handleAdminMenuOpen} startIcon={<AdminIcon />}>
                            Admin
                        </Button>
                        <Menu anchorEl={adminMenuEl} open={Boolean(adminMenuEl)} onClose={handleAdminMenuClose}>
                            <MenuItem onClick={() => navigate("/addfood")}>
                                <AddIcon sx={{ mr: 1 }} />
                                Add Food
                            </MenuItem>
                        </Menu>
                    </>
                ) : null}

                {/* Orders Dropdown Menu */}
                <Button color="inherit" onClick={handleOrdersMenuOpen} startIcon={<RestaurantIcon />}>
                    Orders
                </Button>
                <Menu anchorEl={ordersMenuEl} open={Boolean(ordersMenuEl)} onClose={handleOrdersMenuClose}>
                    <MenuItem onClick={() => navigate("/vieworders")}>
                        <ListIcon sx={{ mr: 1 }} />
                        View Order/s
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/createorders")}>
                        <AddIcon sx={{ mr: 1 }} />
                        Create Order/s
                    </MenuItem>
                </Menu>

                {/* Reservation Dropdown Menu */}
                <Button color="inherit" onClick={handleReservationsMenuOpen} startIcon={<HotelIcon />}>
                    Reservation
                </Button>
                <Menu anchorEl={reservationsMenuEl} open={Boolean(reservationsMenuEl)} onClose={handleReservationsMenuClose}>
                    <MenuItem onClick={() => navigate("/viewreservation")}>
                        <ListIcon sx={{ mr: 1 }} />
                        View Reservation/s
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/createreservation")}>
                        <AddIcon sx={{ mr: 1 }} />
                        Create Reservation/s
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
