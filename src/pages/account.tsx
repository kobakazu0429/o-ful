import type { NextPage } from "next";
import Link from "next/link";
import NextHeadSeo from "next-head-seo";
import { useSession, signOut, SessionContextValue } from "next-auth/react";
import { WithHeaderFooter } from "../layouts/WithHeaderFooter";
import {
  Box,
  Text,
  Heading,
  VStack,
  Stack,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState, VFC } from "react";
import type { DeepNonNullable } from "utility-types";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  SoftDeleteItemByIdMutation,
  SoftDeleteItemByIdMutationVariables,
  UpdateItemMutation,
  UpdateItemMutationVariables,
  UserItemsByUidQuery,
  UserItemsByUidQueryResult,
  UserItemsByUidQueryVariables,
} from "../generated/graphql";
import { convertState } from "../db/itemState";
import { WithLoading } from "../components/Loading";
import { formatPrice } from "../utils/price";
import { RegisterItem } from "../components/RegisterItem";
import type { Inputs } from "../components/RegisterItem";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { TIMESTAMPTZ_NOW } from "../db/hasuraSetVariable";
import { cloudinaryUrlReplace } from "../lib/cloudinary";
import { useFirebaseAuth } from "../lib/firebase";
import { canonicalUrl } from "../utils/canonicalUrl";

type InputsWithId = Omit<Inputs, "images"> & { id: number };

const USER_ITEMS_QUERY = gql`
  query UserItemsByUid($uid: String!) {
    users(where: { uid: { _eq: $uid } }) {
      user_items {
        item {
          id
          name
          price
          state
          condition
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

const UPDATE_ITEM = gql`
  mutation UpdateItem(
    $id: Int!
    $name: String!
    $description: String!
    $price: Int!
    $condition: Int!
    $state: Int!
    $updated_at: timestamptz!
  ) {
    update_items_by_pk(
      _set: {
        name: $name
        description: $description
        price: $price
        condition: $condition
        state: $state
        updated_at: $updated_at
      }
      pk_columns: { id: $id }
    ) {
      id
    }
  }
`;

const DELETE_ITEM = gql`
  mutation SoftDeleteItemById($id: Int!, $updated_at: timestamptz!) {
    update_items_by_pk(
      _set: { state: 90, updated_at: $updated_at }
      pk_columns: { id: $id }
    ) {
      id
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
        ??????????????????
      </Heading>
      <Box bg="white" borderWidth="1px" rounded="lg">
        <Stack direction="column">
          <UserDetailBlock title="??????" value={user.name} />
          <UserDetailBlock title="Twitter" value={user.twitterId} />
          <UserDetailBlock title="?????????????????????" value={user.email} />
          <UserDetailBlock title="UID" value={user.uid} />
        </Stack>
      </Box>
      <Button width={"150px"} colorScheme="red" onClick={logout}>
        ?????????????????????
      </Button>
    </VStack>
  );
};

type Items = NonNullable<
  UserItemsByUidQueryResult["data"]
>["users"][number]["user_items"];

const ItemDetail: VFC<{
  items: Items;
  modal: {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
  };
}> = ({ items, modal }) => {
  const [editIitem, setEditItem] = useState<InputsWithId>();

  return (
    <>
      <VStack
        spacing={4}
        align="stretch"
        width="full"
        maxWidth={"full"}
        overflow={"hidden"}
      >
        <Heading as="h2" fontSize={"3xl"}>
          ????????????
        </Heading>
        <Box bg="white" borderWidth="1px" rounded="lg">
          <Box mx="auto" p="6">
            <Stack spacing={16}>
              {items.map(
                ({ item }) =>
                  item && (
                    <CartItem
                      item={item}
                      openEditModal={modal.onOpen}
                      setEditItem={setEditItem}
                    />
                  )
              )}
            </Stack>
          </Box>
        </Box>
      </VStack>
      <EditItemModal {...modal} item={editIitem} />
    </>
  );
};

const CartItem: VFC<{
  item: Items[number]["item"];
  openEditModal: () => void;
  setEditItem: (item: InputsWithId) => void;
}> = ({
  item: { id, name, description, price, item_images, state, condition },
  openEditModal,
  setEditItem,
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteItem, { error }] = useMutation<
    SoftDeleteItemByIdMutation,
    SoftDeleteItemByIdMutationVariables
  >(DELETE_ITEM, { refetchQueries: ["UserItemsByUid"] });

  return (
    <>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "left-start", lg: "center" }}
        width="full"
      >
        <Stack
          direction="row"
          spacing="5"
          overflow={"hidden"}
          width="full"
          alignItems="center"
        >
          <Link href={`/items/${id}`} passHref>
            <a>
              <Image
                rounded="lg"
                width="120px"
                height="120px"
                fit="cover"
                src={cloudinaryUrlReplace(item_images[0].url, {
                  resize: { width: 240 },
                })}
                alt={name}
                draggable="false"
                loading="lazy"
              />
            </a>
          </Link>
          <Box flex="1" isTruncated width="full">
            <Stack spacing="0.5">
              {" "}
              <Link href={`/items/${id}`} passHref>
                <a>
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
                </a>
              </Link>
              <Flex width="full" justifyContent="flex-end">
                <Flex flexDirection={{ base: "column-reverse", md: "row" }}>
                  <Button
                    colorScheme="red"
                    width="150px"
                    onClick={onOpen}
                    marginRight={{ base: "0px", md: "16px" }}
                  >
                    ????????????
                  </Button>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    width="150px"
                    marginBottom={{ base: "16px", md: "0px" }}
                    onClick={() => {
                      setEditItem({
                        id,
                        name,
                        description: description ?? "",
                        price,
                        condition,
                        state,
                      });
                      openEditModal();
                    }}
                  >
                    ????????????
                  </Button>
                </Flex>
              </Flex>
            </Stack>
          </Box>
        </Stack>
      </Flex>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>??????</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex align={"center"} justify={"center"} direction="column">
              <Text>???{name}???</Text>
              <Text>?????????????????????????????????????????????</Text>

              <ButtonGroup spacing={6} mt={6}>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  w="full"
                  _hover={{
                    bg: "blue.500",
                  }}
                  onClick={onClose}
                >
                  ???????????????
                </Button>
                <Button
                  bg={"red.400"}
                  color={"white"}
                  w="full"
                  _hover={{
                    bg: "red.500",
                  }}
                  onClick={async () => {
                    await deleteItem({
                      variables: {
                        id,
                        updated_at: TIMESTAMPTZ_NOW,
                      },
                    });

                    if (error) {
                      toast({
                        title: "??????????????????????????????",
                        description:
                          "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                        position: "top-right",
                      });

                      throw error;
                    }

                    onClose();
                  }}
                >
                  ????????????
                </Button>
              </ButtonGroup>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const EditItemModal: VFC<{
  isOpen: boolean;
  onClose: () => void;
  item?: InputsWithId;
}> = ({ isOpen, onClose, item }) => {
  const toast = useToast();

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange", criteriaMode: "all" });

  useEffect(() => {
    reset(item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const [updateItem, { error: updateItemMutationError }] = useMutation<
    UpdateItemMutation,
    UpdateItemMutationVariables
  >(UPDATE_ITEM, { refetchQueries: ["UserItemsByUid"] });

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      // const formData = new FormData();
      // Array.from(data.images).forEach((file, i) => {
      //   formData.append(`inputFile${i}`, file);
      // });

      if (!item?.id) throw new Error("item is is not exist");

      toast({
        title: "??????????????????????????????",
        description: "????????????????????????????????????????????????????????????",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });

      const result = await updateItem({
        variables: {
          id: item.id,
          name: data.name,
          description: data.description,
          price: data.price,
          condition: data.condition,
          state: data.state,
          updated_at: TIMESTAMPTZ_NOW,

          // item_images: {
          //   data: uploadedFiles.map((i) => ({ url: i.secure_url })),
          // },
          // item_tags: {
          //   data: data.tags?.map((t) => ({ tag_id: Number(t.value) })) ?? [],
          // },
        },
      });
      if (updateItemMutationError) {
        toast({
          title: "??????????????????????????????",
          description:
            "??????????????????????????????????????????????????????????????????????????????????????????????????????????????????",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });

        throw updateItemMutationError;
      }
      console.log(result);

      if (result) {
        toast({
          title: "??????????????????????????????",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
        onClose();
      }
    },
    [updateItem, item, updateItemMutationError, toast, onClose]
  );

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>????????????</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex align={"center"} justify={"center"} direction="column">
            <Text>????????????????????????????????????????????????</Text>
            <Text>
              ????????????????????????????????????????????????????????????????????????????????????????????????
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack
                spacing={8}
                mx={"auto"}
                maxW={"lg"}
                py={12}
                px={6}
                align={"center"}
                textAlign={"center"}
              >
                <RegisterItem
                  register={register}
                  setValue={setValue}
                  showState
                  showTags
                  showImages={false}
                  defaultValues={item}
                />

                <ButtonGroup spacing={6} mt={6}>
                  <Button
                    bg={"red.400"}
                    color={"white"}
                    w="full"
                    _hover={{
                      bg: "red.500",
                    }}
                    onClick={onClose}
                  >
                    ???????????????
                  </Button>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    w="full"
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                    disabled={Object.keys(errors).length !== 0 || isSubmitting}
                  >
                    ????????????
                  </Button>
                </ButtonGroup>
                {errors && (
                  <ul className="text-left mt-12">
                    {Object.entries(errors).map(([k, v]) => {
                      // @ts-expect-error
                      return v.message && <li key={k}>{v.message}</li>;
                    })}
                  </ul>
                )}
              </Stack>
            </form>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const Account: NextPage = () => {
  const session = useSession();
  const auth = useFirebaseAuth();

  const uid = useMemo(() => {
    return auth.current?.currentUser?.uid ?? session.data?.user?.uid ?? "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const { data, error, loading } = useQuery<
    UserItemsByUidQuery,
    UserItemsByUidQueryVariables
  >(USER_ITEMS_QUERY, { variables: { uid } });

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!uid)
    return (
      <>
        <NextHeadSeo
          title="???????????????"
          description="o-ful???????????????????????????"
          canonical={canonicalUrl("/account")}
        />
        <WithHeaderFooter>
          <Text>?????????????????????????????????????????????????????????????????????</Text>
        </WithHeaderFooter>
      </>
    );

  return (
    <>
      <NextHeadSeo
        title="???????????????"
        description="o-ful???????????????????????????"
        canonical={canonicalUrl("/account")}
      />
      <WithHeaderFooter>
        <WithLoading
          loading={loading || session?.status === "loading"}
          error={
            error ||
            (session?.status !== "loading" &&
              session?.status !== "authenticated")
          }
        >
          <Stack
            direction={{ base: "column", xl: "row" }}
            spacing={{ base: 10 }}
            justifyContent={"center"}
          >
            <UserDetail
              // @ts-expect-error
              user={session.data.user}
              logout={async () => {
                await Promise.all([
                  signOut({ callbackUrl: "/" }),
                  auth?.current?.signOut(),
                ]);
              }}
            />
            <ItemDetail
              items={data?.users[0]?.user_items ?? []}
              modal={{ isOpen, onOpen, onClose }}
            />
          </Stack>
        </WithLoading>
      </WithHeaderFooter>
    </>
  );
};

export default Account;
