import "@mantine/core/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/Routes.jsx";
import { Notifications } from "@mantine/notifications";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="en-US">
      <MantineProvider>
        <Notifications position="bottom-right" autoClose={3000} zIndex={1000} />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </MantineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
