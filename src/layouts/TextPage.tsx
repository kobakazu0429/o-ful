import type { FC } from "react";
import { Heading, Stack, Box } from "@chakra-ui/react";
import { WithHeaderFooter } from "./WithHeaderFooter";

export const TextPageLayout: FC<{ title: string }> = ({ children, title }) => {
  return (
    <WithHeaderFooter containerMaxWidth={"2xl"}>
      <Heading mb="32px">{title}</Heading>
      <Stack spacing={"32px"}>{children}</Stack>
    </WithHeaderFooter>
  );
};

export const Content: FC<{ title: string }> = ({ children, title }) => {
  return (
    <Box>
      <Heading as="h2" fontSize={"xl"} mb="8px">
        {title}
      </Heading>
      {children}
    </Box>
  );
};
