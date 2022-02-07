import type { NextPage } from "next";
import { TextPageLayout, Content } from "../layouts/TextPage";

const Guide: NextPage = () => {
  return (
    <TextPageLayout title="使い方">
      <Content title="">使い方ページです</Content>
    </TextPageLayout>
  );
};

export default Guide;
