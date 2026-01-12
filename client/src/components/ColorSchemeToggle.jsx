import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Group,
  Tooltip,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <Group justify="center" py="xl">
      <Tooltip
        label={`Switch to ${
          computedColorScheme === "light" ? "dark" : "light"
        } mode`}
        position="bottom"
      >
        <ActionIcon
          onClick={() =>
            setColorScheme(computedColorScheme === "light" ? "dark" : "light")
          }
          variant="default"
          size="xl"
          aria-label="Toggle color scheme"
        >
          {computedColorScheme === "light" ? (
            <IconMoon stroke={1.5} />
          ) : (
            <IconSun stroke={1.5} />
          )}
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
