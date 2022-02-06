import type { FC } from "react";
import { Text, Spinner, Center } from "@chakra-ui/react";

export const WithLoading: FC<{ loading: any; error?: any }> = ({
  children,
  loading,
  error = false,
}) => {
  return loading ? (
    <Center>
      <Spinner
        thickness="4px"
        speed="1s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  ) : error ? (
    <Text>エラーが発生しました。ページを更新してください。</Text>
  ) : (
    <>{children}</>
  );
};
