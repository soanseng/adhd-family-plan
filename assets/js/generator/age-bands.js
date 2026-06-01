export const ageBands = [
  {
    id: "preschool",
    label: "4-5 歲",
    min: 4,
    max: 5,
    focus: ["短指令", "立即增強", "少量目標", "照顧者一致規則"],
  },
  {
    id: "lowerElementary",
    label: "6-8 歲",
    min: 6,
    max: 8,
    focus: ["視覺化流程", "星星表", "作業短衝刺", "情緒休息區"],
  },
  {
    id: "upperElementary",
    label: "9-12 歲",
    min: 9,
    max: 12,
    focus: ["任務拆解", "自我監測", "家校合作", "逐步責任"],
  },
  {
    id: "adolescent",
    label: "13-17 歲",
    min: 13,
    max: 17,
    focus: ["協商式目標", "螢幕契約", "讀書計畫", "睡眠與自主性"],
  },
];

export function getAgeBand(age) {
  const numericAge = Number(age);
  return ageBands.find((band) => numericAge >= band.min && numericAge <= band.max) || ageBands[1];
}
