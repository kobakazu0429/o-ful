import { useEffect, useMemo } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { TwitterLoginButton } from "react-social-login-buttons";
import {
  getAuth,
  signInWithRedirect,
  TwitterAuthProvider,
  getRedirectResult,
  getAdditionalUserInfo,
} from "firebase/auth";
import { configureScope } from "@sentry/nextjs";
import { gql, useMutation } from "@apollo/client";
import {
  Heading,
  Text,
  Flex,
  Stack,
  Box,
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import type { AuthProvider } from "firebase/auth";
import { WithHeaderFooter } from "../layouts/WithHeaderFooter";
import { Spinner } from "../components/Spinner";
import {
  InsertNewUserMutation,
  InsertNewUserMutationVariables,
} from "../generated/graphql";

const REDIRECTED_HASH = "redirected";

const INSERT_NEW_USER = gql`
  mutation InsertNewUser(
    $uid: String!
    $nickname: String!
    $twitter_id: String!
    $email: String!
  ) {
    insert_users_one(
      object: {
        uid: $uid
        nickname: $nickname
        twitter_id: $twitter_id
        email: $email
      }
      on_conflict: {
        constraint: users_uid_key
        update_columns: [nickname, twitter_id, email]
      }
    ) {
      id
    }
  }
`;

const Login: NextPage = () => {
  const toast = useToast();
  const router = useRouter();
  const isRedirected = useMemo(() => {
    return router.asPath.split("#")[1] === REDIRECTED_HASH;
  }, [router]);

  const [insertNewUser, { error }] = useMutation<
    InsertNewUserMutation,
    InsertNewUserMutationVariables
  >(INSERT_NEW_USER);

  const twitterProvider = new TwitterAuthProvider();

  const handleOAuthLogin = (provider: AuthProvider) => {
    router.replace({ hash: REDIRECTED_HASH }, undefined, { shallow: true });
    signInWithRedirect(getAuth(), provider).catch((error) =>
      console.error(error)
    );
  };

  useEffect(() => {
    if (!isRedirected) return;

    try {
      (async () => {
        const credential = await getRedirectResult(getAuth());
        if (!credential) throw new Error("credential is not exist");
        const uid = credential.user.uid;

        const additionalUserInfo = getAdditionalUserInfo(credential);
        if (!additionalUserInfo)
          throw new Error("additionalUserInfo is not exist");

        const { profile } = additionalUserInfo;
        if (!profile) throw new Error("profile is not exist");

        const { screen_name, name, email } = profile as {
          screen_name: string;
          name: string;
          email: string;
        };

        await insertNewUser({
          variables: {
            uid,
            nickname: name,
            twitter_id: screen_name,
            email,
          },
        });

        if (error) {
          throw error;
        }

        configureScope((scope) => {
          scope.setUser({ uid });
        });

        // ID トークンを NextAuth に渡す
        const idToken = await credential.user.getIdToken(true);
        await signIn("credentials", {
          idToken,
          twitterId: screen_name,
          callbackUrl: "/",
        });
      })();
    } catch (error) {
      toast({
        title: "アカウント作成に失敗しました。",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      console.error(error);
    }
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
            <Spinner />
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
              <Link href="/teams" passHref>
                <ChakraLink color="blue.600">[利用規約]</ChakraLink>
              </Link>
              と
              <Link href="/privacy" passHref>
                <ChakraLink color="blue.600">[プライバシーポリシー]</ChakraLink>
              </Link>
              に同意したものとみなされます。
            </Text>
          </Text>
        </Stack>
      </Flex>
    </WithHeaderFooter>
  );
};

export default Login;
