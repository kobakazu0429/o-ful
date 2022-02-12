import type { NextPage } from "next";
import Link from "next/link";
import NextHeadSeo from "next-head-seo";
import { Wrap, Heading, Flex } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import { Header } from "../components/Header";
import { BlockItem } from "../components/BlockItem";
import { Hero } from "../components/Hero";
import { Footer } from "../components/Footer";
import { WithLoading } from "../components/Loading";
import { RecentItemsQuery } from "../generated/graphql";
import { canonicalUrl } from "../utils/canonicalUrl";

const ITEMS_QUERY = gql`
  query RecentItems {
    items(where: { state: { _eq: 10 } }, order_by: { updated_at: desc }) {
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
  const { data, loading, error } = useQuery<RecentItemsQuery>(ITEMS_QUERY);

  return (
    <>
      <NextHeadSeo
        title="o-ful"
        description="あなたの教科書、誰かに使ってもらいませんか？o-fulは教科書や参考書など自分にとって必要なくなったものとそれを欲しい人を繋げるマッチングサービスです。"
        canonical={canonicalUrl("/")}
      />
      <Flex direction={"column"} height="100%">
        <Header />
        <Hero />
        <Heading size="lg" p={10}>
          最近追加されたもの
        </Heading>

        <Wrap
          flex="1"
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
          <WithLoading error={error} loading={loading}>
            {data?.items.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`}>
                <a>
                  <BlockItem
                    coverImageUrl={
                      item.item_images[0]?.url ??
                      "https://placehold.jp/150x150.png?text=no image"
                    }
                    name={item.name}
                    price={item.price}
                  />
                </a>
              </Link>
            ))}
          </WithLoading>
        </Wrap>
        <Footer />
      </Flex>
    </>
  );
};

export default Home;
