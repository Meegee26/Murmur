import {
  Button,
  Container,
  Title,
  Stack,
  Group,
  Text,
  Avatar,
  Paper,
  Divider,
  Box,
  rem,
} from "@mantine/core";
import { IconLogout, IconMessage2 } from "@tabler/icons-react";
import { useAuth } from "../../hooks/useAuth.js";
import { useState } from "react";

export function Chat() {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const firstName = user?.firstName || "User";
  const lastName = user?.lastName || "";
  const avatarUrl = user?.avatar;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Stack gap="xl">
          <Group justify="space-between" align="flex-start">
            <Group gap="lg">
              <Avatar
                src={avatarUrl}
                size={70}
                radius="xl"
                color="violet"
                variant="light"
                style={{
                  border: "2px solid var(--mantine-color-violet-light)",
                }}
              >
                {firstName[0]}
                {lastName[0]}
              </Avatar>

              <Stack gap={0}>
                <Title order={2} fw={800} lts={-0.5}>
                  {firstName} {lastName}
                </Title>
                <Text size="sm" c="dimmed" fw={500}>
                  {user?.email}
                </Text>
              </Stack>
            </Group>

            <Button
              color="red"
              variant="subtle"
              leftSection={<IconLogout size={16} />}
              onClick={handleLogout}
              loading={isLoggingOut}
              radius="md"
            >
              Logout
            </Button>
          </Group>

          <Divider
            label={
              <Group gap="xs">
                <IconMessage2 size={16} />
                <Text size="xs" fw={700}>
                  MESSAGES
                </Text>
              </Group>
            }
            labelPosition="left"
          />

          <Box
            mih={400}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.02)",
              borderRadius: rem(8),
              border: "1px dashed var(--mantine-color-gray-3)",
            }}
          >
            <Text c="dimmed" italic size="sm">
              Your conversations will appear here soon.
            </Text>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
