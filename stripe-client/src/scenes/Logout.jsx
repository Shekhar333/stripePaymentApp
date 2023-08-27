import React from "react";
import { logout } from "../auth";
import { Navigate, useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  logout();

  return <Navigate to="/" />;
}

export default Logout;
