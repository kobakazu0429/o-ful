import type { NextPage } from "next";
import NextHeadSeo from "next-head-seo";
import { ListItem, UnorderedList, Text } from "@chakra-ui/react";
import { TextPageLayout, Content } from "../layouts/TextPage";
import { canonicalUrl } from "../utils/canonicalUrl";

const Inhibition: NextPage = () => {
  return (
    <>
      <NextHeadSeo
        title="出品物ガイドライン"
        description="o-fulの出品物ガイドライン"
        canonical={canonicalUrl("/inhibition")}
      />
      <TextPageLayout title="出品物ガイドライン">
        <Content title="出品可能物">
          <Text>
            下記リストはユーザーに所有権などがあり、第三者に販売もしくは譲ることが適法なものに限ります。
          </Text>
          <UnorderedList>
            <ListItem>教科書</ListItem>
            <ListItem>参考書</ListItem>
            <ListItem>電子辞書</ListItem>
            <ListItem>寮で使っていた家具</ListItem>
            <ListItem>その他</ListItem>
          </UnorderedList>
        </Content>

        <Content title="出品禁止物">
          <UnorderedList>
            <ListItem>定期試験の過去問</ListItem>
            <ListItem>出品可能物に含まれないもの</ListItem>
            <ListItem>出品が違法であるもの</ListItem>
            <ListItem>利用規約等の諸規定に反するもの</ListItem>
          </UnorderedList>
        </Content>
      </TextPageLayout>
    </>
  );
};

export default Inhibition;
