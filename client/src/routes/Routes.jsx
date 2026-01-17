import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Landing } from "../pages/landing/Landing.jsx";
import { NotFound } from "../pages/error/NotFound.jsx";
import { Chat } from "../pages/chat/Chat.jsx";
import { Center, Loader, Stack, Text } from "@mantine/core";

const FullPageLoader = () => (
  <Center style={{ width: "100vw", height: "100vh" }}>
    <Stack align="center" gap="sm">
      <Loader color="violet" size="xl" type="bars" />
      <Text size="sm" c="dimmed" fw={500}>
        Syncing your messages...
      </Text>
    </Stack>
  </Center>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader />;

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />

      <Route
        path="/chat/:chatId?"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
