import {
  Button,
  Container,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import image from "../../assets/svg/404.svg";
import classes from "./NotFound.module.css";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Flex align="center" justify="center" h="100vh">
      <Container className={classes.root}>
        <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
          <Image src={image.src} className={classes.mobileImage} />
          <div>
            <Title className={classes.title}>Something is not right...</Title>
            <Text c="dimmed" size="lg">
              Page you are trying to open does not exist. You may have mistyped
              the address, or the page has been moved to another URL. If you
              think this is an error contact support.
            </Text>
            <Button
              size="md"
              radius="md"
              color="violet.6"
              mt="xl"
              onClick={() => navigate("/")}
              leftSection={<IconArrowLeft size={20} />}
              style={{ boxShadow: "0 10px 15px -3px rgba(121, 80, 242, 0.3)" }}
            >
              Go back to home
            </Button>
          </div>
          <Image src={image} className={classes.desktopImage} />
        </SimpleGrid>
      </Container>
    </Flex>
  );
}
