import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { Login, Register, Dashboard, ViewOrders, Profile, CreateReservation, CreateOrders, AddFood, ViewReservation } from './pages'
import { CookiesProvider } from 'react-cookie';

const App: React.FC = () => {
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Public Route */}
          <Route path="/register" element={<Register />} />

          {/* Private Route (Protected) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Private Route (Protected) */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Private Route (Protected) */}
          <Route element={<PrivateRoute />}>
            <Route path="/addfood" element={<AddFood />} />
          </Route>

          {/* Private Route (Protected) */}
          <Route element={<PrivateRoute />}>
            <Route path="/createorders" element={<CreateOrders />} />
          </Route>

          {/* Private Route (Protected) */}
          <Route element={<PrivateRoute />}>
            <Route path="/vieworders" element={<ViewOrders />} />
          </Route>

          {/* Private Route (Protected) */}
          <Route element={<PrivateRoute />}>
            <Route path="/createreservation" element={<CreateReservation />} />
          </Route>

          {/* Private Route (Protected) */}
          <Route element={<PrivateRoute />}>
            <Route path="/viewreservation" element={<ViewReservation />} />
          </Route>


          {/* Default Route (Redirect to Login) */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </CookiesProvider>
  );
};

export default App;
