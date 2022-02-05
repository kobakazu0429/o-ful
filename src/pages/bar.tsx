import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { useQuery, gql } from "@apollo/client";
import { HogefugaQueryResult } from "../generated/graphql";
import { useUid } from "../store/user";

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

const Bar: NextPage = () => {
  const session = useSession();
  const uid = useUid();
  console.log("uid:", uid);

  // const { data, error } = useQuery<HogefugaQueryResult>(ALL_ITEMS_QUERY);
  console.log(session);

  if (session?.data?.session) {
    return (
      <>
        {/* Signed in as {session.user.email} <br /> */}
        uid: {uid}
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return <p>no loigin</p>;

  // return (
  //   <div>
  //     <pre>{JSON.stringify(data, null, 2)}</pre>
  //   </div>
  // );
};

export default Bar;
