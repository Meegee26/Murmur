import "./App.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <MantineProvider>
        <p>RENDER APP HERE</p>
      </MantineProvider>
    </AuthProvider>
  );
}

export default App;
