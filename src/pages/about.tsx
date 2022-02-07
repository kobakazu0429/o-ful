import type { NextPage } from "next";
import { TextPageLayout, Content } from "../layouts/TextPage";

const Guide: NextPage = () => {
  return (
    <TextPageLayout title="o-ful">
      <Content title="">o-fulってなにのページです</Content>
    </TextPageLayout>
  );
};

export default Guide;
