import type { NextPage } from "next";
import { useSession, signOut, SessionContextValue } from "next-auth/react";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { useCheckAlreadyLogin } from "../auth/user";
import { WithHeaderFooter } from "../layouts/WithHeaderFooter";
import { firebaseApp } from "../lib/firebase";
import {
  Box,
  Text,
  Heading,
  VStack,
  Stack,
  Button,
  Flex,
  HStack,
  Image,
} from "@chakra-ui/react";
import type { VFC } from "react";
import type { DeepNonNullable } from "utility-types";
import { gql, useQuery } from "@apollo/client";
import {
  UserItemsByUidQuery,
  UserItemsByUidQueryResult,
  UserItemsByUidQueryVariables,
} from "../generated/graphql";
import { convertState } from "../db/itemState";
import { WithLoading } from "../components/Loading";

const USER_ITEMS_QUERY = gql`
  query UserItemsByUid($uid: String!) {
    users(where: { uid: { _eq: $uid } }) {
      user_items {
        item {
          id
          name
          price
          state
          description
          item_tags {
            tag {
              id
              name
            }
          }
          item_images {
            url
            id
          }
        }
      }
    }
  }
`;

const UserDetailBlock: VFC<{ title: string; value: string }> = ({
  title,
  value,
}) => {
  return (
    <Stack direction={{ base: "column", md: "row" }}>
      <Box minWidth="150px">{title}</Box>
      <Box paddingLeft={{ base: "1rem", md: "0px" }}>{value}</Box>
    </Stack>
  );
};

const UserDetail: VFC<{
  user: DeepNonNullable<
    Required<NonNullable<SessionContextValue["data"]>["user"]>
  > & {
    uid: string;
    twitterId: string;
  };
  logout: () => void;
}> = ({ user, logout }) => {
  return (
    <VStack spacing={4} align="stretch" width="full">
      <Heading as="h2" fontSize={"3xl"}>
        ユーザー情報
      </Heading>
      <Box bg="white" borderWidth="1px" rounded="lg">
        <Stack direction="column">
          <UserDetailBlock title="名前" value={user.name} />
          <UserDetailBlock title="Twitter" value={user.twitterId} />
          <UserDetailBlock title="メールアドレス" value={user.email} />
          <UserDetailBlock title="UID" value={user.uid} />
        </Stack>
      </Box>
      <Button width={"150px"} colorScheme="red" onClick={logout}>
        ログアウトする
      </Button>
    </VStack>
  );
};

type Items = NonNullable<
  UserItemsByUidQueryResult["data"]
>["users"][number]["user_items"];

const ItemDetail: VFC<{
  items: Items;
}> = ({ items }) => {
  return (
    <VStack
      spacing={4}
      align="stretch"
      width="full"
      maxWidth={"full"}
      overflow={"hidden"}
    >
      <Heading as="h2" fontSize={"3xl"}>
        出品情報
      </Heading>
      <Box bg="white" borderWidth="1px" rounded="lg">
        <Box mx="auto" p="6">
          <Stack spacing={8}>
            {items.map(({ item }) => (
              <CartItem key={item.id} item={item} />
            ))}
          </Stack>
        </Box>
      </Box>
    </VStack>
  );
};

const CartItem: VFC<{ item: Items[number]["item"] }> = ({
  item: { name, description, price, item_images, state },
}) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align={{ base: "left-start", lg: "center" }}
    >
      <Stack direction="row" spacing="5" overflow={"hidden"}>
        <Image
          rounded="lg"
          width="120px"
          height="120px"
          fit="cover"
          src={item_images[0].url}
          alt={name}
          draggable="false"
          loading="lazy"
        />
        <Box pt="4" flex="1" isTruncated>
          <Stack spacing="0.5">
            <Text fontWeight="medium" noOfLines={1}>
              {name}
            </Text>

            <Box>
              <Text color={"gray.600"} fontSize="sm" noOfLines={1}>
                {description}
              </Text>
            </Box>

            <HStack spacing="1">
              <Text as="span" color="gray.700">
                {formatPrice(price)}
              </Text>
            </HStack>

            <Text>{convertState(state)}</Text>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export function formatPrice(value: number) {
  const formatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
  });
  return formatter.format(value);
}

const Account: NextPage = () => {
  useCheckAlreadyLogin();
  const router = useRouter();
  const session = useSession();
  const auth = getAuth(firebaseApp);
  // @ts-expect-error
  const uid = auth.currentUser?.uid ?? session.data?.user?.uid ?? "";

  const { data, error, loading } = useQuery<
    UserItemsByUidQuery,
    UserItemsByUidQueryVariables
  >(USER_ITEMS_QUERY, { variables: { uid } });

  if (!uid)
    return (
      <WithHeaderFooter>
        <Text>こちらのページはログインしなければ使えません。</Text>
      </WithHeaderFooter>
    );

  return (
    <WithHeaderFooter>
      <WithLoading
        loading={session.status === "loading" || loading}
        error={error}
      >
        {session?.status === "authenticated" && (
          <Stack
            direction={{ base: "column", xl: "row" }}
            spacing={{ base: 10 }}
            justifyContent={"center"}
          >
            <UserDetail
              // @ts-expect-error
              user={session.data.user}
              logout={async () => {
                await Promise.all([signOut(), auth.signOut()]);
                router.push("/");
              }}
            />
            <ItemDetail
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              items={data?.users[0].user_items!}
            />
          </Stack>
        )}
      </WithLoading>
    </WithHeaderFooter>
  );
};

export default Account;
