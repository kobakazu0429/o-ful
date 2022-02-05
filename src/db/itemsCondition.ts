const conditionMap = {
  0: {
    label: "新品、未使用",
    description: "購入してからあまり時間が経っておらず、一度も使用していない",
  },
  10: {
    label: "未使用に近い",
    description: "数回しか使用しておらず、傷や汚れがない",
  },
  20: {
    label: "目立った傷や汚れなし",
    description: "よく見ないとわからない程度の傷や汚れがある",
  },
  30: {
    label: "やや傷や汚れあり",
    description: "中古品とわかる程度の傷や汚れがある",
  },
  40: {
    label: "傷や汚れあり",
    description: "誰がみてもわかるような大きな傷や汚れがある",
  },
};

export const convertCondition = (condition: number) => {
  switch (condition) {
    case 0:
    case 10:
    case 20:
    case 30:
    case 40:
      return conditionMap[condition];

    default:
      return {
        label: "不明",
        description: "不明",
      };
  }
};
