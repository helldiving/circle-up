import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const useFollowUnfollow = (user) => {
  // Get the current user from the userAtom
  const currentUser = useRecoilValue(userAtom);

  // Check if the current user is already following the user
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );

  // State to track if the follow/unfollow request is in progress

  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    // Check if the user is logged in
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    // Check if an update is already in progress
    if (updating) return;

    setUpdating(true);
    try {
      // Send a request to follow/unfollow the user
      const res = await fetch(`/api/users/follow/${user._id}`, {
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

      // Update the following state and simulate adding/removing from followers
      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop(); // simulate removing from followers
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(currentUser?._id); // simulate adding to followers
      }
      setFollowing(!following);

      console.log(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
