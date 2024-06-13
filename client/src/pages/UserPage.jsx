import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
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
