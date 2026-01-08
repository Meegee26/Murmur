import {
  Container,
  Group,
  Text,
  ActionIcon,
  Box,
  Stack,
  Tooltip,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBriefcase,
} from "@tabler/icons-react";

export function Footer() {
  return (
    <Box
      component="footer"
      py="xl"
      bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-8))"
      style={{
        borderTop: `1px solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))`,
      }}
    >
      <Container size="90%">
        <Group justify="space-between">
          <Stack gap={2}>
            <Text size="sm" c="dimmed" fw={500}>
              © {new Date().getFullYear()} Murmur
            </Text>
            <Text size="xs" c="dimmed">
              Last Updated: {import.meta.env.VITE_APP_BUILD_DATE}
            </Text>
          </Stack>

          <Group gap="xs">
            <Text size="xs" c="dimmed" fw={500} mr="xs" visibleFrom="sm">
              Built by Migz.Dev
            </Text>
            <Tooltip label="Github">
              <ActionIcon
                size="lg"
                color="gray"
                variant="subtle"
                radius="xl"
                component="a"
                href="https://github.com/Meegee26"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandGithub size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="LinkedIn">
              <ActionIcon
                size="lg"
                color="gray"
                variant="subtle"
                radius="xl"
                component="a"
                href="https://www.linkedin.com/in/meegee26/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandLinkedin size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Online Portfolio">
              <ActionIcon
                size="lg"
                color="gray"
                variant="subtle"
                radius="xl"
                component="a"
                href="https://migz-dev.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBriefcase size={18} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
