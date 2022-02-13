import { useMemo, VFC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Flex, Text, Button, Stack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export const Header: VFC = () => {
  const session = useSession();
  const isLogin = useMemo(() => !!session.data, [session]);

  return (
    <Box as="header">
      <Flex
        bg={"white"}
        color={"gray.600"}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={"gray.200"}
        align={"center"}
      >
        <Flex flex={{ base: 1 }} justify={{ base: "left", md: "start" }}>
          <Link href="/" passHref>
            <a style={{ lineHeight: 0 }}>
              <Image
                src="/o-ful.svg"
                alt="o-ful logo"
                height={44}
                width={(44 / 56) * 145}
              />
            </a>
          </Link>
        </Flex>

        <Stack
          justify={"flex-end"}
          alignItems={"center"}
          direction={"row"}
          spacing={6}
        >
          {isLogin ? (
            <Link href="/account" passHref>
              <Button
                as={"a"}
                fontSize={"sm"}
                fontWeight={600}
                variant={"link"}
              >
                {session.data?.user?.name}{" "}
                <Text as="span" fontWeight={400}>
                  さん
                </Text>
              </Button>
            </Link>
          ) : (
            <Link href="/login" passHref>
              <Button
                as={"a"}
                fontSize={"sm"}
                fontWeight={600}
                variant={"link"}
              >
                会員登録 / ログイン
              </Button>
            </Link>
          )}
          <Link href="/items/create" passHref>
            <Button
              as={"a"}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"pink.500"}
              _hover={{
                bg: "pink.400",
              }}
            >
              出品
            </Button>
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
};
