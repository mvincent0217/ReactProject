import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from 'react-cookie';

const PrivateRoute = () => {
    const [cookies, setCookie] = useCookies(['token'])
    const token = cookies.token
    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
