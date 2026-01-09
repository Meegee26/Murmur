import { Container, Group, Text, rem, Box, Image } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { ColorSchemeToggle } from "../../components/ColorSchemeToggle.jsx";
import logoIcon from "../../assets/images/icon.png";

export function Header() {
  const [scroll] = useWindowScroll();

  const headerHeight = 80;

  return (
    <Box
      component="header"
      style={{
        height: rem(headerHeight),
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        transition: "all 200ms ease",

        backgroundColor:
          scroll.y > 0
            ? "light-dark(rgba(255, 255, 255, 0.9), rgba(26, 27, 30, 0.9))"
            : "transparent",
        backdropFilter: scroll.y > 0 ? "blur(10px)" : "none",
        borderBottom:
          scroll.y > 0
            ? `${rem(
                1
              )} solid light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4))`
            : "1px solid transparent",
      }}
    >
      <Container size="xl" w="100%">
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="xs" align="center">
            <Image
              src={logoIcon}
              alt="Murmur Logo"
              h={45}
              w="auto"
              style={{ display: "block" }}
            />
            <Text
              fw={900}
              variant="gradient"
              gradient={{ from: "indigo.6", to: "grape.6" }}
              style={{
                fontSize: rem(38),
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                letterSpacing: rem(-1),
              }}
            >
              Murmur
            </Text>
          </Group>

          <Group align="center">
            <ColorSchemeToggle />
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
