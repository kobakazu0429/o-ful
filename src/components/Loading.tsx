import type { FC } from "react";
import { Text } from "@chakra-ui/react";
import { Spinner } from "./Spinner";

export const WithLoading: FC<{ loading: any; error?: any }> = ({
  children,
  loading,
  error = false,
}) => {
  return loading ? (
    <Spinner />
  ) : error ? (
    <Text>エラーが発生しました。ページを更新してください。</Text>
  ) : (
    <>{children}</>
  );
};
