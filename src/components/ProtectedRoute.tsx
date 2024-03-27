import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactElement, useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: ReactElement }) {
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return Component;
}

export default ProtectedRoute;
