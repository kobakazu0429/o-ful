import type { NextPage } from "next";
import { Header } from "../components/Header";
import { BlockItem } from "../components/BlockItem";
import { Hero } from "../components/Hero";
import { Wrap, Heading } from "@chakra-ui/react";

const Home: NextPage<{
  data: {
    id: string;
    description: string;
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
      small_s3: string;
    };
    likes: number;
  }[];
}> = ({ data }) => {
  return (
    <>
      <Header></Header>
      <Hero></Hero>
      <Heading size="lg" p={10}>
        最近追加されたもの
      </Heading>
      <Wrap
        marginTop={0}
        marginX="auto"
        spacing="30px"
        align="center"
        justify="center"
        maxWidth="80%"
      >
        {data.map((d) => (
          <BlockItem
            key={d.id}
            coverImageUrl={d.urls.small}
            name={d.description}
            price={d.likes}
          />
        ))}
      </Wrap>
    </>
  );
};

export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(
    `https://api.unsplash.com//photos/random/?client_id=Q3MYf9f6AkMDXdkHX_yA7qbYGPFQ_FWfjGjP_9AvamM&query=item&count=30`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default Home;
