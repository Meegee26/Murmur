import { Box } from "@mantine/core";
import { FeaturesCards } from "./sections/FeaturesCards.jsx";
import { Hero } from "./sections/Hero.jsx";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { TechStack } from "./sections/TechStack.jsx";

export function Landing() {
  return (
    <Box bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-8))">
      <Header />
      <main>
        <Hero />
        <FeaturesCards />
        <TechStack />
      </main>
      <Footer />
    </Box>
  );
}
