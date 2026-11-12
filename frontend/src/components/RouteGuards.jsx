import { Navigate, Outlet } from "react-router-dom";
import { getAuth, homeFor } from "../utils/auth";
 
export function PublicOnly() {
  const auth = getAuth();
  return auth ? <Navigate to={homeFor(auth.role)} replace /> : <Outlet />;
}

// Sirf given role ke liye
export function RequireRole({ role }) {
  const auth = getAuth();

  if (!auth) return <Navigate to="/" replace />;                    
  if (auth.role !== role) return <Navigate to={homeFor(auth.role)} replace />;  

  return <Outlet />;
}