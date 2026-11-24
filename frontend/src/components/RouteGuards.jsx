import { Navigate, Outlet } from "react-router-dom";

const getAuthInfo = () => {
  const token = localStorage.getItem("token");
  const directRole = localStorage.getItem("role");

  let parsedUser = null;
  try {
    const rawUser = localStorage.getItem("user");
    parsedUser = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    parsedUser = null;
  }

  const role = parsedUser?.role || directRole || null;
  return { token, role };
};

export const PublicOnly = () => {
  const { token, role } = getAuthInfo();

  if (token && role) {
    return (
      <Navigate
        to={role === "driver" ? "/driver/availableRides" : "/passenger/bookRide"}
        replace
      />
    );
  }

  return <Outlet />;
};

export const RequireRole = ({ role: requiredRole }) => {
  const { token, role } = getAuthInfo();

  if (!token || !role) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};