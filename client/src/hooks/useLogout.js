import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import useShowToast from "./useShowToast";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const setPosts = useSetRecoilState(postsAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

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
      localStorage.removeItem("user-info");
      setUser(null);
      setPosts([]);
      navigate("/auth"); // navigate back to login page
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };
  return logout;
};

export default useLogout;
