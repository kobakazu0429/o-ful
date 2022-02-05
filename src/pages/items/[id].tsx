import type { NextPage } from "next";
import { useQuery, gql } from "@apollo/client";
import type {
  ItemDetailQuery,
  ItemDetailQueryVariables,
} from "../../generated/graphql";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
// import Image from "next/image";
import { WithHeaderFooter } from "../../layouts/WithHeaderFooter";
import {
  Box,
  Stack,
  Text,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  Tag,
  HStack,
  List,
  ListItem,
} from "@chakra-ui/react";
import { convertCondition } from "../../db/itemsCondition";
import { convertState } from "../../db/itemState";

export const ITEM_QUERY = gql`
  query ItemDetail($id: Int!) {
    items_by_pk(id: $id) {
      name
      price
      description
      state
      condition
      item_images {
        url
        id
      }
      item_tags {
        tag {
          name
          id
        }
      }
      user_item {
        user {
          nickname
          user_sns_id {
            twitter_id
          }
        }
      }
    }
  }
`;

const Item: NextPage = () => {
  const { data, error, loading } = useQuery<
    ItemDetailQuery,
    ItemDetailQueryVariables
  >(ITEM_QUERY, {
    variables: { id: 1 },
  });

  if (loading) {
    return <p>loading...</p>;
  }

  if (!data || !data.items_by_pk || error) {
    console.log(error);
    return <p>error</p>;
  }

  console.log(data);

  return (
    <WithHeaderFooter>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex>
          {/* <Image
            rounded={"md"}
            alt={"product image"}
            src={
              "https://images.unsplash.com/photo-1596516109370-29001ec8ec36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODE1MDl8MHwxfGFsbHx8fHx8fHx8fDE2Mzg5MzY2MzE&ixlib=rb-1.2.1&q=80&w=1080"
            }
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          /> */}
          <Box w={{ base: "100%", sm: "400px", lg: "500px" }}>
            <Carousel
              showStatus={false}
              showIndicators={false}
              infiniteLoop={true}
              useKeyboardArrows={true}
            >
              {data.items_by_pk.item_images.map(({ id, url }) => {
                return (
                  <div key={id}>
                    <img src={url} alt="" />
                  </div>
                );
              })}
            </Carousel>
          </Box>
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {data.items_by_pk.name}
            </Heading>
            <Text color={"gray.900"} fontWeight={300} fontSize={"2xl"}>
              出品者: {data.items_by_pk.user_item?.user.nickname} さん
            </Text>
            <Text color={"gray.900"} fontWeight={300} fontSize={"2xl"}>
              出品者: {data.items_by_pk.user_item?.user.user_sns_id?.twitter_id}{" "}
              さん
            </Text>
            <Text color={"gray.900"} fontWeight={300} fontSize={"2xl"}>
              参考価格: &yen; {data.items_by_pk.price.toLocaleString()}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={<StackDivider borderColor={"gray.200"} />}
          >
            <VStack spacing={{ base: 4, sm: 6 }} align="left">
              <Text fontSize={"lg"}>{data.items_by_pk.description}</Text>
            </VStack>
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={"yellow.500"}
                fontWeight={"500"}
                mb={"4"}
              >
                タグ
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <HStack spacing={4}>
                  {data.items_by_pk.item_tags.map(({ tag }) => {
                    return <Tag key={tag.id}>{tag.name}</Tag>;
                  })}
                </HStack>
              </SimpleGrid>
            </Box>
            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={"yellow.500"}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                詳細
              </Text>

              <List spacing={2}>
                <ListItem>
                  <Text as={"span"} fontWeight={"bold"}>
                    状況:
                  </Text>{" "}
                  {convertState(data.items_by_pk.state)}
                </ListItem>
                <ListItem>
                  <Text as={"span"} fontWeight={"bold"}>
                    コンディション:
                  </Text>{" "}
                  {convertCondition(data.items_by_pk.condition).label}
                </ListItem>
              </List>
            </Box>
          </Stack>

          <Button
            rounded={"none"}
            w={"full"}
            mt={8}
            size={"lg"}
            py={"7"}
            bg={"gray.900"}
            color={"white"}
            textTransform={"uppercase"}
            _hover={{
              transform: "translateY(2px)",
              boxShadow: "lg",
            }}
          >
            出品者と詳しく話す
          </Button>
        </Stack>
      </SimpleGrid>
    </WithHeaderFooter>
  );
};

export default Item;
