import type { VFC } from "react";
import { Spinner as SpinnerComp, Center } from "@chakra-ui/react";

export const Spinner: VFC = () => {
  return (
    <Center>
      <SpinnerComp
        thickness="4px"
        speed="1s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  );
};
