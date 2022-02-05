import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { ApolloProvider } from "@apollo/client";
import { initializeApollo } from "../lib/apolloClient";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const client = initializeApollo();
  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}

export default MyApp;
