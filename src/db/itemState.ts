export const stateMap = {
  0: "下書き",
  10: "販売中、取引中",
  20: "売り切れ、在庫なし",
};

export const convertState = (state: number) => {
  switch (state) {
    case 0:
    case 10:
    case 20:
      return stateMap[state];

    default:
      return "不明";
  }
};
