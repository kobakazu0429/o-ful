import "../styles/globals.css";
import type { FC } from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { ApolloProvider } from "@apollo/client";
import {
  ChakraProvider,
  extendTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";
import { useApollo } from "../lib/apolloClient";

const theme = extendTheme({
  styles: {
    global: () => ({
      "html, body, #__next": {
        height: "100%",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
      },
      fonts: {
        ...chakraTheme.fonts,
        heading: `-apple-system,BlinkMacSystemFont,Hiragino Kaku Gothic ProN,Hiragino Sans,Meiryo,sans-serif,Segoe UI Emoji`,
      },
    }),
  },
});

const MyApolloProvider: FC = ({ children }) => {
  const client = useApollo();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <RecoilRoot>
      <SessionProvider session={session}>
        <MyApolloProvider>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </MyApolloProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}

export default MyApp;
