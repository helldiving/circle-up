import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
// import Post from "../components/Post";
// import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
// import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  // const { user, loading } = useGetUserProfile();
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !loading) return <h1>User not found</h1>;

  return (
    <>
      <UserHeader user={user} />
      <UserPost
        likes={4}
        replies={2}
        postImg="/post1.png"
        postTitle="This man ate my son"
      />
      <UserPost
        likes={10}
        replies={5}
        postImg="/post2.png"
        postTitle="In an attempt to boost player morale, the Bucs have purchased world renowned institution, Mons Venus. Baker Mayfield exclaims this is 'an excellent investment.'"
      />
      <UserPost
        likes={1}
        replies={10}
        postImg="/post3.png"
        postTitle="Breaking: Musk outraged Luka Doncic reaches top 500 in Overwatch before him."
      />
      <UserPost
        likes={4}
        replies={0}
        postTitle="Hogwarts is real: the story of my worm trip"
      />

      {
        //Replace above text with something along the lines of: "Reddit mods dump GameStop and NVIDIA stock to buy Circle-Up's,launching it past orbit." - Mark Zuckerberg.
      }
    </>
  );
};

export default UserPage;
