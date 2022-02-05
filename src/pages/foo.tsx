import type { NextPage } from "next";
import { useQuery, gql } from "@apollo/client";
import { HogefugaQueryResult } from "../generated/graphql";

export const ALL_ITEMS_QUERY = gql`
  query HOGEFUGA {
    items {
      id
      name
      description
      item_tags {
        id
        tag {
          name
        }
      }
      item_images {
        id
        url
      }
    }
  }
`;

const Foo: NextPage = () => {
  const { data, error } = useQuery<HogefugaQueryResult>(ALL_ITEMS_QUERY);

  if (error) {
    console.log(error);
    return <p>error</p>;
  }
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Foo;
