import type { NextPage } from "next";
import { TextPageLayout, Content } from "../../layouts/TextPage";

const Tokushoho: NextPage = () => {
  return (
    <TextPageLayout title="特定商取引に関する表記">
      本サイトは通信販売サイト等ではありませんが、通信販売サイトであると仮定すると以下の通りとなります。
      <Content title="ホームページ">https://o-ful.vercel.app/</Content>
      <Content title="メールアドレス">o-ful (at) kaz.dev</Content>
      <Content title="販売価格">
        各商品ページの参考価格に基づき、協議のもと決定する。
      </Content>
      <Content title="支払い方法">販売者・購入者の協議のもと決定する。</Content>
      <Content title="商品代金以外の必要経費">
        振込手数料、決済手数料などの支払い手数料。商品の引き渡しが郵送である場合はその送料など。
      </Content>
      <Content title="商品引き渡し時期">
        販売者・購入者の協議のもと決定する。
      </Content>
      <Content title="品の引き渡し方法">
        販売者・購入者の協議のもと決定する。
      </Content>
      <Content title="返品・交換について">
        購入者都合による返品・交換は受け付けておりません。
        不良品等に関しましては販売者への連絡対応を行ってください。
      </Content>
      <Content title="その他">
        &#8251;上記以外の事項に関しまして、請求があれば請求内容に基づき遅延なく提示または連絡いたします。
      </Content>
    </TextPageLayout>
  );
};

export default Tokushoho;
