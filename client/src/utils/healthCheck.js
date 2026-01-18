import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5500/api/v1";
const HEALTH_ENDPOINT = API_BASE_URL.replace("/api/v1", "/health");

export const checkServerHealth = async (timeout = 30000) => {
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
  maxAttempts = 20,
  initialIntervalMs = 3000,
  onProgress = null,
) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`Health check attempt ${attempt}/${maxAttempts}`);

    if (onProgress) {
      onProgress(attempt, maxAttempts);
    }

    const isHealthy = await checkServerHealth(30000);

    if (isHealthy) {
      console.log("Server is healthy!");
      return true;
    }

    if (attempt < maxAttempts) {
      const waitTime = Math.min(
        initialIntervalMs * Math.pow(1.2, attempt - 1),
        15000,
      );
      console.log(
        `Waiting ${Math.round(waitTime / 1000)}s before next attempt...`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  return false;
};
