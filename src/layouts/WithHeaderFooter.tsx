import type { FC } from "react";
import { Container, Flex } from "@chakra-ui/react";
import type { ContainerProps } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const WithHeaderFooter: FC<{
  containerMaxWidth?: ContainerProps["maxWidth"];
}> = ({ children, containerMaxWidth = "7xl" }) => {
  return (
    <Flex direction={"column"} height="100%">
      <Header />
      <Container maxWidth={containerMaxWidth} flex="1" my={8}>
        {children}
      </Container>
      <Footer />
    </Flex>
  );
};
