import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import type { NormalizedCacheObject } from "@apollo/client";

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "https://o-ful.herokuapp.com/v1/graphql",
      headers: {
        "x-hasura-admin-secret": "",
      },
    }),
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = () => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};
