import { Center, Stack, Text, Button, Paper } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export function ServerError({ onRetry }) {
  return (
    <Center style={{ width: "100vw", height: "100vh" }}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        style={{ maxWidth: 400, width: "90%" }}
      >
        <Stack align="center" gap="lg">
          <IconAlertCircle
            size={80}
            stroke={1.5}
            style={{ color: "var(--mantine-color-red-6)" }}
          />

          <Stack gap="xs" style={{ width: "100%" }}>
            <Text size="xl" fw={600} ta="center">
              Unable to Connect
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              We couldn't establish a connection to the server. Please check
              your internet connection or try again later.
            </Text>
          </Stack>

          <Button onClick={onRetry} color="violet" fullWidth>
            Try Again
          </Button>
        </Stack>
      </Paper>
    </Center>
  );
}
