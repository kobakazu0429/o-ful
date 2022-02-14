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
        title="o-fulってどうやって使うの？"
        description="o-fulの使い方や注意点などがまとめられています。"
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
            mb="60px"
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

          <Divider />

          <ProvidedService title="手数料など">
            <Text>o-fulはユーザーから一切の金銭を受け取りません。</Text>
            <Text>出品者は完全に無料で利用することができます。</Text>
            <Text>
              購入者は商品が有料である場合のみ出品者に支払い、それ以外では支払いは発生しません。
            </Text>

            <ChakraLink
              href="https://help.twitter.com/ja/using-twitter/direct-messages#receive"
              isExternal
            >
              すべてのアカウントからダイレクトメッセージを受信するには |
              Twitterヘルプ
              <ExternalLinkIcon mb="0.1rem" mx="2px" />
            </ChakraLink>
          </ProvidedService>

          <ProvidedService title="出品者との連絡">
            <Text>o-fulではチャットサービスの提供をしていません。</Text>
            <Text>出品者との連絡にはTwitter DMを利用してください。</Text>
            <Text>出品者はDMの解放をする必要があります。</Text>

            <ChakraLink
              href="https://help.twitter.com/ja/using-twitter/direct-messages#receive"
              isExternal
            >
              すべてのアカウントからダイレクトメッセージを受信するには |
              Twitterヘルプ
              <ExternalLinkIcon mb="0.1rem" mx="2px" />
            </ChakraLink>
          </ProvidedService>

          <ProvidedService title="商品の受け渡し">
            <Text>o-fulでは郵送サービスの提供をしていません。</Text>
            <Text>
              o-fulではトラブル防止のため手渡しでの受け渡しを推奨しています。
            </Text>
            <Text>
              購入者・出品者の両者が納得すればゆうパックなどの郵送サービスを利用しても構いません。
            </Text>
            <ChakraLink
              href="https://www.post.japanpost.jp/service/you_pack/"
              isExternal
            >
              ゆうパック | 日本郵便株式会社
              <ExternalLinkIcon mb="0.1rem" mx="2px" />
            </ChakraLink>
          </ProvidedService>

          <ProvidedService title="決済">
            <Text>o-fulでは決済サービスの提供をしていません。</Text>
            <Text>
              o-fulではトラブル防止のため、商品を受け取った際に現金で支払うことを推奨しています。
            </Text>
            <Text>
              購入者・出品者の両者が納得すればQRコード決済などの決済サービスを利用しても構いません。
            </Text>
          </ProvidedService>

          <Divider />

          <Box my="60px" width="full" maxWidth="600px">
            <Heading as="h2" mb="40px" fontSize="4xl" textAlign="center">
              なにを連絡するの？
            </Heading>
            <VStack alignItems="start" width="full">
              <OrderedList>
                <ListItem>学年、学科、名前を名乗りましょう。</ListItem>
                <ListItem>
                  検討している商品について送りましょう。URLがあってもいいかもしれません。
                </ListItem>
                <ListItem>
                  表示されている価格は参考価格です。必要であれば金額について相談しましょう。
                </ListItem>
                <ListItem>
                  受け渡し方法と支払い方法を相談しましょう（o-fulでは手渡しでの受け渡し、支払いはその場で行うことを推奨しています。）
                </ListItem>
                <ListItem>
                  出品者は商品に汚れや書き込みなどがあればきちんと報告しましょう。購入者は気になるようであれば質問しましょう。必要であれば現物の確認をさせてもらいましょう。
                </ListItem>
                <ListItem>
                  購入者・出品者はそれぞれ納得がいかなければ理由を説明し、取引を中止しましょう。
                </ListItem>
                <ListItem>
                  相手は、同じ学校の先輩後輩です。仲良く気持ちよく取引しましょう。
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
                商品を探す
              </Button>
            </Link>
          </Box>
        </Center>
      </WithHeaderFooter>
    </>
  );
};

export default Guide;
