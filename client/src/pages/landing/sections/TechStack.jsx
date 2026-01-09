import {
  Container,
  Text,
  Title,
  SimpleGrid,
  ThemeIcon,
  Card,
  Stack,
  rem,
  Badge,
  Box,
  Group,
} from "@mantine/core";
import {
  IconBrandReact,
  IconBrandVite,
  IconBrandNodejs,
  IconBrandMongodb,
  IconBrandSocketIo,
  IconLock,
  IconCloud,
  IconComponents,
} from "@tabler/icons-react";

const DATA = [
  {
    title: "React 19",
    category: "Frontend",
    icon: IconBrandReact,
    color: "blue",
  },
  {
    title: "Node.js",
    category: "Backend",
    icon: IconBrandNodejs,
    color: "green",
  },
  {
    title: "MongoDB",
    category: "Database",
    icon: IconBrandMongodb,
    color: "teal",
  },
  {
    title: "Socket.io",
    category: "Real-time",
    icon: IconBrandSocketIo,
    color: "dark",
  },
  {
    title: "Mantine",
    category: "UI/UX",
    icon: IconComponents,
    color: "indigo",
  },
  { title: "Vite", category: "Tooling", icon: IconBrandVite, color: "yellow" },
  {
    title: "Cloudinary",
    category: "Storage",
    icon: IconCloud,
    color: "orange",
  },
  { title: "JWT Auth", category: "Security", icon: IconLock, color: "red" },
];

export function TechStack() {
  return (
    <Box
      pos="relative"
      py={100}
      style={{ overflow: "hidden" }}
      bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-9))"
    >
      <Box
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: rem(400),
          height: rem(400),
          background:
            "radial-gradient(circle, var(--mantine-color-violet-light) 0%, transparent 70%)",
          filter: "blur(60px)",
          opacity: 0.4,
          zIndex: 0,
        }}
      />

      <Container size="lg" pos="relative" style={{ zIndex: 1 }}>
        <Stack align="center" mb={50}>
          <Group justify="center">
            <Badge variant="light" color="violet" size="lg" radius="sm">
              Technology
            </Badge>
          </Group>
          <Title order={2} ta="center" fz={{ base: 32, md: 42 }} fw={900}>
            Powering the{" "}
            <Text
              component="span"
              variant="gradient"
              gradient={{ from: "indigo.4", to: "violet.4" }}
              inherit
            >
              Future of Chat
            </Text>
          </Title>
          <Text c="dimmed" ta="center" maw={600} fz="lg">
            Murmur is built on a high-performance stack designed for scale,
            security, and sub-millisecond latency.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="lg">
          {DATA.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                padding="xl"
                radius="lg"
                withBorder
                style={{
                  transition: "all 0.3s ease",
                  cursor: "default",
                  backgroundColor:
                    "light-dark(rgba(255,255,255,0.8), rgba(26,27,30,0.4))",
                  backdropFilter: "blur(10px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "var(--mantine-shadow-xl)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Stack align="center" gap="sm">
                  <ThemeIcon
                    size={60}
                    radius="md"
                    variant="light"
                    color={item.color}
                  >
                    <Icon
                      style={{ width: rem(32), height: rem(32) }}
                      stroke={1.5}
                    />
                  </ThemeIcon>

                  <Stack gap={2} align="center">
                    <Text fw={700} size="md" ta="center">
                      {item.title}
                    </Text>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase">
                      {item.category}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
