import type { VFC } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import { Box, Flex, Heading, Text, Center, VStack } from "@chakra-ui/react";
import { WithHeaderFooter } from "../layouts/WithHeaderFooter";

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

const Guide: NextPage = () => {
  return (
    <WithHeaderFooter>
      <Center flexDirection="column">
        <Heading
          as="h1"
          mb={{ base: "0px", md: "150px" }}
          fontSize="4xl"
          textAlign="center"
        >
          <Text as="span" display="inline-block">
            o-fulって
          </Text>
          <Text as="span" display="inline-block">
            どうやって使うの？
          </Text>
        </Heading>

        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent="space-around"
          width="full"
        >
          <Flow
            title="出品の流れ"
            src="/images/y0691.png"
            flows={["アカウント作成", "写真を撮る", "出品フォームから登録"]}
          />
          <Flow
            title="受け取りの流れ"
            src="/images/y0766.png"
            flows={["欲しい商品を探す", "出品者に連絡する", "商品を受け取る"]}
          />
        </Flex>
      </Center>
    </WithHeaderFooter>
  );
};

export default Guide;
