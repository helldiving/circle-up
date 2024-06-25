import { atom } from "recoil";

// atom to store the lists of posts with the default value being an empty array

const postsAtom = atom({
  key: "postsAtom",
  default: [],
});

export default postsAtom;
