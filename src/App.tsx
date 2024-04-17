import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { useQuery } from "@tanstack/react-query";

//Pages
import ErrorPage from "./pages/ErrorPage.tsx";
import UsersIndex from "./pages/Users/Index.tsx";
import LoginPage from "./pages/Login.tsx";
import { getMe, setAxiosAuthHeader } from "./api/auth.ts";
import Layout from "./components/Layout.tsx";
import { useEffect, useState } from "react";

//Context
import { NotificationProvider } from "./context/NotificationContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute component={<Layout />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <UsersIndex />,
      },
      {
        path: "/users",
        element: <UsersIndex />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    enabled: !!token,
  });

  const logout = () => {
    localStorage.removeItem("jwt");
    setUser(null);
    setToken("");
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setAxiosAuthHeader(jwt);
      setToken(jwt);
    }
  }, [token]);

  useEffect(() => {
    if (data?.data?.data?.user) {
      setUser(data?.data?.data?.user);
    }
  }, [data]);

  return (
    <>
      <AuthProvider
        isSignedIn={user !== null}
        user={user}
        setToken={setToken}
        logout={logout}
      >
        <NotificationProvider>
          <RouterProvider router={router} />
        </NotificationProvider>
      </AuthProvider>
    </>
  );
}

export default App;
