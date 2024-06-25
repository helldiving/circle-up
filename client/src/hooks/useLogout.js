import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const logout = async () => {
    try {
      // Send a request to logout the user
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      // Check for errors in the response
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // Clear the user info from local storage and state
      localStorage.removeItem("user-info"); // if error -> will clear local storage
      setUser(null); // and will clear state
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return logout;
};

export default useLogout;
