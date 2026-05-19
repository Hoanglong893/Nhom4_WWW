import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const getRoles = (decodedToken) => {
  const rawRoles = [
    decodedToken.scope,
    decodedToken.role,
    decodedToken.authorities,
    decodedToken.roles,
  ].flatMap((role) => (Array.isArray(role) ? role : [role]));

  return rawRoles
    .filter(Boolean)
    .flatMap((role) => role.toString().split(/\s+/))
    .map((role) => role.toUpperCase());
};

const UserOnlyRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return children;
  }

  try {
    const decodedToken = jwtDecode(token);
    const roles = getRoles(decodedToken);

    if (roles.some((role) => role.includes("ADMIN"))) {
      return <Navigate to="/admin" replace />;
    }

    return children;
  } catch (error) {
    console.error("Token không hợp lệ hoặc đã hết hạn:", error);
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" replace />;
  }
};

export default UserOnlyRoute;
