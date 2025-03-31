import NavBar from "@/components/navbar";
import { RootState } from "@/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children ? (
    children
  ) : (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default ProtectedRoute;
