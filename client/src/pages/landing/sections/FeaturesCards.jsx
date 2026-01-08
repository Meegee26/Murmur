import {
  IconMailFast,
  IconShieldCheck,
  IconDevices,
} from "@tabler/icons-react";
import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
  rem,
} from "@mantine/core";
import classes from "./FeaturesCards.module.css";

const mockdata = [
  {
    title: "Real-Time Delivery",
    description:
      "Experience zero-latency messaging. Powered by optimized WebSockets, your messages are delivered and read receipts are updated the millisecond they happen.",
    icon: IconMailFast,
    color: "indigo",
  },
  {
    title: "Private by Design",
    description:
      "Your conversations are your business. We use industry-standard encryption to ensure that your data stays between you and the people you trust.",
    icon: IconShieldCheck,
    color: "grape",
  },
  {
    title: "Multi-Device Sync",
    description:
      "Seamlessly switch between your phone, tablet, and desktop. Your message history is always perfectly synced and available anywhere.",
    icon: IconDevices,
    color: "violet",
  },
];

export function FeaturesCards() {
  const theme = useMantineTheme();

  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
      style={{
        backgroundColor: `light-dark(var(--mantine-color-${feature.color}-light), var(--mantine-color-dark-6))`,
        border: `1px solid light-dark(var(--mantine-color-${feature.color}-light-hover), var(--mantine-color-dark-4))`,
      }}
    >
      <feature.icon
        style={{ width: rem(50), height: rem(50) }}
        stroke={1.5}
        color={theme.colors[feature.color][6]}
      />
      <Text fz="lg" fw={700} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm" lh={1.6}>
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py={80}>
      <Group justify="center">
        <Badge variant="light" color="violet" size="lg" radius="sm">
          Unmatched Performance
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Connect with confidence and speed
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Built for the modern user who values both speed and security. Our
        infrastructure is designed to scale with your conversations, no matter
        where in the world you are.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
