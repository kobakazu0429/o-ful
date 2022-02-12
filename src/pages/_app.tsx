import "../styles/globals.css";
import { useCallback, useEffect } from "react";
import type { FC } from "react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import NextHeadSeo from "next-head-seo";
import { getAnalytics, logEvent } from "firebase/analytics";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import {
  ChakraProvider,
  extendTheme,
  theme as chakraTheme,
} from "@chakra-ui/react";
import { useApollo } from "../lib/apolloClient";
import { createFirebaseApp } from "../lib/firebase";
import { canonicalUrl } from "../utils/canonicalUrl";

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
  const router = useRouter();

  const logUrl = useCallback((path: string) => {
    logEvent(getAnalytics(), "page_view", { page_path: path });
  }, []);

  useEffect(() => {
    createFirebaseApp();

    router.events.on("routeChangeComplete", logUrl);

    //For First Page
    logUrl(window.location.pathname);

    return () => {
      router.events.off("routeChangeComplete", logUrl);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SessionProvider session={session}>
      <MyApolloProvider>
        <ChakraProvider theme={theme}>
          <>
            <NextHeadSeo
              title="o-ful"
              description=""
              canonical={canonicalUrl("/")}
            />
            <Component {...pageProps} />
          </>
        </ChakraProvider>
      </MyApolloProvider>
    </SessionProvider>
  );
}

export default MyApp;
