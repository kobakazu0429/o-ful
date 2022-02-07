import { useCallback, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  ButtonGroup,
  useToast,
} from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import type { Item as AutocompleteItem } from "chakra-ui-autocomplete";
import { gql, useMutation, useQuery } from "@apollo/client";
import { WithHeaderFooter } from "../../layouts/WithHeaderFooter";
import { conditionMap, convertCondition } from "../../db/itemsCondition";
import type {
  TagsQuery,
  InsertItemMutation,
  InsertItemMutationVariables,
  UserIdByUidQuery,
  UserIdByUidQueryVariables,
} from "../../generated/graphql";
import { WithLoading } from "../../components/Loading";
import { useSession } from "next-auth/react";

const TAGS_QUERY = gql`
  query Tags {
    tags {
      id
      name
    }
  }
`;

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

interface Inputs {
  name: string;
  description: string;
  price: number;
  condition: number;
  tags: any;
  images: FileList;
}

const Create: NextPage = () => {
  const toast = useToast();
  const [uploadStart, setUploadStart] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({ mode: "onChange", criteriaMode: "all" });
  const session = useSession();
  const isLogin = useMemo(() => !!session.data, [session]);

  const {
    data: tagsQueryData,
    loading: tagsQueryLoading,
    error: tagsQueryError,
  } = useQuery<TagsQuery>(TAGS_QUERY);
  const pickerItems: AutocompleteItem[] = useMemo(() => {
    return (
      tagsQueryData?.tags.map((t) => ({
        value: String(t.id),
        label: t.name,
      })) ?? ([] as AutocompleteItem[])
    );
  }, [tagsQueryData]);

  const {
    data: userIdByUidQueryData,
    loading: userIdByUidQueryLoading,
    error: userIdByUidQueryError,
  } = useQuery<UserIdByUidQuery, UserIdByUidQueryVariables>(USER_ID_BY_UID, {
    variables: { uid: session.data?.user?.uid ?? "" },
  });

  const [
    insertItem,
    {
      data: insertItemMutationData,
      loading: insertItemMutationLoading,
      error: insertItemMutationError,
    },
  ] = useMutation<InsertItemMutation, InsertItemMutationVariables>(INSERT_ITEM);

  const [selectedItems, setSelectedItems] = useState<AutocompleteItem[]>([]);

  const handleSelectedItemsChange = (selectedItems?: AutocompleteItem[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };

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

      const tags = selectedItems.map((s) => ({ tag_id: Number(s.value) }));
      const result = await insertItem({
        variables: {
          ...data,
          state: 10,
          item_images: {
            data: uploadedFiles.map((i) => ({ url: i.secure_url })),
          },
          item_tags: {
            data: tags,
          },
          user_id: userIdByUidQueryData!.users[0].id!,
        },
      });

      console.log(result);
    },
    [insertItem, selectedItems, userIdByUidQueryData]
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
    }
    if (insertItemMutationData) {
      toast({
        title: "アップロードに成功しました。",
        description:
          "登録されているメールに通知が来ます。適宜確認してください。",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insertItemMutationData, insertItemMutationError, uploadStart]);

  if (!isLogin || !userIdByUidQueryData?.users[0].id) {
    return <WithHeaderFooter>出品は許可されていません</WithHeaderFooter>;
  }

  return (
    <WithHeaderFooter>
      <WithLoading
        loading={tagsQueryLoading || userIdByUidQueryLoading}
        error={tagsQueryError || userIdByUidQueryError}
      >
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Heading fontSize={"4xl"}>
                <Text as="h1" display="inline-block">
                  出品登録フォーム
                </Text>
              </Heading>
              <Text>
                iPhoneのSafariでは画像が正しくアップロードできません。
              </Text>
              <Text>お手数ですがGoogle Chromeの利用をお願いします。</Text>

              <FormControl id="name">
                <FormLabel>名前</FormLabel>
                <Input
                  placeholder="例: 物理の教科書"
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "名前が入力されていません。",
                    },
                  })}
                />
              </FormControl>

              <FormControl id="description">
                <FormLabel>説明</FormLabel>
                <Textarea
                  placeholder="例: 1年生の時に使っていたものです。書き込みが少しあります。"
                  _placeholder={{ color: "gray.500" }}
                  {...register("description")}
                />
              </FormControl>

              <FormControl id="price">
                <FormLabel>金額</FormLabel>
                <Input
                  placeholder="譲る場合は0円にしてください。"
                  _placeholder={{ color: "gray.500" }}
                  type="number"
                  {...register("price", {
                    valueAsNumber: true,
                    required: {
                      value: true,
                      message: "金額が入力されていません。",
                    },
                    min: {
                      value: 0,
                      message: "金額は0円以上で入力してください。",
                    },
                  })}
                />
              </FormControl>

              <FormControl id="condition">
                <FormLabel>商品の状態</FormLabel>
                <Select
                  _placeholder={{ color: "gray.500" }}
                  {...register("condition", {
                    required: {
                      value: true,
                      message: "商品の状態が選択されていません。",
                    },
                  })}
                >
                  {Object.keys(conditionMap).map((key) => (
                    <option key={key} value={key}>
                      {convertCondition(Number(key)).label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl id="tags">
                <FormLabel>タグ</FormLabel>
                <CUIAutoComplete
                  label="タグをつけると検索などで表示されやすくなります。"
                  placeholder="入力するか隣の矢印を押してください。"
                  items={pickerItems}
                  selectedItems={selectedItems}
                  onSelectedItemsChange={(changes) =>
                    handleSelectedItemsChange(changes.selectedItems)
                  }
                  disableCreateItem
                />
              </FormControl>

              <FormControl id="images">
                <FormLabel>画像</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  {...register("images", {
                    required: {
                      value: true,
                      message: "写真が1枚も選択されていません。",
                    },
                  })}
                  // ref={inputFileRef}
                />
              </FormControl>

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
            </form>
            {errors && (
              <ul className="text-left mt-12">
                {Object.entries(errors).map(([k, v]) => (
                  <li key={k}>{v.message}</li>
                ))}
              </ul>
            )}
          </Stack>
        </Flex>
      </WithLoading>
    </WithHeaderFooter>
  );
};

export default Create;
