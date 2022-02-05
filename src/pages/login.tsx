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
import { Heading, Text, Flex, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useCheckAlreadyLogin } from "../auth/user";

const Login: NextPage = () => {
  const router = useRouter();
  const auth = getAuth(firebaseApp);
  const twitterProvider = new TwitterAuthProvider();

  const handleOAuthLogin = (provider: AuthProvider) => {
    signInWithRedirect(auth, provider).catch((error) => console.error(error));
  };

  useCheckAlreadyLogin({
    successHandle: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    (async () => {
      const credential = await getRedirectResult(auth);
      if (!credential) return;

      // ID トークンを NextAuth に渡す
      const idToken = await credential.user.getIdToken(true);
      await signIn("credentials", { idToken });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Heading fontSize={"4xl"}>
            <Text as="h1" display="inline-block">
              会員登録
            </Text>
            <Text as="h1" display="inline-block">
              &nbsp;/&nbsp;
            </Text>
            <Text as="h1" display="inline-block">
              ログイン
            </Text>
          </Heading>

          <Text color={"gray.600"}>
            現在、Twitterでのログインのみに対応しています。
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
