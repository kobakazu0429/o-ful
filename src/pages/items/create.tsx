import { useCallback, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import {
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { WithHeaderFooter } from "../../layouts/WithHeaderFooter";
import type {
  InsertItemMutation,
  InsertItemMutationVariables,
  UserIdByUidQuery,
  UserIdByUidQueryVariables,
} from "../../generated/graphql";
import { WithLoading } from "../../components/Loading";
import { useSession } from "next-auth/react";
import { RegisterItem } from "../../components/RegisterItem";
import type { Inputs } from "../../components/RegisterItem";
import { useRouter } from "next/router";

const USER_ID_BY_UID = gql`
  query UserIdByUid($uid: String!) {
    users(where: { uid: { _eq: $uid } }) {
      id
    }
  }
`;

const INSERT_ITEM = gql`
  mutation InsertItem(
    $user_id: Int!
    $name: String!
    $description: String = ""
    $price: Int!
    $condition: Int!
    $state: Int!
    $item_images: item_images_arr_rel_insert_input
    $item_tags: item_tags_arr_rel_insert_input
  ) {
    insert_items_one(
      object: {
        name: $name
        description: $description
        price: $price
        condition: $condition
        state: $state
        item_images: $item_images
        item_tags: $item_tags
        user_item: { data: { user_id: $user_id } }
      }
    ) {
      id
    }
  }
`;

const Create: NextPage = () => {
  const toast = useToast();
  const [uploadStart, setUploadStart] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange", criteriaMode: "all" });
  const session = useSession();
  const isLogin = useMemo(() => !!session.data, [session]);

  const {
    data: userIdByUidQueryData,
    loading: userIdByUidQueryLoading,
    error: userIdByUidQueryError,
  } = useQuery<UserIdByUidQuery, UserIdByUidQueryVariables>(USER_ID_BY_UID, {
    variables: { uid: session.data?.user?.uid ?? "" },
  });

  const [insertItem, { error: insertItemMutationError }] = useMutation<
    InsertItemMutation,
    InsertItemMutationVariables
  >(INSERT_ITEM);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (data) => {
      setUploadStart(true);
      const formData = new FormData();
      Array.from(data.images).forEach((file, i) => {
        formData.append(`inputFile${i}`, file);
      });
      const uploadedFiles: Array<{ secure_url: string }> = await fetch(
        "/api/uploadImage",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());

      const result = await insertItem({
        variables: {
          ...data,
          state: 10,
          item_images: {
            data: uploadedFiles.map((i) => ({ url: i.secure_url })),
          },
          item_tags: {
            data: data.tags?.map((t) => ({ tag_id: Number(t.value) })) ?? [],
          },
          user_id: userIdByUidQueryData!.users[0].id!,
        },
      });

      console.log(result);

      if (result) {
        toast({
          title: "アップロードに成功しました。",
          description:
            "詳しく話を聞きたいユーザーからはTwitterのDMへ連絡がきます。DMを受け入れる設定にしておいてください。",
          status: "success",
          duration: 9000,
          isClosable: true,
          position: "top-right",
        });
        router.reload();
      }
    },
    [router, insertItem, userIdByUidQueryData, toast]
  );

  useEffect(() => {
    if (uploadStart) {
      toast({
        title: "アップロードを開始しました。",
        description: "完了するまでページを閉じないでください。",
        status: "info",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      setUploadStart(false);
    }
    if (insertItemMutationError) {
      toast({
        title: "アップロードに失敗しました。",
        description:
          "時間をおいて再度試してください。改善されない場合は運営者までご報告ください。",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      throw insertItemMutationError;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertItemMutationError, uploadStart]);

  if (!isLogin || !userIdByUidQueryData?.users[0].id) {
    return <WithHeaderFooter>出品は許可されていません</WithHeaderFooter>;
  }

  return (
    <WithHeaderFooter>
      <WithLoading
        loading={userIdByUidQueryLoading}
        error={userIdByUidQueryError}
      >
        <Flex align={"center"} justify={"center"}>
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
              <Heading fontSize={"4xl"}>
                <Text as="h1" display="inline-block">
                  出品登録フォーム
                </Text>
              </Heading>
              <RegisterItem register={register} setValue={setValue} />

              <ButtonGroup spacing={6} mt={6}>
                <Button
                  bg={"red.400"}
                  color={"white"}
                  w="full"
                  _hover={{
                    bg: "red.500",
                  }}
                >
                  キャンセル
                </Button>
                {/* <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              >
              下書き保存
            </Button> */}
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
                  出品する
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
      </WithLoading>
    </WithHeaderFooter>
  );
};

export default Create;
