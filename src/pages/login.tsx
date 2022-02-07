import type { NextPage } from "next";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { TwitterLoginButton } from "react-social-login-buttons";
import {
  getAuth,
  signInWithRedirect,
  TwitterAuthProvider,
  getRedirectResult,
} from "firebase/auth";
import type { AuthProvider } from "firebase/auth";
import { firebaseApp } from "../lib/firebase";
import { WithHeaderFooter } from "../layouts/WithHeaderFooter";
import {
  Heading,
  Text,
  Flex,
  Stack,
  Box,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";

const REDIRECTED_HASH = "redirected";

const Login: NextPage = () => {
  const router = useRouter();
  const isRedirected = useMemo(() => {
    return router.asPath.split("#")[1] === REDIRECTED_HASH;
  }, [router]);

  const auth = getAuth(firebaseApp);
  const twitterProvider = new TwitterAuthProvider();

  const handleOAuthLogin = (provider: AuthProvider) => {
    router.push({ hash: REDIRECTED_HASH }, undefined, { shallow: true });
    signInWithRedirect(auth, provider).catch((error) => console.error(error));
  };

  useEffect(() => {
    if (!isRedirected) return;

    (async () => {
      const credential = await getRedirectResult(auth);
      if (!credential) return;

      const twitterId = JSON.parse(
        // @ts-expect-error
        credential._tokenResponse.rawUserInfo
      ).screen_name;

      // ID トークンを NextAuth に渡す
      const idToken = await credential.user.getIdToken(true);
      await signIn("credentials", { idToken, twitterId, callbackUrl: "/" });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isRedirected) {
    return (
      <WithHeaderFooter>
        <Flex align={"center"} justify={"center"}>
          <Stack
            spacing={8}
            mx={"auto"}
            maxW={"lg"}
            py={12}
            px={6}
            align={"center"}
            textAlign={"center"}
          >
            <Box>
              <Heading as="h1" display="inline-block" fontSize={"4xl"}>
                ログイン中です
              </Heading>
            </Box>

            <Center>
              <Spinner
                thickness="4px"
                speed="1s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Center>
          </Stack>
        </Flex>
      </WithHeaderFooter>
    );
  }

  return (
    <WithHeaderFooter>
      <Flex align={"center"} justify={"center"}>
        <Stack
          spacing={8}
          mx={"auto"}
          maxW={"lg"}
          py={12}
          px={6}
          align={"center"}
          textAlign={"center"}
        >
          <Box>
            <Heading as="h1" display="inline-block" fontSize={"4xl"}>
              会員登録
            </Heading>
            <Heading as="h1" display="inline-block" fontSize={"4xl"}>
              &nbsp;/&nbsp;
            </Heading>
            <Heading as="h1" display="inline-block" fontSize={"4xl"}>
              ログイン
            </Heading>
          </Box>

          <Text color={"gray.600"}>
            現在、Twitterでのログインのみに対応しています。
          </Text>
          <Text color={"gray.600"} paddingBottom="32px">
            シークレットモードではご利用できません。
          </Text>

          <TwitterLoginButton
            align="center"
            onClick={() => handleOAuthLogin(twitterProvider)}
          />

          <Text color={"gray.600"} fontSize={"sm"}>
            <Text as="span" display="inline-block">
              登録またはログインすることで、
            </Text>
            <Text as="span" display="inline-block">
              [利用規約]と[プライバシーポリシー]に同意したものとみなされます。
            </Text>
          </Text>
        </Stack>
      </Flex>
    </WithHeaderFooter>
  );
};

export default Login;
