import "@mantine/core/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/Routes.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <MantineProvider>
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
