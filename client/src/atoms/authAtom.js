import { atom } from "recoil";

// an atom in recoil is the same as a slice in redux

// this atom is used to store the authentication screen state with the default value of "login"

const authScreenAtom = atom({
  key: "authScreenAtom",
  default: "login",
});

export default authScreenAtom;
