import { atom } from "recoil";

// atom to store the user info with the default value being the user info from local storage

const userAtom = atom({
  key: "userAtom",
  default: JSON.parse(localStorage.getItem("user-info")),
});

export default userAtom;
