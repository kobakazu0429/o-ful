import { useMemo, useState } from "react";
import type { NextPage } from "next";
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
} from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import type { Item as AutocompleteItem } from "chakra-ui-autocomplete";
import { gql, useQuery } from "@apollo/client";
import { WithHeaderFooter } from "../../layouts/WithHeaderFooter";
import { getUser, useCheckAlreadyLogin } from "../../auth/user";
import { conditionMap, convertCondition } from "../../db/itemsCondition";
import { TagsQuery } from "../../generated/graphql";
import { WithLoading } from "../../components/Loading";

const TAGS_QUERY = gql`
  query Tags {
    tags {
      id
      name
    }
  }
`;

const Create: NextPage = () => {
  const user = getUser();
  const isLogin = useMemo(() => !!user, [user]);

  useCheckAlreadyLogin();

  const { data, error, loading } = useQuery<TagsQuery>(TAGS_QUERY);
  const pickerItems: AutocompleteItem[] = useMemo(() => {
    return (
      data?.tags.map((t) => ({
        value: String(t.id),
        label: t.name,
      })) ?? ([] as AutocompleteItem[])
    );
  }, [data]);

  const [selectedItems, setSelectedItems] = useState<AutocompleteItem[]>([]);

  const handleSelectedItemsChange = (selectedItems?: AutocompleteItem[]) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
    }
  };

  if (!isLogin) {
    return <WithHeaderFooter>使い方</WithHeaderFooter>;
  }

  return (
    <WithHeaderFooter>
      <WithLoading loading={loading} error={error}>
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
                出品登録フォーム
              </Text>
            </Heading>

            <FormControl id="name">
              <FormLabel>名前</FormLabel>
              <Input
                placeholder="例: 物理の教科書"
                _placeholder={{ color: "gray.500" }}
                type="text"
              />
            </FormControl>

            <FormControl id="description">
              <FormLabel>説明</FormLabel>
              <Textarea
                placeholder="例: 1年生の時に使っていたものです。書き込みが少しあります。"
                _placeholder={{ color: "gray.500" }}
              />
            </FormControl>

            <FormControl id="price">
              <FormLabel>金額</FormLabel>
              <Input
                placeholder="譲る場合は0円にしてください。"
                _placeholder={{ color: "gray.500" }}
                type="number"
              />
            </FormControl>

            <FormControl id="condition">
              <FormLabel>商品の状態</FormLabel>
              <Select _placeholder={{ color: "gray.500" }}>
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
              <Input type="file" accept="image/*" multiple />
            </FormControl>

            <ButtonGroup spacing={6}>
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
              >
                投稿する
              </Button>
            </ButtonGroup>
          </Stack>
        </Flex>
      </WithLoading>
    </WithHeaderFooter>
  );
};

export default Create;
