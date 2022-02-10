import type { FC } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Stack,
  Flex,
  Heading,
  Text,
  Center,
  Button,
} from "@chakra-ui/react";
import { WithHeaderFooter } from "../layouts/WithHeaderFooter";

const Persona: FC<{ reverse?: boolean; src: string; title: string }> = ({
  reverse = false,
  src,
  title,
  children,
}) => {
  return (
    <Flex
      width="full"
      direction={reverse ? { base: "row-reverse" } : { base: "row" }}
      alignItems="center"
    >
      <Box flexGrow={reverse ? "" : 1} fontSize={"xl"} fontWeight="bold">
        <Heading as={"h3"} fontSize="2xl" marginBottom="16px">
          <Text
            as={"span"}
            bgGradient="linear(transparent 70%, yellow.300 70%)"
          >
            {title}
          </Text>
          <Text as={"span"} fontSize="md">
            {" "}
            あなたに
          </Text>
        </Heading>

        {children}
      </Box>

      <Box flexGrow={reverse ? 1 : 0}>
        <Image
          src={src}
          alt={title}
          objectFit="contain"
          width={400}
          height={400}
        />
      </Box>
    </Flex>
  );
};

const Guide: NextPage = () => {
  return (
    <WithHeaderFooter>
      <Center flexDirection="column">
        <Heading as="h1" mb="32px" fontSize="4xl" textAlign="center">
          o-fulってなに？
        </Heading>

        <Heading
          textAlign="center"
          mb="150px"
          fontSize={{ base: "xl", md: "2xl" }}
        >
          <Text as="h2">
            教科書や参考書など自分にとって必要なくなったものと
          </Text>

          <Text as="h2">それを欲しい人を繋げるマッチングサービスです</Text>
        </Heading>

        <Stack spacing={"64px"} maxWidth="1000px">
          <Persona src="/images/y1156.png" title="売りたい">
            <Text>卒業するから、進学するから</Text>
            <Text>でも要らない教科書を捨てるのはもったいない！</Text>
          </Persona>

          <Persona src="/images/y0734.png" title="あげたい" reverse>
            <Text>自分は次のステップへ</Text>
            <Text>押入れに眠るくらいなら後輩に役立てて欲しい！</Text>
          </Persona>

          <Persona src="/images/y1039.png" title="欲しい">
            <Text>専門の教科書って高いんだよなぁ</Text>
            <Text>毎年たくさん買うのは大変だし、誰か譲ってくれないかな</Text>
          </Persona>

          <Box textAlign="center">
            <Link href="/guide" passHref>
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
                詳しい使い方を見る
              </Button>
            </Link>
          </Box>
        </Stack>
      </Center>
    </WithHeaderFooter>
  );
};

export default Guide;
