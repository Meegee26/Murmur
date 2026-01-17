import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5500/api/v1";
const HEALTH_ENDPOINT = API_BASE_URL.replace("/api/v1", "/health");

export const checkServerHealth = async (timeout = 5000) => {
  try {
    const response = await axios.get(HEALTH_ENDPOINT, {
      timeout,
    });
    return response.status === 200;
  } catch (error) {
    console.log("Health check failed:", error.message);
    return false;
  }
};

export const waitForServerWakeup = async (
  maxAttempts = 12,
  intervalMs = 5000,
) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Health check attempt ${attempt}/${maxAttempts}`);

    const isHealthy = await checkServerHealth(10000);

    if (isHealthy) {
      console.log("Server is healthy!");
      return true;
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  return false;
};
