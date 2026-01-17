import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/Routes.jsx";
import { Notifications } from "@mantine/notifications";
import { checkServerHealth, waitForServerWakeup } from "./utils/healthCheck.js";
import { useEffect, useState } from "react";
import { ServerWaking } from "./components/ServerWaking.jsx";
import { ServerError } from "./components/ServerError.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function AppContent() {
  const [serverStatus, setServerStatus] = useState("checking");

  useEffect(() => {
    const checkServer = async () => {
      const isHealthy = await checkServerHealth();

      if (isHealthy) {
        setServerStatus("ready");
      } else {
        setServerStatus("waking");
        const wokenUp = await waitForServerWakeup();

        if (wokenUp) {
          setServerStatus("ready");
        } else {
          setServerStatus("error");
        }
      }
    };

    checkServer();
  }, []);

  const handleRetry = async () => {
    const isHealthy = await checkServerHealth();

    if (isHealthy) {
      setServerStatus("ready");
    } else {
      if (serverStatus === "error") {
        setServerStatus("waking");
        const wokenUp = await waitForServerWakeup();
        setServerStatus(wokenUp ? "ready" : "error");
      }
    }
  };

  if (serverStatus === "checking" || serverStatus === "waking") {
    return <ServerWaking onRetry={handleRetry} />;
  }

  if (serverStatus === "error") {
    return <ServerError onRetry={handleRetry} />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="en-US">
      <MantineProvider>
        <Notifications position="bottom-right" autoClose={3000} zIndex={1000} />
        <AppContent />
      </MantineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
