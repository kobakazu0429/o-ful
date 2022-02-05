import { atom, useRecoilValue } from "recoil";

export const uid = atom<string | null>({
  key: "uid",
  default: null,
});

export const useUid = () => {
  return useRecoilValue(uid);
};
