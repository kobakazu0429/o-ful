import type { NextPage } from "next";
import { ListItem, UnorderedList, Text } from "@chakra-ui/react";
import { TextPageLayout, Content } from "../layouts/TextPage";

const Privacy: NextPage = () => {
  return (
    <TextPageLayout title="プライバシーポリシー">
      <Content title="個人情報の取扱について">
        <UnorderedList>
          <ListItem>
            本サイトは、ユーザーに本サービスを提供するにあたり、個人情報に関する法令を遵守します。
          </ListItem>
          <ListItem>
            本サイトは、個人情報をご本人の同意なく無断で収集・利用または第三者に提供することはありません。
          </ListItem>
          <ListItem>
            本サイトは、個人情報の収集にあたり、その利用目的を明らかにするとともに利用目的の範囲内で、適正かつ公正な手段によって行います。なお、収集した情報については統計調査などのために個人を特定できない形態で利用させていただく場合があることを予めご了承下さい。
          </ListItem>
        </UnorderedList>
      </Content>

      <Content title="個人情報の開示・訂正・削除について">
        <Text>
          本サイトが収集した個人情報は、本人による申請や苦情があった場合、所定の手続きをもって開示、訂正、削除いたします。
        </Text>
      </Content>

      <Content title="プライバシーポリシーの改訂について">
        <Text>
          本サイトは、個人情報の取り扱いに関する運用状況を適宜見直し、継続的な改善に努めるものとし、必要に応じて、プライバシーポリシーを変更することがあります。
        </Text>
        <Text>
          本ポリシーを変更した場合には、本ページ上に掲載いたします。
          変更された本ポリシーは、掲載を開始した時点から適用されるものとします。
        </Text>
      </Content>

      <Content title="お問い合わせ">
        <Text>
          本サイトの個人情報の取扱に関するお問い合せは、お問い合わせフォームよりご連絡ください。
        </Text>
      </Content>
    </TextPageLayout>
  );
};

export default Privacy;
