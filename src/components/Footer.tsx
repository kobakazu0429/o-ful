import type { VFC } from "react";
import Link from "next/link";
import {
  Box,
  Text,
  Stack,
  Container,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";

export const Footer: VFC = () => {
  return (
    <Box as="footer" bg={"gray.50"} color={"gray.700"}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Stack align={"flex-start"}>
            <Link href="/">o-fulってなに？</Link>
            <Link href="/">使い方</Link>
            <Link href="/">お問い合わせ</Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Link href="/">Help Center</Link>
            <Link href="/">Safety Center</Link>
            <Link href="/">Community Guidelines</Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Link href="/">Cookieポリシー</Link>
            <Link href="/">プライバシーポリシー</Link>
            <Link href="/">特定商取引に関する表記</Link>
            <Link href="/">利用規約</Link>
          </Stack>
        </SimpleGrid>
      </Container>

      <Box
        borderTopWidth={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          direction={{ base: "column", md: "row" }}
          spacing={4}
          justify={{ md: "space-between" }}
          align={{ md: "center" }}
        >
          <Text>&copy; 2022 o-ful. All rights reserved</Text>
          <Stack direction={"row"} spacing={6}></Stack>
        </Container>
      </Box>
    </Box>
  );
};
