import type { FC } from "react";
import { Container, Flex } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const WithHeaderFooter: FC = ({ children }) => {
  return (
    <Flex direction={"column"} height="100%">
      <Header />
      <Container maxW={"7xl"} flex="1" my={8}>
        {children}
      </Container>
      <Footer />
    </Flex>
  );
};
