export const convertState = (state: number) => {
  switch (state) {
    case 0:
      return "下書き";

    case 10:
      return "販売中、取引中";

    case 20:
      return "売り切れ、在庫なし";

    default:
      return "不明";
  }
};
