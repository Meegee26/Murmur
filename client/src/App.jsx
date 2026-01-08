import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Landing } from "./pages/landing/Landing.jsx";

function App() {
  return (
    <MantineProvider>
      <AuthProvider>
        <Landing />
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
