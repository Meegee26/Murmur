import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  List,
  ThemeIcon,
  rem,
  SimpleGrid,
  Badge,
  Paper,
  Avatar,
  Box,
  Indicator,
} from "@mantine/core";
import { IconCheck, IconArrowRight, IconShieldLock } from "@tabler/icons-react";

export function Hero() {
  return (
    <Container size="xl" pt={50}>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={80} verticalSpacing={50}>
        <Stack gap="xl" justify="center">
          <div>
            <Badge
              variant="light"
              size="lg"
              radius="xl"
              color="violet"
              mb="md"
              leftSection={<IconShieldLock size={14} />}
            >
              Fast & Secure Messaging
            </Badge>

            <Title
              order={1}
              style={{
                fontSize: rem(54),
                fontWeight: 900,
                lineHeight: 1.1,
              }}
            >
              Message anyone,{" "}
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: "indigo.5", to: "grape.5" }}
                inherit
              >
                anywhere, in real-time.
              </Text>
            </Title>

            <Text c="dimmed" mt="md" size="lg" style={{ maxWidth: 480 }}>
              Stay close to your favorite people with high-speed messaging and
              seamless file sharing. No delays, just connection.
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl" color="violet.6">
                  <IconCheck size={12} stroke={2} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Lightning Fast</b> - Messages delivered the moment you hit
                send
              </List.Item>
              <List.Item>
                <b>Private & Secure</b> - Your conversations are for your eyes
                only
              </List.Item>
              <List.Item>
                <b>Always Synced</b> - Pick up right where you left off on any
                device
              </List.Item>
            </List>
          </div>

          <Group gap="md">
            <Button
              size="xl"
              radius="md"
              color="violet.6"
              rightSection={<IconArrowRight size={20} />}
              style={{ boxShadow: "0 10px 15px -3px rgba(121, 80, 242, 0.3)" }}
            >
              Start Chatting
            </Button>
          </Group>
        </Stack>

        <Stack justify="center" align="center">
          <Paper
            shadow="xl"
            radius="lg"
            withBorder
            p="xl"
            w="100%"
            maw={440}
            bg="var(--mantine-color-body)"
            style={{
              transform: "perspective(1000px) rotateY(-8deg) rotateX(4deg)",
              borderWidth: rem(2),
            }}
          >
            <Group mb="xl" justify="space-between">
              <Group gap="sm">
                <Indicator
                  inline
                  size={12}
                  offset={2}
                  position="bottom-end"
                  color="teal"
                  withBorder
                >
                  <Avatar
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                    alt="Juan"
                    radius="xl"
                    size="md"
                  />
                </Indicator>
                <div>
                  <Text size="sm" fw={700}>
                    Juan Dela Cruz
                  </Text>
                  <Text size="xs" c="dimmed">
                    Active now
                  </Text>
                </div>
              </Group>
            </Group>

            <Stack gap="md">
              <Box
                bg="gray.1"
                p="md"
                style={{
                  borderRadius: "16px 16px 16px 4px",
                  alignSelf: "flex-start",
                  maxWidth: "85%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                }}
              >
                <Text size="sm" c="dark.7">
                  Yo! Are you coming to the watch party tonight? 🍿
                </Text>
              </Box>

              <Box
                bg="violet.6"
                p="md"
                style={{
                  borderRadius: "16px 16px 4px 16px",
                  alignSelf: "flex-end",
                  maxWidth: "85%",
                  boxShadow: "0 4px 12px rgba(121, 80, 242, 0.2)",
                }}
              >
                <Text size="sm" c="white">
                  Wouldn't miss it! Just grabbing some drinks first. Want
                  anything specific?
                </Text>
              </Box>

              <Box
                bg="gray.1"
                p="md"
                style={{
                  borderRadius: "16px 16px 16px 4px",
                  alignSelf: "flex-start",
                  maxWidth: "85%",
                }}
              >
                <Text size="sm" c="dark.7">
                  Just some iced tea would be awesome. See you in 10! 🙌
                </Text>
              </Box>

              <Text size="xs" c="dimmed" mt={4} italic>
                Juan is typing...
              </Text>
            </Stack>

            <Group mt={30} gap="xs">
              <Box
                h={44}
                style={{
                  flex: 1,
                  background: "var(--mantine-color-gray-0)",
                  borderRadius: 12,
                  border: "1px solid var(--mantine-color-gray-3)",
                }}
              />
              <Button
                color="violet.6"
                radius="md"
                h={44}
                px="md"
                style={{ pointerEvents: "none" }}
              >
                Send
              </Button>
            </Group>
          </Paper>
        </Stack>
      </SimpleGrid>
    </Container>
  );
}
