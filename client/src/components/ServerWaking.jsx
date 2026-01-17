import {
  Center,
  Stack,
  Text,
  Progress,
  Button,
  Paper,
  Alert,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconClock, IconInfoCircle } from "@tabler/icons-react";

export function ServerWaking({ onRetry, onCancel }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Waking up the server...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 5;
      });
    }, 500);

    const messageTimeout = setTimeout(() => {
      setMessage("This may take up to a minute on first load...");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(messageTimeout);
    };
  }, []);

  return (
    <Center style={{ width: "100vw", height: "100vh", padding: "1rem" }}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        style={{ maxWidth: 500, width: "100%" }}
      >
        <Stack align="center" gap="lg">
          <IconClock
            size={80}
            stroke={1.5}
            style={{ color: "var(--mantine-color-violet-6)" }}
          />

          <Stack gap="xs" style={{ width: "100%" }}>
            <Text size="xl" fw={600} ta="center">
              Server is Starting
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              {message}
            </Text>
          </Stack>

          <Progress
            value={progress}
            animated
            color="violet"
            size="sm"
            style={{ width: "100%" }}
          />

          <Alert
            variant="light"
            color="blue"
            icon={<IconInfoCircle size={20} />}
            styles={{
              root: { width: "100%" },
              message: { fontSize: "0.875rem" },
            }}
          >
            This is a portfolio project using free-tier hosting. The backend is
            hosted on Render, which automatically sleeps after periods of
            inactivity to conserve resources. The server will be ready shortly.
          </Alert>

          <Stack gap="xs" style={{ width: "100%" }}>
            <Button onClick={onRetry} variant="light" color="violet" fullWidth>
              Check Now
            </Button>
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="subtle"
                color="gray"
                size="sm"
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Center>
  );
}
