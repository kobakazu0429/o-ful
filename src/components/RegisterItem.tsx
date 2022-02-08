import { useState, useMemo, useEffect } from "react";
import type { VFC } from "react";
import Link from "next/Link";
import { gql, useQuery } from "@apollo/client";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import {
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import type { Item as AutocompleteItem } from "chakra-ui-autocomplete";
import { conditionMap, convertCondition } from "../db/itemsCondition";
import { convertState, stateMap } from "../db/itemState";
import { TagsQuery } from "../generated/graphql";
import { Spinner } from "./Spinner";

export interface Inputs {
  name: string;
  description: string;
  price: number;
  condition: number;
  state: number;
  tags?: AutocompleteItem[];
  images: FileList;
}

const TAGS_QUERY = gql`
  query Tags {
    tags {
      id
      name
    }
  }
`;

export const RegisterItem: VFC<{
  register: UseFormRegister<Inputs>;
  setValue: UseFormSetValue<Inputs>;
  showState?: boolean;
  showTags?: boolean;
  showImages?: boolean;
  defaultValues?: Omit<Inputs, "images">;
}> = ({
  register,
  setValue,
  showState = false,
  showTags = true,
  showImages = true,
  defaultValues,
}) => {
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

  const [selectedItems, setSelectedItems] = useState<AutocompleteItem[]>([]);

  const handleSelectedItemsChange = (selectedItems?: AutocompleteItem[]) => {
    if (selectedItems) {
      setValue("tags", selectedItems);
      setSelectedItems(selectedItems);
    }
  };

  useEffect(() => {
    if (tagsQueryError) throw tagsQueryError;
  }, [tagsQueryError]);

  if (tagsQueryLoading) {
    return <Spinner />;
  }

  if (tagsQueryError) {
    return <Text>エラーが発生しました。再度読み込んでください。</Text>;
  }

  return (
    <>
      <Text>
        <Link href="/teams" passHref>
          <ChakraLink color="blue.600" fontWeight={"bold"}>
            利用規約
          </ChakraLink>
        </Link>
        と
        <Link href="/inhibition" passHref>
          <ChakraLink color="blue.600" fontWeight={"bold"}>
            出品物ガイドライン
          </ChakraLink>
        </Link>
        を遵守してください。
      </Text>
      <Text>iPhoneのSafariでは画像が正しくアップロードできません。</Text>
      <Text>お手数ですがGoogle Chromeの利用をお願いします。</Text>

      <FormControl id="name">
        <FormLabel>名前</FormLabel>
        <Input
          placeholder="例: 物理の教科書"
          _placeholder={{ color: "gray.500" }}
          type="text"
          defaultValue={defaultValues?.name}
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
          defaultValue={defaultValues?.description}
          {...register("description")}
        />
      </FormControl>

      <FormControl id="price">
        <FormLabel>金額</FormLabel>
        <Input
          placeholder="譲る場合は0円にしてください。"
          _placeholder={{ color: "gray.500" }}
          defaultValue={defaultValues?.price}
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
        <FormLabel>商品のコンディション</FormLabel>
        <Select
          _placeholder={{ color: "gray.500" }}
          defaultValue={defaultValues?.condition}
          {...register("condition", {
            valueAsNumber: true,
            required: {
              value: true,
              message: "商品のコンディションが選択されていません。",
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

      {showState && (
        <FormControl id="state">
          <FormLabel>商品の状況</FormLabel>
          <Select
            _placeholder={{ color: "gray.500" }}
            defaultValue={defaultValues?.state}
            {...register("state", {
              valueAsNumber: true,
              required: {
                value: true,
                message: "商品の状況が選択されていません。",
              },
            })}
          >
            {Object.keys(stateMap).map((key) => (
              <option key={key} value={key}>
                {convertState(Number(key))}
              </option>
            ))}
          </Select>
        </FormControl>
      )}

      {showTags && (
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
      )}

      {showImages && (
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
          />
        </FormControl>
      )}
    </>
  );
};
