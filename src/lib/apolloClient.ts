import { useEffect, useState } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import type { NormalizedCacheObject } from "@apollo/client";
import { useSession } from "next-auth/react";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

export const useApollo = () => {
  const session = useSession();
  const cache = new InMemoryCache();

  const [apolloClient, setApolloClient] = useState<
    ApolloClient<NormalizedCacheObject>
  >(
    new ApolloClient({
      ssrMode: typeof window === "undefined",
      link: new HttpLink({
        uri: "https://o-ful.herokuapp.com/v1/graphql",
        headers: {
          "x-hasura-role": "user",
          "x-hasura-uid": session.data?.user?.uid ?? "",
        },
      }),
      cache,
    })
  );

  useEffect(() => {
    setApolloClient(
      new ApolloClient({
        ssrMode: typeof window === "undefined",
        link: new HttpLink({
          uri: "https://o-ful.herokuapp.com/v1/graphql",
          headers: {
            "x-hasura-role": "user",
            "x-hasura-uid": session.data?.user?.uid ?? "",
          },
        }),
        cache,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return apolloClient;
};
