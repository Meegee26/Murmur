import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Landing } from "./pages/landing/Landing.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/Routes.jsx";

function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
