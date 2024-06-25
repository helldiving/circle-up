import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  // State to store the user profile
  const [user, setUser] = useState(null);
  // State to track if the user profile is loading
  const [loading, setLoading] = useState(true);
  // Get the username from the URL parameters
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        // Send a request to fetch the user profile
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();

        // Check for errors in the response
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // Update the user state with the fetched profile
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    // Fetch the user profile when the component mounts or the username changes
    getUser();
  }, [username, showToast]);
  return { loading, user };
};

export default useGetUserProfile;
