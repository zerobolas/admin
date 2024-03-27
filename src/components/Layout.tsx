import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function Layout() {
  const { isSignedIn } = useAuth();
  console.log("🚀 ~ Layout ~ isSignedIn:", isSignedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login");
    }
  }, [isSignedIn, navigate]);

  return (
    <>
      <header>Header</header>
      <aside>Aside</aside>
      <Outlet />
    </>
  );
}

export default Layout;
