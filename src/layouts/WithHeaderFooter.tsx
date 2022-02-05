import type { FC } from "react";
import { Container } from "@chakra-ui/react";
import { Header } from "../components/Header";

export const WithHeaderFooter: FC = ({ children }) => {
  return (
    <>
      <Header />
      <Container maxW={"7xl"}>{children}</Container>
    </>
  );
};
