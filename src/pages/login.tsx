import { useEffect, useMemo } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import NextHeadSeo from "next-head-seo";
import { signIn } from "next-auth/react";
import { TwitterLoginButton } from "react-social-login-buttons";
import {
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
import { canonicalUrl } from "../utils/canonicalUrl";
import { useFirebaseAuth } from "../lib/firebase";

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
  const auth = useFirebaseAuth();
  const isRedirected = useMemo(() => {
    return router.asPath.split("#")[1] === REDIRECTED_HASH;
  }, [router]);

  const [insertNewUser, { error }] = useMutation<
    InsertNewUserMutation,
    InsertNewUserMutationVariables
  >(INSERT_NEW_USER);

  const twitterProvider = new TwitterAuthProvider();

  const handleOAuthLogin = (provider: AuthProvider) => {
    if (!auth.current) return;

    router.replace({ hash: REDIRECTED_HASH }, undefined, { shallow: true });
    signInWithRedirect(auth.current, provider).catch((error) => {
      console.error(error);
      throw error;
    });
  };

  useEffect(() => {
    if (!isRedirected) return;
    if (!auth.current) return;

    try {
      (async () => {
        const credential = await getRedirectResult(auth.current!);
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

        // ID ??????????????? NextAuth ?????????
        const idToken = await credential.user.getIdToken(true);
        await signIn("credentials", {
          idToken,
          twitterId: screen_name,
          callbackUrl: "/",
        });
      })();
    } catch (error) {
      toast({
        title: "?????????????????????????????????????????????",
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
      <>
        <NextHeadSeo
          title="???????????????????????????"
          description="o-ful??????????????????????????????"
          canonical={canonicalUrl("/login")}
        />
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
                  ?????????????????????
                </Heading>
              </Box>
              <Spinner />
            </Stack>
          </Flex>
        </WithHeaderFooter>
      </>
    );
  }

  return (
    <>
      <NextHeadSeo
        title="???????????????????????????"
        description="o-ful??????????????????????????????"
        canonical={canonicalUrl("/login")}
      />
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
                ????????????
              </Heading>
              <Heading as="h1" display="inline-block" fontSize={"4xl"}>
                &nbsp;/&nbsp;
              </Heading>
              <Heading as="h1" display="inline-block" fontSize={"4xl"}>
                ????????????
              </Heading>
            </Box>

            <Text color={"gray.600"}>
              ?????????Twitter???????????????????????????????????????????????????
            </Text>
            <Text color={"gray.600"} paddingBottom="32px">
              ????????????????????????????????????????????????????????????
            </Text>

            <TwitterLoginButton
              align="center"
              onClick={() => handleOAuthLogin(twitterProvider)}
            />

            <Text color={"gray.600"} fontSize={"sm"}>
              <Text as="span" display="inline-block">
                ?????????????????????????????????????????????
              </Text>
              <Text as="span" display="inline-block">
                <Link href="/teams" passHref>
                  <ChakraLink color="blue.600">[????????????]</ChakraLink>
                </Link>
                ???
                <Link href="/privacy" passHref>
                  <ChakraLink color="blue.600">
                    [??????????????????????????????]
                  </ChakraLink>
                </Link>
                ?????????????????????????????????????????????
              </Text>
            </Text>
          </Stack>
        </Flex>
      </WithHeaderFooter>
    </>
  );
};

export default Login;
