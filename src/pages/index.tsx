import type { NextPage } from "next";
import Link from "next/link";
import { Wrap, Heading, Text, Spinner } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { useCheckAlreadyLogin } from "../auth/user";
import { Header } from "../components/Header";
import { BlockItem } from "../components/BlockItem";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
import { RecentItemsQuery } from "../generated/graphql";

const ITEMS_QUERY = gql`
  query RecentItems {
    items(order_by: { updated_at: asc }) {
      id
      name
      price
      item_images {
        url
      }
    }
  }
`;

const Home: NextPage = () => {
  useCheckAlreadyLogin();
  const { data, loading, error } = useQuery<RecentItemsQuery>(ITEMS_QUERY);

  return (
    <>
      <Header />
      <Hero />
      <Heading size="lg" p={10}>
        最近追加されたもの
      </Heading>

      <Wrap
        mb={8}
        marginX="auto"
        spacing={{
          base: "10px",
          md: "30px",
        }}
        justify="center"
        maxWidth={{
          base: "90%",
          md: "100%",
          xl: "80%",
        }}
      >
        {loading ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : error ? (
          <Text>エラーが発生しました。ページを更新してみてください。</Text>
        ) : (
          data?.items.map((item) => (
            <Link key={item.id} href={`/items/${item.id}`}>
              <a>
                <BlockItem
                  coverImageUrl={item.item_images[0].url}
                  name={item.name}
                  price={item.price}
                />
              </a>
            </Link>
          ))
        )}
      </Wrap>
      <Footer />
    </>
  );
};

export default Home;
