import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { ApolloProvider } from "@apollo/client";
import {
  ChakraProvider,
  extendTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";
import { initializeApollo } from "../lib/apolloClient";

const theme = extendTheme({
  styles: {
    global: () => ({
      fonts: {
        ...chakraTheme.fonts,
        heading: `-apple-system,BlinkMacSystemFont,Hiragino Kaku Gothic ProN,Hiragino Sans,Meiryo,sans-serif,Segoe UI Emoji`,
      },
    }),
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const client = initializeApollo();
  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <ApolloProvider client={client}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </ApolloProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}

export default MyApp;
