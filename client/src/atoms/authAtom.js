import { atom } from "recoil";

// an atom in recoil is the same as a slice in redux

const authScreenAtom = atom({
  key: "authScreenAtom",
  default: "login",
});

export default authScreenAtom;
