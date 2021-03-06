import type { FC, VFC } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import NextHeadSeo from "next-head-seo";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Center,
  ListItem,
  OrderedList,
  VStack,
  Divider,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { WithHeaderFooter } from "../layouts/WithHeaderFooter";
import { canonicalUrl } from "../utils/canonicalUrl";

const Flow: VFC<{
  src: string;
  title: string;
  flows: string[];
}> = ({ src, title, flows }) => {
  return (
    <VStack
      width="full"
      direction={{ base: "row" }}
      alignItems="center"
      mt={{ base: "200px", md: "0px" }}
    >
      <Box fontSize={"xl"} fontWeight="bold">
        <Heading as={"h3"} fontSize="2xl" marginBottom="16px">
          <Text
            as={"span"}
            bgGradient="linear(transparent 70%, yellow.300 70%)"
          >
            {title}
          </Text>
        </Heading>
      </Box>

      <Box>
        <Image
          src={src}
          alt={title}
          objectFit="contain"
          width={400}
          height={400}
        />
      </Box>

      <Box>
        <VStack
          width="full"
          direction={{ base: "row" }}
          alignItems="center"
          spacing="60px"
        >
          {flows.map((text, i) => {
            return (
              <Box
                key={text}
                bg="white"
                borderWidth="1px"
                rounded="lg"
                shadow="lg"
                minWidth={{ base: "350px" }}
                minHeight="80px"
                display="grid"
                justifyContent="start"
                alignItems="center"
                padding="30px"
                gridTemplateColumns="0.1fr 0.8fr"
              >
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  as="span"
                  color="yellow.400"
                >
                  {String(i + 1).padStart(2, "0")}
                </Text>
                <Text fontSize="xl" fontWeight="bold" as="span">
                  {text}
                </Text>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </VStack>
  );
};

const ProvidedService: FC<{ title: string }> = ({ children, title }) => {
  return (
    <Box my="60px" width="full" maxWidth="600px">
      <Heading as="h2" mb="40px" fontSize="4xl" textAlign="center">
        {title}
      </Heading>
      <VStack alignItems="start" width="full">
        {children}
      </VStack>
    </Box>
  );
};

const Guide: NextPage = () => {
  return (
    <>
      <NextHeadSeo
        title="o-ful?????????????????????????????????"
        description="o-ful???????????????????????????????????????????????????????????????"
        canonical={canonicalUrl("/guide")}
      />

      <WithHeaderFooter>
        <Center flexDirection="column">
          <Heading
            as="h1"
            mb={{ base: "0px", md: "150px" }}
            fontSize="4xl"
            textAlign="center"
          >
            <Text as="span" display="inline-block">
              o-ful??????
            </Text>
            <Text as="span" display="inline-block">
              ???????????????????????????
            </Text>
          </Heading>

          <Flex
            direction={{ base: "column", md: "row" }}
            justifyContent="space-around"
            width="full"
            mb="60px"
          >
            <Flow
              title="???????????????"
              src="/images/y0691.png"
              flows={["?????????????????????", "???????????????", "??????????????????????????????"]}
            />
            <Flow
              title="?????????????????????"
              src="/images/y0766.png"
              flows={["????????????????????????", "????????????????????????", "?????????????????????"]}
            />
          </Flex>

          <Divider />

          <ProvidedService title="???????????????">
            <Text>o-ful???????????????????????????????????????????????????????????????</Text>
            <Text>??????????????????????????????????????????????????????????????????</Text>
            <Text>
              ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            </Text>
          </ProvidedService>

          <ProvidedService title="?????????????????????">
            <Text>o-ful???????????????????????????????????????????????????????????????</Text>
            <Text>???????????????????????????Twitter DM??????????????????????????????</Text>
            <Text>????????????DM??????????????????????????????????????????</Text>

            <ChakraLink
              href="https://help.twitter.com/ja/using-twitter/direct-messages#receive"
              isExternal
            >
              ???????????????????????????????????????????????????????????????????????????????????? |
              Twitter?????????
              <ExternalLinkIcon mb="0.1rem" mx="2px" />
            </ChakraLink>
          </ProvidedService>

          <ProvidedService title="?????????????????????">
            <Text>o-ful?????????????????????????????????????????????????????????</Text>
            <Text>
              o-ful???????????????????????????????????????????????????????????????????????????????????????
            </Text>
            <Text>
              ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            </Text>
            <ChakraLink
              href="https://www.post.japanpost.jp/service/you_pack/"
              isExternal
            >
              ??????????????? | ????????????????????????
              <ExternalLinkIcon mb="0.1rem" mx="2px" />
            </ChakraLink>
          </ProvidedService>

          <ProvidedService title="??????">
            <Text>o-ful?????????????????????????????????????????????????????????</Text>
            <Text>
              o-ful?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            </Text>
            <Text>
              ????????????????????????????????????????????????QR??????????????????????????????????????????????????????????????????????????????
            </Text>
          </ProvidedService>

          <Divider />

          <Box my="60px" width="full" maxWidth="600px">
            <Heading as="h2" mb="40px" fontSize="4xl" textAlign="center">
              ???????????????????????????
            </Heading>
            <VStack alignItems="start" width="full">
              <OrderedList>
                <ListItem>???????????????????????????????????????????????????</ListItem>
                <ListItem>
                  ?????????????????????????????????????????????????????????URL?????????????????????????????????????????????
                </ListItem>
                <ListItem>
                  ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
                </ListItem>
                <ListItem>
                  ???????????????????????????????????????????????????????????????o-ful??????????????????????????????????????????????????????????????????????????????????????????????????????
                </ListItem>
                <ListItem>
                  ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                </ListItem>
                <ListItem>
                  ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                </ListItem>
                <ListItem>
                  ????????????????????????????????????????????????????????????????????????????????????????????????
                </ListItem>
              </OrderedList>
            </VStack>
          </Box>

          <Box textAlign="center">
            <Link href="/" passHref>
              <Button
                borderColor="yellow.300"
                borderWidth="2px"
                borderRadius="24px"
                bgColor="yello.400"
                _hover={{
                  bgColor: "yello.400",
                }}
                variant="outline"
                as={"a"}
                size="lg"
                width="300px"
              >
                ???????????????
              </Button>
            </Link>
          </Box>
        </Center>
      </WithHeaderFooter>
    </>
  );
};

export default Guide;
